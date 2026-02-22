"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Send,
    CheckCircle,
    Clock,
    Hourglass,
    XCircle,
    ArrowLeft,
    Search,
    BarChart3,
    TrendingUp,
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
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
    }),
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

    const metrics = data?.metrics;
    const recentActivity = data?.recentActivity || [];

    const summaryCards = [
        {
            title: "Total Contacted",
            value: metrics?.totalContacted ?? 0,
            icon: Send,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            borderColor: "border-blue-200 dark:border-blue-800",
        },
        {
            title: "Spots Available",
            value: metrics?.spotsAvailable ?? 0,
            icon: CheckCircle,
            color: "text-emerald-600 dark:text-emerald-400",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            borderColor: "border-emerald-200 dark:border-emerald-800",
        },
        {
            title: "Waitlisted",
            value: metrics?.waitlisted ?? 0,
            icon: Hourglass,
            color: "text-yellow-600 dark:text-yellow-400",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            borderColor: "border-yellow-200 dark:border-yellow-800",
        },
        {
            title: "Pending Reply",
            value: metrics?.pendingReplies ?? 0,
            icon: Clock,
            color: "text-slate-600 dark:text-slate-400",
            bgColor: "bg-slate-100 dark:bg-slate-800/50",
            borderColor: "border-slate-200 dark:border-slate-700",
        },
    ];

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
                            Campaign Analytics
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-14">
                        Track your outreach performance and provider responses.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-24 text-center">
                        <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground font-medium">Loading analytics...</p>
                    </div>
                ) : (
                    <>
                        {/* ── Summary Metric Cards ─────────────────────── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {summaryCards.map((card, i) => (
                                <motion.div
                                    key={card.title}
                                    custom={i}
                                    initial="hidden"
                                    animate="visible"
                                    variants={cardVariants}
                                >
                                    <Card className={`border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow`}>
                                        <CardContent className="p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className={`p-2.5 rounded-xl ${card.bgColor}`}>
                                                    <card.icon className={`h-5 w-5 ${card.color}`} />
                                                </div>
                                                <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                                            </div>
                                            <p className="text-3xl font-extrabold tracking-tight text-foreground">
                                                {card.value}
                                            </p>
                                            <p className="text-sm font-medium text-muted-foreground mt-1">
                                                {card.title}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* ── Charts + Recent Activity Row ──────────────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.4 }}
                            >
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg font-bold">Response Distribution</CardTitle>
                                        <CardDescription>Breakdown of provider responses</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsePieChart
                                            pending={metrics?.pendingReplies ?? 0}
                                            waitlisted={metrics?.waitlisted ?? 0}
                                            spotsAvailable={metrics?.spotsAvailable ?? 0}
                                            rejections={metrics?.rejections ?? 0}
                                        />
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.4 }}
                            >
                                <Card className="border-border/60 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                        <CardDescription>Last 5 outreach messages sent</CardDescription>
                                    </CardHeader>
                                    <CardContent>
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
                                                            transition={{ delay: 0.6 + index * 0.08 }}
                                                            className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-semibold text-sm text-foreground truncate">
                                                                    {activity.provider_name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    Sent {new Date(activity.sent_at).toLocaleDateString("en-CA", {
                                                                        month: "short",
                                                                        day: "numeric",
                                                                        year: "numeric",
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <Badge
                                                                variant={config.variant}
                                                                className={`ml-3 text-xs font-semibold whitespace-nowrap ${config.className}`}
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
                        </div>

                        {/* Rejection count (if any) */}
                        {(metrics?.rejections ?? 0) > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="mt-6"
                            >
                                <Card className="border-red-200/60 dark:border-red-800/40 bg-red-50/50 dark:bg-red-950/20">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-lg">
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                                {metrics?.rejections} provider{metrics?.rejections !== 1 ? "s" : ""} reported no available space
                                            </p>
                                            <p className="text-xs text-red-600/70 dark:text-red-400/60 mt-0.5">
                                                Consider expanding your search radius or checking back later
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
