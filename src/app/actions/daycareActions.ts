"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Daycare } from "@/lib/data";

export interface OutreachLog {
    provider_id: string;
    sent_at: string;
    provider_response_status: string;
}

// Fetch all providers from Supabase and attach direct request status
export async function getProviders(): Promise<Daycare[]> {
    const { userId } = await auth();

    // 1. Fetch all providers
    const { data: providers, error } = await supabase
        .from("providers")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching providers:", error);
        return [];
    }

    if (!providers) return [];

    // 2. Fetch user's direct request logs if authenticated
    const spotRequests = new Map<string, string>(); // provider_id -> sent_at

    if (userId) {
        // Fetch only the requested_spot logs for this user by joining campaigns
        const { data: logs } = await supabase
            .from("outreach_logs")
            .select("provider_id, sent_at, campaigns!inner(parent_id)")
            .eq("provider_response_status", "requested_spot")
            .eq("campaigns.parent_id", userId);

        if (logs) {
            // Determine the most recent request date for each provider
            logs.forEach((log) => {
                const existingRaw = spotRequests.get(log.provider_id);
                if (!existingRaw || new Date(log.sent_at) > new Date(existingRaw)) {
                    spotRequests.set(log.provider_id, log.sent_at);
                }
            });
        }
    }

    // 3. Map to Daycare interface, attaching the request history
    return providers.map((p) => ({
        id: p.id,
        name: p.name,
        isVerified: p.is_verified,
        contactMethod: p.contact_method || (p.email ? "email" : "phone_only"),
        phone: p.phone,
        email: p.email || undefined,
        location: {
            city: p.city,
            lat: parseFloat(p.lat) || 0,
            lng: parseFloat(p.lng) || 0,
        },
        capacity: p.total_capacity,
        nextOpening: p.next_opening || null,
        priceMonth: p.price_month || 0,
        hasRequestedSpot: spotRequests.has(p.id),
        requestedAt: spotRequests.get(p.id) || null,
    }));
}

export async function getUserOutreachLogs(): Promise<OutreachLog[]> {
    const { userId } = await auth();

    if (!userId) return [];

    const { data: campaigns } = await supabase
        .from("campaigns")
        .select("id")
        .eq("parent_id", userId);

    if (!campaigns || campaigns.length === 0) return [];

    const campaignIds = campaigns.map((c: { id: string }) => c.id);

    const { data: logs, error } = await supabase
        .from("outreach_logs")
        .select("provider_id, sent_at, provider_response_status")
        .in("campaign_id", campaignIds)
        .order("sent_at", { ascending: false });

    if (error) {
        console.error("Error fetching outreach logs:", error);
        return [];
    }

    return logs || [];
}

export async function createCampaignWithLogs(
    providerIds: string[],
    isFollowUp: boolean
) {
    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    const { data: campaign, error: campaignError } = await supabaseAdmin
        .from("campaigns")
        .insert({
            parent_id: userId,
            campaign_type: isFollowUp ? "follow_up" : "initial",
            status: "completed",
        })
        .select("id")
        .single();

    if (campaignError || !campaign) {
        console.error("Campaign insert error:", campaignError);
        return { success: false, error: campaignError?.message || "Failed to create campaign" };
    }

    const logEntries = providerIds.map((providerId) => ({
        campaign_id: campaign.id,
        provider_id: providerId,
        provider_response_status: "pending",
    }));

    const { error: logsError } = await supabaseAdmin
        .from("outreach_logs")
        .insert(logEntries);

    if (logsError) {
        console.error("Outreach logs insert error:", logsError);
        return { success: false, error: logsError.message };
    }

    return { success: true, campaignId: campaign.id };
}
