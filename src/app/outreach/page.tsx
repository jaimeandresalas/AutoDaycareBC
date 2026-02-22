"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Send, Smartphone, Loader2, Trash2, ArrowLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useOutreachStore } from "@/store/useOutreachStore";
import { createCampaignWithLogs } from "@/app/actions/daycareActions";
import { getParentProfile, ParentProfile } from "@/app/actions/userActions";
import {
    calculateAgeInMonths,
    buildInitialMessage,
    buildFollowUpMessage,
    FALLBACK_MESSAGE,
} from "@/lib/messageUtils";

export default function OutreachPage() {
    const { selectedDaycares, toggleDaycare, clearSelection, hasFollowUps } = useOutreachStore();
    const count = selectedDaycares.length;

    // Parent profile state
    const [parentProfile, setParentProfile] = useState<ParentProfile | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { user, isLoaded: isProfileLoaded } = useUser();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        getParentProfile()
            .then((profile) => {
                setParentProfile(profile);
                setProfileLoading(false);
            })
            .catch(() => setProfileLoading(false));
    }, []);

    // Build dynamic message from parent data
    const messageTemplate = (() => {
        if (!parentProfile) return FALLBACK_MESSAGE;
        const age = calculateAgeInMonths(parentProfile.child_dob);
        if (hasFollowUps) {
            return buildFollowUpMessage(parentProfile.care_type_needed, age, parentProfile.expected_start_date);
        }
        return buildInitialMessage(parentProfile.care_type_needed, age, parentProfile.expected_start_date);
    })();

    // Sending simulation state
    const [isSending, setIsSending] = useState(false);
    const [sendProgress, setSendProgress] = useState(0);

    // 4 seconds = 4000ms, 100 steps → 40ms per step
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSending && sendProgress < 100) {
            interval = setInterval(() => {
                setSendProgress((prev) => {
                    const next = prev + 1;
                    if (next >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return next;
                });
            }, 40);
        }

        return () => clearInterval(interval);
    }, [isSending, sendProgress]);

    const handleLaunch = async () => {
        setSendProgress(0);
        setIsSending(true);

        // Save the campaign and logs to Supabase
        const providerIds = selectedDaycares.map((d) => d.id);
        const result = await createCampaignWithLogs(providerIds, hasFollowUps);

        if (!result.success) {
            console.error("Failed to save campaign:", result.error);
        }
    };

    const handleReturnToDashboard = () => {
        clearSelection();
    };

    const getStatusText = () => {
        if (sendProgress < 30) return "Establishing secure connection...";
        if (sendProgress < 60) return "Formatting SMS and Emails...";
        if (sendProgress < 100) return `Dispatching messages to ${count} providers...`;
        return "Campaign Launched!";
    };

    // ─── EMPTY STATE ────────────────────────────────────────
    if (count === 0 && !isSending) {
        return (
            <div className="min-h-screen bg-background flex flex-col font-sans">
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                    <div className="container mx-auto px-6 h-16 flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                                <Send className="h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                        </Link>
                    </div>
                </header>
                <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="max-w-sm space-y-6"
                    >
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto">
                            <Search className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">No daycares selected for outreach.</h2>
                        <p className="text-muted-foreground font-medium">
                            Head to the dashboard and add daycares to your campaign first.
                        </p>
                        <Button size="lg" className="rounded-full font-semibold px-8" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Search
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // ─── MAIN REVIEW LAYOUT ─────────────────────────────────
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Send className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>
                    {!isSending && (
                        <Button variant="ghost" size="sm" className="text-muted-foreground font-medium" asChild>
                            <Link href="/dashboard">
                                <ArrowLeft className="h-4 w-4 mr-1.5" />
                                Back to Dashboard
                            </Link>
                        </Button>
                    )}
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-10 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Review your Outreach Campaign</h1>
                    <p className="text-muted-foreground text-lg mb-8 font-medium">
                        {isSending ? "Your campaign is being sent." : "Confirm your selection and message before sending."}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column — Review Selection (3/5) */}
                    <div className="lg:col-span-3 space-y-4">
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="pb-4 border-b border-border/40">
                                <CardTitle className="text-lg flex items-center justify-between">
                                    <span>Selected Daycares ({count})</span>
                                    {!isSending && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearSelection}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-semibold"
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border/40 max-h-[400px] overflow-y-auto">
                                    <AnimatePresence>
                                        {selectedDaycares.map((daycare) => (
                                            <motion.div
                                                key={daycare.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="space-y-1 min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                        {daycare.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                        {daycare.location.city}, BC
                                                        <span className="mx-1 text-border">•</span>
                                                        <Smartphone className="h-3 w-3 flex-shrink-0" />
                                                        {daycare.phone}
                                                    </p>
                                                </div>
                                                {!isSending && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => toggleDaycare(daycare)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                                                        aria-label={`Remove ${daycare.name}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column — Message Config OR Sending Overlay */}
                    <div className="lg:col-span-2 space-y-4">
                        <AnimatePresence mode="wait">
                            {!isSending ? (
                                /* ─── MESSAGE CONFIGURATION ─────────────── */
                                <motion.div
                                    key="message-config"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="border-border/60 shadow-sm">
                                        <CardHeader className="pb-4 border-b border-border/40">
                                            <CardTitle className="text-lg">Message Template</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-5 space-y-5">
                                            <Textarea
                                                readOnly
                                                value={messageTemplate}
                                                className="min-h-[220px] resize-none text-sm bg-muted/30 focus-visible:ring-primary/40 border-border/60 p-4 font-medium leading-relaxed"
                                            />
                                            <p className="text-xs text-muted-foreground font-medium">
                                                This message will be sent via SMS to all {count} selected daycares.
                                            </p>

                                            <Button
                                                onClick={handleLaunch}
                                                disabled={count === 0}
                                                size="lg"
                                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white border-none"
                                            >
                                                <Send className="h-5 w-5 mr-2 fill-white/20" />
                                                Send to {count} {count === 1 ? "Daycare" : "Daycares"} Now
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                /* ─── SENDING OVERLAY CARD ──────────────── */
                                <motion.div
                                    key="sending-overlay"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
                                >
                                    <Card className="border-border/60 shadow-2xl overflow-hidden relative">
                                        {/* Animated gradient background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5 pointer-events-none" />

                                        <CardContent className="pt-8 pb-8 px-6 relative z-10">
                                            <AnimatePresence mode="wait">
                                                {sendProgress < 100 ? (
                                                    /* ─── PROGRESS VIEW ────────── */
                                                    <motion.div
                                                        key="progress"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="space-y-8"
                                                    >
                                                        {/* Pulsing icon */}
                                                        <div className="flex justify-center">
                                                            <motion.div
                                                                animate={{ scale: [1, 1.1, 1] }}
                                                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                                                className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                                                            >
                                                                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                            </motion.div>
                                                        </div>

                                                        {/* Status text */}
                                                        <div className="text-center space-y-2">
                                                            <motion.p
                                                                key={getStatusText()}
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="text-base font-semibold text-foreground"
                                                            >
                                                                {getStatusText()}
                                                            </motion.p>
                                                            <p className="text-sm text-muted-foreground tabular-nums font-bold">
                                                                {sendProgress}%
                                                            </p>
                                                        </div>

                                                        {/* Progress bar */}
                                                        <div className="space-y-3">
                                                            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 rounded-full"
                                                                    initial={{ width: "0%" }}
                                                                    animate={{ width: `${sendProgress}%` }}
                                                                    transition={{ ease: "linear", duration: 0.04 }}
                                                                />
                                                            </div>
                                                            <div className="flex justify-between text-[11px] font-bold text-muted-foreground/60 px-0.5">
                                                                <span className={sendProgress >= 1 ? "text-primary" : ""}>Connecting</span>
                                                                <span className={sendProgress >= 30 ? "text-primary" : ""}>Formatting</span>
                                                                <span className={sendProgress >= 60 ? "text-primary" : ""}>Sending</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ) : (
                                                    /* ─── SUCCESS VIEW ──────────── */
                                                    <motion.div
                                                        key="success"
                                                        initial={{ opacity: 0, scale: 0.7 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                                        className="space-y-6 text-center py-4"
                                                    >
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ type: "spring", bounce: 0.6, delay: 0.1 }}
                                                            className="flex justify-center"
                                                        >
                                                            <div className="h-24 w-24 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 border-2 border-emerald-200 dark:border-emerald-800">
                                                                <CheckCircle className="h-14 w-14 text-emerald-600 dark:text-emerald-400" />
                                                            </div>
                                                        </motion.div>

                                                        <div className="space-y-3">
                                                            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">
                                                                Campaign Launched!
                                                            </h3>
                                                            <p className="text-muted-foreground font-medium leading-relaxed text-[15px] max-w-xs mx-auto">
                                                                We will notify you when providers reply. Sit back and relax — you just contacted{" "}
                                                                <span className="text-primary font-bold">{count}</span> daycares!
                                                            </p>
                                                        </div>

                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.4 }}
                                                        >
                                                            <Button
                                                                size="lg"
                                                                className="w-full h-12 font-semibold shadow-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                                                                onClick={handleReturnToDashboard}
                                                                asChild
                                                            >
                                                                <Link href="/dashboard">
                                                                    Return to Dashboard
                                                                </Link>
                                                            </Button>
                                                        </motion.div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
