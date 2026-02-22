"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function requestVerifiedSpot(providerId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized — you must be signed in to request a spot.");
    }

    // 1. Fetch the parent's profile for personalized request
    const { data: parent, error: parentError } = await supabase
        .from("parents")
        .select("child_name, expected_start_date, care_type_needed")
        .eq("id", userId)
        .single();

    if (parentError || !parent) {
        return { success: false, error: "Please complete onboarding before requesting a spot." };
    }

    // 2. Check if there's already a pending request for this provider
    const { data: existing } = await supabase
        .from("outreach_logs")
        .select("id")
        .eq("provider_id", providerId)
        .eq("provider_response_status", "requested_spot")
        .limit(1);

    if (existing && existing.length > 0) {
        return { success: false, error: "You've already requested a spot at this daycare." };
    }

    // 3. Simulate email sending (SendGrid / Resend mock)
    await new Promise((res) => setTimeout(res, 1500));

    // 4. Insert the outreach log (campaign_id is null for direct requests)
    const { error: insertError } = await supabase
        .from("outreach_logs")
        .insert({
            campaign_id: null,
            provider_id: providerId,
            provider_response_status: "requested_spot",
        });

    if (insertError) {
        console.error("Spot request insert error:", insertError);
        return { success: false, error: insertError.message };
    }

    // 5. Revalidate dashboard so the UI updates immediately
    revalidatePath("/dashboard");

    return {
        success: true,
        message: `Spot request sent for ${parent.child_name} — starting ${parent.expected_start_date} (${parent.care_type_needed}).`,
    };
}
