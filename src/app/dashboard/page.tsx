"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Search, MapPin, DollarSign, Filter, Phone, Mail, Plus, Check, CheckCircle2, Clock, RotateCcw, BarChart3, List, Map, Send, Loader2, Sparkles, Star, Bot } from "lucide-react";
import { toast } from "sonner";

import { Daycare } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOutreachStore } from "@/store/useOutreachStore";
import FloatingOutreachBar from "@/components/FloatingOutreachBar";
import AIAssistant from "@/components/AIAssistant";
import { getUserOutreachLogs, getProviders, OutreachLog } from "@/app/actions/daycareActions";
import { requestVerifiedSpot } from "@/app/actions/spotActions";

const DaycareMap = dynamic(() => import("@/components/DaycareMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full rounded-xl bg-muted/50 border border-border/60 flex flex-col items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Loading map...</p>
        </div>
    ),
});


export default function DashboardPage() {
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedAge, setSelectedAge] = useState<string>("all");
    const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const { selectedDaycares, toggleDaycare } = useOutreachStore();
    const [outreachLogs, setOutreachLogs] = useState<OutreachLog[]>([]);
    const [allDaycares, setAllDaycares] = useState<Daycare[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [requestedSpots, setRequestedSpots] = useState<Set<string>>(new Set());
    const [requestingId, setRequestingId] = useState<string | null>(null);
    const [aiRecommendations, setAiRecommendations] = useState<{ id: string, reason: string }[]>([]);

    // Analysis State
    const [analyzingDaycareId, setAnalyzingDaycareId] = useState<string | null>(null);
    const [daycareAnalyses, setDaycareAnalyses] = useState<Record<string, string>>({});

    // Fetch providers from Supabase + outreach history
    useEffect(() => {
        Promise.all([
            getProviders(),
            getUserOutreachLogs(),
        ]).then(([providers, logs]) => {
            setAllDaycares(providers);
            setOutreachLogs(logs);

            // Initialize the Set of already requested spots from the server data
            const requested = new Set<string>();
            providers.forEach((p) => {
                if (p.hasRequestedSpot) requested.add(p.id);
            });
            setRequestedSpots(requested);

            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, []);

    // Handle direct spot request for verified daycares
    const handleDirectRequest = async (daycare: Daycare) => {
        setRequestingId(daycare.id);
        try {
            const result = await requestVerifiedSpot(daycare.id);
            if (result.success) {
                toast.success(`Spot request sent to ${daycare.name}!`, {
                    description: result.message,
                });

                // Optimistically update both the Set and the local exact object
                setRequestedSpots((prev) => new Set(prev).add(daycare.id));
                daycare.hasRequestedSpot = true;
                daycare.requestedAt = new Date().toISOString();

            } else {
                toast.error("Request failed", { description: result.error });
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setRequestingId(null);
        }
    };

    // Helper: get the most recent log for a provider
    const getLatestLog = (providerId: string) => {
        const providerLogs = outreachLogs.filter(
            (log) => log.provider_id === providerId
        );
        if (providerLogs.length === 0) return null;
        return providerLogs.reduce((latest, log) =>
            new Date(log.sent_at) > new Date(latest.sent_at) ? log : latest
        );
    };

    // Handle Individual Daycare Analysis
    const handleAnalyzeDaycare = async (daycare: Daycare) => {
        if (daycareAnalyses[daycare.id]) return;

        setAnalyzingDaycareId(daycare.id);
        try {
            const payload = {
                name: daycare.name,
                city: daycare.location.city,
                capacity: daycare.capacity,
                priceMonth: daycare.priceMonth,
                isVerified: daycare.isVerified,
                googleMapReview: daycare.googleMapReview,
                userRatingsTotal: daycare.userRatingsTotal,
            };

            const res = await fetch("/api/analyze-daycare", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ daycare: payload }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to analyze daycare");
            }

            setDaycareAnalyses(prev => ({ ...prev, [daycare.id]: data.analysis }));
        } catch (error: unknown) {
            console.error("Error analyzing daycare:", error);
            const err = error as Error;
            toast.error("Analysis Failed", { description: err.message || "An unexpected error occurred." });
        } finally {
            setAnalyzingDaycareId(null);
        }
    };

    const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

    // Client-side filtering logic
    const filteredDaycares = useMemo(() => {
        return allDaycares.filter((daycare: Daycare) => {
            // Filter by City
            if (selectedCity !== "all" && daycare.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
                return false;
            }

            // Filter by Verified Status
            if (showVerifiedOnly && !daycare.isVerified) {
                return false;
            }

            return true;
        });
    }, [selectedCity, showVerifiedOnly, allDaycares]);

    const displayedDaycares = useMemo(() => {
        if (aiRecommendations.length > 0) {
            return aiRecommendations.map(rec => {
                const daycare = filteredDaycares.find(d => d.id === rec.id);
                return daycare ? { ...daycare, aiReason: rec.reason } : null;
            }).filter(Boolean) as (Daycare & { aiReason?: string })[];
        }
        return filteredDaycares as (Daycare & { aiReason?: string })[];
    }, [filteredDaycares, aiRecommendations]);

    const uniqueCities = useMemo(() => {
        const cities = new Set(allDaycares.map(d => d.location.city));
        return Array.from(cities).sort();
    }, [allDaycares]);

    const SidebarContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Filters</h3>
                <p className="text-sm text-muted-foreground mb-6">Refine your daycare search</p>
            </div>

            <div className="space-y-4">
                <Label className="text-base font-medium">City</Label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {uniqueCities.map(city => (
                            <SelectItem key={city} value={city.toLowerCase()}>
                                {city}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <Label className="text-base font-medium">Availability</Label>
                <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border border-border/50">
                    <Checkbox
                        id="verified-only"
                        checked={showVerifiedOnly}
                        onCheckedChange={(checked) => setShowVerifiedOnly(checked as boolean)}
                    />
                    <Label htmlFor="verified-only" className="cursor-pointer font-normal">
                        Show only Verified Availability
                    </Label>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-base font-medium">Age Group (Mock)</Label>
                <RadioGroup value={selectedAge} onValueChange={setSelectedAge} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 flex-grow">
                        <RadioGroupItem value="all" id="r0" />
                        <Label htmlFor="r0" className="cursor-pointer font-normal">All Ages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="infant" id="r1" />
                        <Label htmlFor="r1" className="cursor-pointer font-normal">Infant (0-18m)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="toddler" id="r2" />
                        <Label htmlFor="r2" className="cursor-pointer font-normal">Toddler (18-36m)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="preschool" id="r3" />
                        <Label htmlFor="r3" className="cursor-pointer font-normal">Preschool (3-5y)</Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Campaign Tracker CTA */}
            <div className="pt-2 border-t border-border/50">
                <Link href="/analytics" className="block">
                    <div className="group bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 dark:from-primary/10 dark:via-blue-950/30 dark:to-indigo-950/20 border border-primary/20 rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 group-hover:bg-primary/20 p-2 rounded-lg transition-colors">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <h4 className="font-bold text-sm text-foreground">Campaign Tracker</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            View responses, track waitlists, and monitor your outreach performance.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
                <div className="container px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Search className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground mr-2 hidden md:inline-block">
                            Found {displayedDaycares.length} results
                        </span>
                        <Link href="/analytics">
                            <Button variant="ghost" size="icon" className="relative group">
                                <BarChart3 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="sr-only">Analytics</span>
                            </Button>
                        </Link>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                            JS
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Toggle */}
                <div className="md:hidden flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                    <span className="font-semibold">Filters ({displayedDaycares.length} results)</span>
                    {/* Placeholder for actual mobile sheet, if sheet was installed. Since it might not be, well implement standard div toggle later if needed. For now, it requires screen size. */}
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Sidebar (Desktop) */}
                <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
                    <div className="sticky top-24 bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
                        <SidebarContent />
                    </div>
                </aside>

                {/* Main Content (Grid) */}
                <main className="flex-1 min-w-0">
                    <AIAssistant
                        daycares={filteredDaycares}
                        onRecommendations={setAiRecommendations}
                        isFiltering={aiRecommendations.length > 0}
                    />

                    <div className="flex justify-between items-center mb-6 hidden md:flex">
                        <h2 className="text-2xl font-bold tracking-tight">Daycare Directory</h2>

                        {/* View Toggle */}
                        <div className="flex items-center bg-muted rounded-lg p-1 gap-0.5">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <List className="h-4 w-4" />
                                List
                            </button>
                            <button
                                onClick={() => setViewMode("map")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "map"
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Map className="h-4 w-4" />
                                Map
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center">
                            <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-muted-foreground font-medium">Loading daycares...</p>
                        </div>
                    ) : displayedDaycares.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-2xl border border-dashed">
                            <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No daycares found</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Try adjusting your filters to see more results.
                            </p>
                            <Button
                                variant="outline"
                                className="mt-6"
                                onClick={() => {
                                    setSelectedCity("all")
                                    setShowVerifiedOnly(false)
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    ) : viewMode === "map" ? (
                        <DaycareMap daycares={displayedDaycares} />
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                            {displayedDaycares.map((daycare) => (
                                <Card key={daycare.id} className="overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60 flex flex-col h-full bg-card/60 hover:bg-card relative">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start gap-3 mb-2">
                                            <div className="space-y-1 min-w-0">
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight line-clamp-1">
                                                    {daycare.name}
                                                </CardTitle>
                                                <CardDescription className="flex flex-col gap-1 text-sm font-medium">
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                                                        {daycare.location.city}, BC
                                                    </div>
                                                    {daycare.googleMapReview != null && daycare.userRatingsTotal != null && (
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <span className="font-semibold text-foreground">{daycare.googleMapReview.toFixed(1)}</span>
                                                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 -mt-0.5" />
                                                            <span className="text-muted-foreground ml-0.5">({daycare.userRatingsTotal} reviews)</span>
                                                        </div>
                                                    )}
                                                </CardDescription>
                                            </div>

                                            {/* Availability Badge */}
                                            {daycare.nextOpening ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 shadow-none font-semibold px-2.5 py-1 whitespace-nowrap flex-shrink-0">
                                                    Opening: {new Date(daycare.nextOpening).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-slate-200 shadow-none font-semibold px-2.5 py-1 whitespace-nowrap flex-shrink-0">
                                                    Waitlist Only
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Verified Badge */}
                                        {daycare.isVerified && (
                                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 shadow-none font-semibold px-2 py-0.5 text-xs w-fit">
                                                ✓ Verified Partner
                                            </Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="pb-6 flex-1 space-y-4">
                                        {/* AI Reason (if present) */}
                                        {daycare.aiReason && (
                                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm flex gap-2.5 items-start shadow-sm mx-1">
                                                <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <p className="text-primary/95 font-medium leading-[1.4]">{daycare.aiReason}</p>
                                            </div>
                                        )}

                                        {/* Contact Info */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                                <span className="font-medium">{daycare.phone}</span>
                                            </div>
                                            {daycare.email && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                                    <span className="font-medium truncate">{daycare.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats Row */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                                            <div className="flex flex-col gap-1.5 bg-background border border-border/50 rounded-lg p-3 flex-1 flex-shrink-0">
                                                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Price</span>
                                                <span className="text-lg font-bold flex items-center">
                                                    <DollarSign className="h-4 w-4 mr-0.5 text-muted-foreground" />
                                                    {daycare.priceMonth}/<span className="text-sm font-medium text-muted-foreground ml-1">mo</span>
                                                </span>
                                            </div>
                                            {daycare.isVerified && (
                                                <div className="flex flex-col gap-1.5 bg-background border border-border/50 rounded-lg p-3 flex-1 flex-shrink-0">
                                                    <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Capacity</span>
                                                    <span className="text-lg font-bold">
                                                        {daycare.capacity} <span className="text-sm font-medium text-muted-foreground">kids</span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Analyze Button or Result */}
                                        {!daycareAnalyses[daycare.id] ? (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleAnalyzeDaycare(daycare)}
                                                disabled={analyzingDaycareId === daycare.id}
                                                className="w-full bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 shadow-none font-semibold mt-2"
                                            >
                                                {analyzingDaycareId === daycare.id ? (
                                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</>
                                                ) : (
                                                    <><Bot className="h-4 w-4 mr-2" /> AI Analysis</>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="mt-2 bg-primary/5 p-3 rounded-lg border border-primary/10 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                                                <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                                                    <Bot className="h-4 w-4" /> AI Analysis
                                                </div>
                                                {daycareAnalyses[daycare.id]}
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="pt-0 pb-6 border-t border-border/40 mt-auto bg-card/40 flex">
                                        <div className="w-full mt-6">
                                            {daycare.isVerified ? (() => {
                                                const hasRequested = requestedSpots.has(daycare.id);
                                                const isRequesting = requestingId === daycare.id;

                                                if (hasRequested) {
                                                    const formattedDate = daycare.requestedAt
                                                        ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(daycare.requestedAt))
                                                        : "Recently";

                                                    return (
                                                        <Button
                                                            variant="outline"
                                                            disabled
                                                            className="w-full font-semibold bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                                                            Requested on {formattedDate}
                                                        </Button>
                                                    );
                                                }

                                                if (isRequesting) {
                                                    return (
                                                        <Button
                                                            disabled
                                                            className="w-full font-semibold shadow-sm"
                                                        >
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Sending Request...
                                                        </Button>
                                                    );
                                                }

                                                return (
                                                    <Button
                                                        onClick={() => handleDirectRequest(daycare)}
                                                        className="w-full font-semibold shadow-sm hover:translate-y-[-1px] transition-transform"
                                                    >
                                                        <Send className="h-4 w-4 mr-2" />
                                                        Request Spot Now
                                                    </Button>
                                                );
                                            })() : (() => {
                                                const isSelected = selectedDaycares.some((d) => d.id === daycare.id);
                                                const latestLog = getLatestLog(daycare.id);
                                                const daysSince = latestLog
                                                    ? Date.now() - new Date(latestLog.sent_at).getTime()
                                                    : null;
                                                const isRecentlyContacted = daysSince !== null && daysSince < FOURTEEN_DAYS_MS;
                                                const isFollowUp = daysSince !== null && daysSince >= FOURTEEN_DAYS_MS;

                                                if (isSelected) {
                                                    return (
                                                        <Button
                                                            onClick={() => toggleDaycare(daycare, isFollowUp)}
                                                            className="w-full font-semibold shadow-sm hover:translate-y-[-1px] transition-transform bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                                                        >
                                                            <Check className="h-4 w-4 mr-2" />
                                                            Added to Campaign
                                                        </Button>
                                                    );
                                                }

                                                if (isRecentlyContacted) {
                                                    const contactedDate = new Date(latestLog!.sent_at).toLocaleDateString("en-CA", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                    return (
                                                        <div className="space-y-2">
                                                            <Badge variant="outline" className="w-full justify-center py-1.5 bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 font-semibold">
                                                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                                Contacted {contactedDate} · Awaiting Reply
                                                            </Badge>
                                                            <Button
                                                                variant="outline"
                                                                disabled
                                                                className="w-full font-semibold opacity-50 cursor-not-allowed"
                                                            >
                                                                Recently Contacted
                                                            </Button>
                                                        </div>
                                                    );
                                                }

                                                if (isFollowUp) {
                                                    const contactedDate = new Date(latestLog!.sent_at).toLocaleDateString("en-CA", {
                                                        month: "short",
                                                        day: "numeric",
                                                    });
                                                    return (
                                                        <div className="space-y-2">
                                                            <Badge variant="outline" className="w-full justify-center py-1.5 bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 font-semibold">
                                                                Contacted {contactedDate}
                                                            </Badge>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => toggleDaycare(daycare, true)}
                                                                className="w-full font-semibold border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20 shadow-sm hover:translate-y-[-1px] transition-transform"
                                                            >
                                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                                Add to Follow-Up Campaign
                                                            </Button>
                                                        </div>
                                                    );
                                                }

                                                // Never contacted — original labels
                                                return (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => toggleDaycare(daycare, false)}
                                                        className="w-full font-semibold border-primary/20 text-primary hover:bg-primary/5 shadow-sm hover:translate-y-[-1px] transition-transform"
                                                    >
                                                        {daycare.contactMethod === "email" ? (
                                                            <><Mail className="h-4 w-4 mr-2" />Add to Email Campaign</>
                                                        ) : (
                                                            <><Plus className="h-4 w-4 mr-2" />Add to SMS Campaign</>
                                                        )}
                                                    </Button>
                                                );
                                            })()}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <FloatingOutreachBar />
        </div>
    );
}
