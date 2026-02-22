export type ContactMethod = "email" | "phone_only";

export interface DaycareLocation {
    city: string;
    lat: number;
    lng: number;
}

export interface Daycare {
    id: string;
    name: string;
    isVerified: boolean;
    contactMethod: ContactMethod;
    phone: string;
    email?: string;
    location: DaycareLocation;
    capacity: number;
    nextOpening: string | null;
    priceMonth: number;
    hasRequestedSpot?: boolean;
    requestedAt?: string | null;
}
