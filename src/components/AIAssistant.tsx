"use client";

import { useState } from "react";
import { Sparkles, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Daycare } from "@/lib/data";

interface Recommendation {
    id: string;
    reason: string;
}

interface AIAssistantProps {
    daycares: Daycare[];
    onRecommendations: (recs: Recommendation[]) => void;
    isFiltering: boolean;
}

export default function AIAssistant({ daycares, onRecommendations, isFiltering }: AIAssistantProps) {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim() || daycares.length === 0) return;
        setLoading(true);
        setErrorMsg(null);

        try {
            // Only send the necessary fields to the LLM to save tokens and time
            const lightweightDaycares = daycares.map(d => ({
                id: d.id,
                name: d.name,
                priceMonth: d.priceMonth,
                city: d.location.city,
                capacity: d.capacity,
                isVerified: d.isVerified,
                googleMapReview: d.googleMapReview,
                userRatingsTotal: d.userRatingsTotal,
            }));

            const res = await fetch("/api/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, properties: lightweightDaycares }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch recommendations");
            }

            if (data.recommendations && Array.isArray(data.recommendations)) {
                onRecommendations(data.recommendations);
            } else {
                onRecommendations([]);
            }
        } catch (error: unknown) {
            console.error("Error fetching AI recommendations:", error);
            const err = error as Error;
            setErrorMsg(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent border border-primary/20 rounded-xl p-5 mb-6 shadow-sm relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex flex-col md:flex-row gap-4 items-center relative z-10">
                <div className="flex items-center gap-2 text-primary font-semibold flex-shrink-0">
                    <Sparkles className="h-5 w-5" />
                    <span>AI Matchmaker</span>
                </div>
                <div className="relative flex-1 w-full mt-2 md:mt-0">
                    <Input
                        placeholder="e.g. Looking for an affordable daycare in Coquitlam for next week..."
                        className="pl-4 pr-12 w-full bg-background/80 focus:bg-background border-primary/20 shadow-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                            <Search className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                </div>
                <Button
                    onClick={handleSearch}
                    disabled={loading || !query.trim() || daycares.length === 0}
                    className="w-full md:w-auto gap-2 shadow-sm font-semibold"
                >
                    {loading ? "Analyzing..." : "Find Best Match"}
                    {!loading && <Sparkles className="h-4 w-4 fill-white flex-shrink-0" />}
                </Button>
            </div>

            {errorMsg && (
                <div className="mt-3 text-sm text-destructive bg-destructive/10 px-3 py-1.5 rounded-md font-medium">
                    {errorMsg === "GEMINI_API_KEY is not configured on the server."
                        ? "⚠️ Gemini API Key missing in .env.local setup."
                        : `Error: ${errorMsg}`}
                </div>
            )}

            {isFiltering && !loading && !errorMsg && (
                <div className="mt-4 flex items-center justify-between text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2 border border-primary/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        Showing AI Recommended Daycares
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => { setQuery(""); onRecommendations([]); }} className="h-8 text-xs hover:bg-primary/10 font-medium">
                        Clear Recommendations
                    </Button>
                </div>
            )}
        </div>
    );
}
