"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function requestVerifiedSpot(providerId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized — you must be signed in to request a spot.");
    }

    // 1. Fetch the parent's profile for personalized request
    const { data: parent, error: parentError } = await supabaseAdmin
        .from("parents")
        .select("child_name, expected_start_date, care_type_needed")
        .eq("id", userId)
        .single();

    if (parentError || !parent) {
        return { success: false, error: "Please complete onboarding before requesting a spot." };
    }

    // 2. Check if there's already a pending request for this provider scoped to the user
    const { data: existing } = await supabaseAdmin
        .from("outreach_logs")
        .select("id, campaigns!inner(parent_id)")
        .eq("provider_id", providerId)
        .eq("provider_response_status", "requested_spot")
        .eq("campaigns.parent_id", userId)
        .limit(1);

    if (existing && existing.length > 0) {
        return { success: false, error: "You've already requested a spot at this daycare." };
    }

    // 3. Simulate email sending (SendGrid / Resend mock)
    await new Promise((res) => setTimeout(res, 1500));

    // 4. Find or create a "Direct Requests" campaign for this user
    let { data: directCampaign } = await supabaseAdmin
        .from("campaigns")
        .select("id")
        .eq("parent_id", userId)
        .eq("campaign_type", "direct_request")
        .single();

    if (!directCampaign) {
        const { data: newCampaign, error: newCampaignError } = await supabaseAdmin
            .from("campaigns")
            .insert({
                parent_id: userId,
                campaign_type: "direct_request",
                status: "completed",
            })
            .select("id")
            .single();

        if (newCampaignError || !newCampaign) {
            console.error("Error creating direct request campaign:", newCampaignError);
            return { success: false, error: "System error: Could not initialize spot request tracking." };
        }
        directCampaign = newCampaign;
    }

    // 5. Insert the outreach log scoped to the Direct Requests campaign
    const { error: insertError } = await supabaseAdmin
        .from("outreach_logs")
        .insert({
            campaign_id: directCampaign.id,
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
