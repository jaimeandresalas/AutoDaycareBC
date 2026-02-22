"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ── Zod validation schema ───────────────────────────────────
const providerLeadSchema = z.object({
    daycareName: z.string().min(2, "Daycare name must be at least 2 characters"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Please enter a valid email address"),
});

export type ProviderLeadData = z.infer<typeof providerLeadSchema>;

export async function saveProviderLead(data: ProviderLeadData) {
    // Validate inputs before touching the database
    const parsed = providerLeadSchema.safeParse(data);

    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message || "Invalid input.";
        return { success: false, error: firstError };
    }

    const { error } = await supabaseAdmin
        .from("provider_leads")
        .insert({
            daycare_name: parsed.data.daycareName,
            phone_number: parsed.data.phoneNumber,
            email: parsed.data.email,
        });

    if (error) {
        console.error("Error saving provider lead:", error);
        return { success: false, error: "Failed to save lead. Please try again." };
    }

    return { success: true };
}
