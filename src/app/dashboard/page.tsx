"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, DollarSign, Calendar, Filter } from "lucide-react";

import { DAYCARES, Daycare } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function DashboardPage() {
    const [selectedCity, setSelectedCity] = useState<string>("all");
    const [selectedAge, setSelectedAge] = useState<string>("all");
    const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);

    // Client-side filtering logic
    const filteredDaycares = useMemo(() => {
        return DAYCARES.filter((daycare: Daycare) => {
            // Filter by City
            if (selectedCity !== "all" && daycare.location.city.toLowerCase() !== selectedCity.toLowerCase()) {
                return false;
            }

            // Filter by Verified Status
            if (showVerifiedOnly && !daycare.isVerified) {
                return false;
            }

            // Filter by Age (Mocked layout - doesn't filter data as it's not strictly tied to mock data)
            // But we leave the state ready to filter if the dataset supported it.

            return true;
        });
    }, [selectedCity, showVerifiedOnly]);

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
                        <SelectItem value="coquitlam">Coquitlam</SelectItem>
                        <SelectItem value="burnaby">Burnaby</SelectItem>
                        <SelectItem value="vancouver">Vancouver</SelectItem>
                        <SelectItem value="port moody">Port Moody</SelectItem>
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
                        <span className="text-sm font-medium text-muted-foreground mr-4 hidden md:inline-block">
                            Found {filteredDaycares.length} results
                        </span>
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground">
                            JS
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Toggle */}
                <div className="md:hidden flex items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
                    <span className="font-semibold">Filters ({filteredDaycares.length} results)</span>
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
                <main className="flex-1">
                    <div className="flex justify-between items-center mb-6 hidden md:flex">
                        <h2 className="text-2xl font-bold tracking-tight">Daycare Directory</h2>
                    </div>

                    {filteredDaycares.length === 0 ? (
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
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredDaycares.map((daycare) => (
                                <Card key={daycare.id} className="overflow-hidden group hover:shadow-md transition-all duration-300 border-border/60 flex flex-col h-full bg-card/60 hover:bg-card">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors leading-tight line-clamp-1">
                                                    {daycare.name}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1.5 text-sm font-medium">
                                                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                                    {daycare.location.city}, BC
                                                </CardDescription>
                                            </div>

                                            {daycare.isVerified ? (
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 shadow-none font-semibold px-2.5 py-1 whitespace-nowrap">
                                                    Verified Partner
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200 shadow-none font-semibold px-2.5 py-1 whitespace-nowrap">
                                                    Gov Record / Phone Only
                                                </Badge>
                                            )}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pb-6 flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-2">
                                            <div className="flex flex-col gap-1.5 bg-background border border-border/50 rounded-lg p-3 flex-1 flex-shrink-0">
                                                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Price</span>
                                                <span className="text-lg font-bold flex items-center">
                                                    <DollarSign className="h-4 w-4 mr-0.5 text-muted-foreground" />
                                                    {daycare.priceMonth}/<span className="text-sm font-medium text-muted-foreground ml-1">mo</span>
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1.5 bg-background border border-border/50 rounded-lg p-3 flex-1 flex-shrink-0">
                                                <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">Availability</span>
                                                <span className="text-[15px] font-semibold flex items-center text-foreground">
                                                    <Calendar className="h-4 w-4 mr-1.5 text-muted-foreground" />
                                                    {daycare.nextOpening ? (
                                                        <span className="text-emerald-600 dark:text-emerald-500">{new Date(daycare.nextOpening).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground italic">Unknown</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-5 text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary/40"></span>
                                            Capacity: {daycare.capacity} kids
                                        </div>
                                    </CardContent>

                                    <CardFooter className="pt-0 pb-6 border-t border-border/40 mt-auto bg-card/40 flex">
                                        <div className="w-full mt-6">
                                            {daycare.isVerified ? (
                                                <Button className="w-full font-semibold shadow-sm hover:translate-y-[-1px] transition-transform">
                                                    View Schedule
                                                </Button>
                                            ) : (
                                                <Button variant="outline" className="w-full font-semibold border-primary/20 text-primary hover:bg-primary/5 shadow-sm hover:translate-y-[-1px] transition-transform">
                                                    Add to Auto-Contact List
                                                </Button>
                                            )}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
