"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface ProviderLeadData {
    daycareName: string;
    phoneNumber: string;
    email: string;
}

export async function saveProviderLead(data: ProviderLeadData) {
    const { error } = await supabaseAdmin
        .from("provider_leads")
        .insert({
            daycare_name: data.daycareName,
            phone_number: data.phoneNumber,
            email: data.email,
        });

    if (error) {
        console.error("Error saving provider lead:", error);
        return { success: false, error: "Failed to save lead. Please try again." };
    }

    return { success: true };
}
