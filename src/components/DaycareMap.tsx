"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Daycare } from "@/lib/data";
import { useOutreachStore } from "@/store/useOutreachStore";
import { MapPin, Plus, X, CheckCircle2, AlertCircle, Star } from "lucide-react";

// ── Fix Leaflet default marker icons in Next.js ─────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom verified marker (green)
const verifiedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Custom selected marker (gold)
const selectedIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Default marker (blue)
const defaultIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface DaycareMapProps {
    daycares: Daycare[];
}

export default function DaycareMap({ daycares }: DaycareMapProps) {
    const { selectedDaycares, toggleDaycare } = useOutreachStore();

    const getMarkerIcon = (daycare: Daycare) => {
        const isSelected = selectedDaycares.some((d) => d.id === daycare.id);
        if (isSelected) return selectedIcon;
        if (daycare.isVerified) return verifiedIcon;
        return defaultIcon;
    };

    return (
        <div className="relative">
            {/* Legend */}
            <div className="absolute top-3 right-3 z-[1000] bg-card/95 backdrop-blur-sm border border-border/60 rounded-xl p-3 shadow-lg">
                <p className="text-xs font-bold text-foreground mb-2">Map Legend</p>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Unverified</span>
                    </div>
                </div>
            </div>

            <MapContainer
                center={[49.2838, -122.7932]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-[600px] w-full rounded-xl z-0"
                style={{ borderRadius: "0.75rem" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {daycares.map((daycare) => {
                    const isSelected = selectedDaycares.some((d) => d.id === daycare.id);

                    return (
                        <Marker
                            key={daycare.id}
                            position={[daycare.location.lat, daycare.location.lng]}
                            icon={getMarkerIcon(daycare)}
                        >
                            <Popup minWidth={220} maxWidth={280}>
                                <div className="p-1 font-sans">
                                    {/* Name + Badge */}
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="font-bold text-sm text-foreground leading-tight">
                                            {daycare.name}
                                        </h3>
                                        {daycare.isVerified ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
                                                <AlertCircle className="h-3 w-3" />
                                                Unverified
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="text-xs text-muted-foreground space-y-1 mb-3">
                                        <p className="flex items-center gap-1.5">
                                            <MapPin className="h-3 w-3" />
                                            {daycare.location.city}
                                        </p>
                                        {daycare.googleMapReview != null && daycare.userRatingsTotal != null && (
                                            <div className="flex items-center gap-1 font-medium text-foreground">
                                                <span>{daycare.googleMapReview.toFixed(1)}</span>
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400 -mt-0.5" />
                                                <span className="text-muted-foreground font-normal">({daycare.userRatingsTotal})</span>
                                            </div>
                                        )}
                                        <p>
                                            <span className="font-semibold text-foreground">${daycare.priceMonth}</span>/mo
                                            {daycare.isVerified && (
                                                <>
                                                    &nbsp;·&nbsp;
                                                    Capacity: {daycare.capacity}
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    {/* Toggle Button */}
                                    {!daycare.isVerified && (
                                        <button
                                            onClick={() => toggleDaycare(daycare)}
                                            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${isSelected
                                                ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                                : "bg-primary text-white hover:bg-primary/90"
                                                }`}
                                        >
                                            {isSelected ? (
                                                <>
                                                    <X className="h-3.5 w-3.5" />
                                                    Remove from Campaign
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Add to Campaign
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
