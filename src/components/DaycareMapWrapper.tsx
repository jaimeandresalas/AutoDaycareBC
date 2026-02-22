"use client";

import dynamic from "next/dynamic";
import { Daycare } from "@/lib/data";

// Dynamic import with SSR disabled — Leaflet requires window/document
const DaycareMap = dynamic(() => import("@/components/DaycareMap"), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full rounded-xl bg-muted/50 border border-border/60 flex flex-col items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
            <p className="text-sm text-muted-foreground font-medium">Loading map...</p>
        </div>
    ),
});

interface MapWrapperProps {
    daycares: Daycare[];
}

export default function DaycareMapWrapper({ daycares }: MapWrapperProps) {
    return <DaycareMap daycares={daycares} />;
}
