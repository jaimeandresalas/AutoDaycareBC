"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";

export interface CampaignAnalytics {
    totalContacted: number;
    pendingReplies: number;
    waitlisted: number;
    spotsAvailable: number;
    rejections: number;
}

export interface RecentActivity {
    id: string;
    provider_name: string;
    provider_response_status: string;
    sent_at: string;
    responded_at: string | null;
}

export interface UserAnalyticsData {
    metrics: CampaignAnalytics;
    recentActivity: RecentActivity[];
}

export async function getUserAnalytics(): Promise<UserAnalyticsData> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 1. Get all campaign IDs for this user
    const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select("id")
        .eq("parent_id", userId);

    if (campaignsError) {
        console.error("Error fetching campaigns:", campaignsError);
        return {
            metrics: { totalContacted: 0, pendingReplies: 0, waitlisted: 0, spotsAvailable: 0, rejections: 0 },
            recentActivity: [],
        };
    }

    if (!campaigns || campaigns.length === 0) {
        return {
            metrics: { totalContacted: 0, pendingReplies: 0, waitlisted: 0, spotsAvailable: 0, rejections: 0 },
            recentActivity: [],
        };
    }

    const campaignIds = campaigns.map((c) => c.id);

    // 2. Fetch all outreach logs for these campaigns
    const { data: logs, error: logsError } = await supabase
        .from("outreach_logs")
        .select("id, provider_id, provider_response_status, sent_at, responded_at")
        .in("campaign_id", campaignIds);

    if (logsError) {
        console.error("Error fetching outreach logs:", logsError);
        return {
            metrics: { totalContacted: 0, pendingReplies: 0, waitlisted: 0, spotsAvailable: 0, rejections: 0 },
            recentActivity: [],
        };
    }

    const allLogs = logs || [];

    // 3. Calculate metrics
    const metrics: CampaignAnalytics = {
        totalContacted: allLogs.length,
        pendingReplies: allLogs.filter((l) => l.provider_response_status === "pending").length,
        waitlisted: allLogs.filter((l) => l.provider_response_status === "replied_waitlist").length,
        spotsAvailable: allLogs.filter((l) => l.provider_response_status === "replied_space_available").length,
        rejections: allLogs.filter((l) => l.provider_response_status === "replied_no_space").length,
    };

    // 4. Get last 5 outreach logs with provider names (join via provider_id)
    const recentLogIds = allLogs
        .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
        .slice(0, 5)
        .map((l) => l.id);

    let recentActivity: RecentActivity[] = [];

    if (recentLogIds.length > 0) {
        // Fetch the recent logs with their provider names
        const { data: recentLogs } = await supabase
            .from("outreach_logs")
            .select("id, provider_id, provider_response_status, sent_at, responded_at")
            .in("id", recentLogIds)
            .order("sent_at", { ascending: false });

        if (recentLogs) {
            // Fetch provider names for these logs
            const providerIds = [...new Set(recentLogs.map((l) => l.provider_id))];
            const { data: providers } = await supabase
                .from("providers")
                .select("id, name")
                .in("id", providerIds);

            const providerMap = new Map(
                (providers || []).map((p) => [p.id, p.name])
            );

            recentActivity = recentLogs.map((log) => ({
                id: log.id,
                provider_name: providerMap.get(log.provider_id) || "Unknown Provider",
                provider_response_status: log.provider_response_status,
                sent_at: log.sent_at,
                responded_at: log.responded_at,
            }));
        }
    }

    return { metrics, recentActivity };
}
