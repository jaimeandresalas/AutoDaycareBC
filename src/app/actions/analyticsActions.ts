"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    is_verified: boolean;
}

export interface UserAnalyticsData {
    verified: CampaignAnalytics;
    unverified: CampaignAnalytics;
    combined: CampaignAnalytics;
    recentActivity: RecentActivity[];
}

const EMPTY_METRICS: CampaignAnalytics = {
    totalContacted: 0,
    pendingReplies: 0,
    waitlisted: 0,
    spotsAvailable: 0,
    rejections: 0,
};

function incrementMetrics(
    metrics: CampaignAnalytics,
    status: string
): CampaignAnalytics {
    return {
        totalContacted: metrics.totalContacted + 1,
        pendingReplies:
            metrics.pendingReplies + (status === "pending" || status === "requested_spot" ? 1 : 0),
        waitlisted:
            metrics.waitlisted + (status === "replied_waitlist" ? 1 : 0),
        spotsAvailable:
            metrics.spotsAvailable + (status === "replied_space_available" ? 1 : 0),
        rejections:
            metrics.rejections + (status === "replied_no_space" ? 1 : 0),
    };
}

export async function getUserAnalytics(): Promise<UserAnalyticsData> {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    // 1. Get all campaign IDs for this user
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
        .from("campaigns")
        .select("id")
        .eq("parent_id", userId);

    if (campaignsError) {
        console.error("Error fetching campaigns:", campaignsError);
        return { verified: { ...EMPTY_METRICS }, unverified: { ...EMPTY_METRICS }, combined: { ...EMPTY_METRICS }, recentActivity: [] };
    }

    const campaignIds = (campaigns || []).map((c) => c.id);

    // 2. Fetch ALL outreach logs for this user (campaign-based + direct requests)
    let allLogs: Array<{ id: string; provider_id: string; provider_response_status: string; sent_at: string; responded_at: string | null }> = [];

    // Campaign-based logs (covers both automated and direct_request campaigns)
    if (campaignIds.length > 0) {
        const { data: campaignLogs } = await supabaseAdmin
            .from("outreach_logs")
            .select("id, provider_id, provider_response_status, sent_at, responded_at")
            .in("campaign_id", campaignIds);

        if (campaignLogs) allLogs = [...campaignLogs];
    }

    if (allLogs.length === 0) {
        return { verified: { ...EMPTY_METRICS }, unverified: { ...EMPTY_METRICS }, combined: { ...EMPTY_METRICS }, recentActivity: [] };
    }

    // 3. Fetch provider data to determine is_verified for each log
    const providerIds = Array.from(new Set(allLogs.map((l) => l.provider_id)));
    const { data: providers } = await supabaseAdmin
        .from("providers")
        .select("id, name, is_verified")
        .in("id", providerIds);

    const providerMap = new Map(
        (providers || []).map((p) => [p.id, { name: p.name, is_verified: p.is_verified }])
    );

    // 4. Separate metrics by verified/unverified
    let verifiedMetrics = { ...EMPTY_METRICS };
    let unverifiedMetrics = { ...EMPTY_METRICS };

    allLogs.forEach((log) => {
        const provider = providerMap.get(log.provider_id);
        const isVerified = provider?.is_verified ?? false;

        if (isVerified) {
            verifiedMetrics = incrementMetrics(verifiedMetrics, log.provider_response_status);
        } else {
            unverifiedMetrics = incrementMetrics(unverifiedMetrics, log.provider_response_status);
        }
    });

    // 5. Combined metrics
    const combined: CampaignAnalytics = {
        totalContacted: verifiedMetrics.totalContacted + unverifiedMetrics.totalContacted,
        pendingReplies: verifiedMetrics.pendingReplies + unverifiedMetrics.pendingReplies,
        waitlisted: verifiedMetrics.waitlisted + unverifiedMetrics.waitlisted,
        spotsAvailable: verifiedMetrics.spotsAvailable + unverifiedMetrics.spotsAvailable,
        rejections: verifiedMetrics.rejections + unverifiedMetrics.rejections,
    };

    // 6. Recent activity — last 5 logs with provider names + verified status
    const recentActivity: RecentActivity[] = allLogs
        .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
        .slice(0, 5)
        .map((log) => {
            const provider = providerMap.get(log.provider_id);
            return {
                id: log.id,
                provider_name: provider?.name || "Unknown Provider",
                provider_response_status: log.provider_response_status,
                sent_at: log.sent_at,
                responded_at: log.responded_at,
                is_verified: provider?.is_verified ?? false,
            };
        });

    return { verified: verifiedMetrics, unverified: unverifiedMetrics, combined, recentActivity };
}
