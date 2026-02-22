"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Send,
    ArrowLeft,
    Search,
    BarChart3,
    CheckCircle2,
    MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserAnalytics, UserAnalyticsData } from "@/app/actions/analyticsActions";
import ResponsePieChart from "@/components/ResponsePieChart";

const statusConfig: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive"; className: string }> = {
    pending: {
        label: "Pending",
        variant: "outline",
        className: "border-slate-300 text-slate-600 bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:bg-slate-900/30",
    },
    replied_waitlist: {
        label: "Waitlisted",
        variant: "outline",
        className: "border-yellow-300 text-yellow-700 bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:bg-yellow-900/30",
    },
    replied_space_available: {
        label: "Spot Available!",
        variant: "default",
        className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    },
    replied_no_space: {
        label: "No Space",
        variant: "destructive",
        className: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    },
    requested_spot: {
        label: "Spot Requested",
        variant: "outline",
        className: "border-emerald-200 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/30",
    },
};

export default function AnalyticsPage() {
    const [data, setData] = useState<UserAnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getUserAnalytics()
            .then(setData)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const combined = data?.combined;
    const verified = data?.verified;
    const unverified = data?.unverified;
    const recentActivity = data?.recentActivity || [];

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                <div className="container px-6 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Search className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>

                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 container px-6 py-10 max-w-6xl">
                {/* Page Title */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2.5 rounded-xl">
                            <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Campaign Tracker
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-14">
                        Compare your direct spot requests against automated SMS campaigns.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-24 text-center">
                        <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground font-medium">Loading analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* ── Global Overview ─────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 bg-card border border-border/60 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Global Overview</h2>
                                <p className="text-muted-foreground text-sm mt-1">
                                    Total providers contacted across all methods
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border/40">
                                <div className="bg-primary/10 text-primary p-2.5 rounded-xl">
                                    <Send className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className="text-3xl font-extrabold text-foreground leading-none">
                                        {combined?.totalContacted ?? 0}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground ml-2">Total Contacted</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── 2-Column Comparison ─────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                            {/* Left: Automated (Unverified) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="border-border/60 shadow-sm h-full flex flex-col">
                                    <CardHeader className="pb-4 bg-slate-50/50 dark:bg-slate-900/20 border-b border-border/40 rounded-t-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                                Automated Outreach
                                            </CardTitle>
                                            <Badge variant="secondary" className="bg-slate-200/50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                Unverified
                                            </Badge>
                                        </div>
                                        <CardDescription>SMS campaigns sent to standard listings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Providers Contacted</span>
                                            <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                                {unverified?.totalContacted ?? 0}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-h-[300px]">
                                            <ResponsePieChart
                                                theme="muted"
                                                pending={unverified?.pendingReplies ?? 0}
                                                waitlisted={unverified?.waitlisted ?? 0}
                                                spotsAvailable={unverified?.spotsAvailable ?? 0}
                                                rejections={unverified?.rejections ?? 0}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Right: Direct Requests (Verified) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="border-emerald-200/60 dark:border-emerald-900/60 shadow-md h-full flex flex-col ring-1 ring-emerald-500/10">
                                    <CardHeader className="pb-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 rounded-t-xl">
                                        <div className="flex items-center justify-between mb-1">
                                            <CardTitle className="text-lg font-bold text-emerald-800 dark:text-emerald-400">
                                                Direct Requests
                                            </CardTitle>
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none shadow-none dark:bg-emerald-900/40 dark:text-emerald-400">
                                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verified Partners
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-emerald-600/70 dark:text-emerald-400/60">
                                            Premium spot requests sent directly
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-6 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-6 px-2">
                                            <span className="text-sm font-semibold text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider">Spot Requests Sent</span>
                                            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                                                {verified?.totalContacted ?? 0}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-h-[300px]">
                                            <ResponsePieChart
                                                theme="vibrant"
                                                pending={verified?.pendingReplies ?? 0}
                                                waitlisted={verified?.waitlisted ?? 0}
                                                spotsAvailable={verified?.spotsAvailable ?? 0}
                                                rejections={verified?.rejections ?? 0}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                        </div>

                        {/* ── Recent Activity ─────────────────────── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="pb-3 border-b border-border/40">
                                    <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                    <CardDescription>Your latest outreach history</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    {recentActivity.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <Send className="h-10 w-10 mb-3 opacity-30" />
                                            <p className="font-medium">No outreach yet</p>
                                            <p className="text-sm mt-1">Your sent messages will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/60">
                                            {recentActivity.map((activity, index) => {
                                                const config = statusConfig[activity.provider_response_status] || statusConfig.pending;
                                                return (
                                                    <motion.div
                                                        key={activity.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.4 + index * 0.05 }}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-2 last:pb-2"
                                                    >
                                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                                            <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.is_verified
                                                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
                                                                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                                                                }`}>
                                                                {activity.is_verified ? <CheckCircle2 className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2 mb-0.5">
                                                                    <p className="font-semibold text-sm text-foreground truncate">
                                                                        {activity.provider_name}
                                                                    </p>
                                                                    {/* Type Badge */}
                                                                    {activity.is_verified ? (
                                                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-emerald-200 text-emerald-600 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20">
                                                                            Direct Request
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-blue-200 text-blue-600 bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:bg-blue-900/20">
                                                                            Campaign
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Sent {new Date(activity.sent_at).toLocaleDateString("en-CA", {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant={config.variant}
                                                            className={`text-xs font-semibold whitespace-nowrap self-start sm:self-center ${config.className}`}
                                                        >
                                                            {config.label}
                                                        </Badge>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </main>
        </div>
    );
}
