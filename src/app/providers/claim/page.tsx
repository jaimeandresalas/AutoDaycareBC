"use client";

import { useState } from "react";
import { Search, ShieldCheck, Phone, ChevronRight, Calendar, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Step = "search" | "verify" | "update" | "success";

export default function ProviderClaimPage() {
    const [step, setStep] = useState<Step>("search");

    // State for forms
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isAccepting, setIsAccepting] = useState(true);
    const [openDate, setOpenDate] = useState("");

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.trim().length > 5) { // Simple mock validation
            setStep("verify");
        }
    };

    const handleVerifySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.trim().length === 4) { // Mock 4-digit code
            setStep("update");
        }
    };

    const handleUpdateProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("success");
    };

    // Animation variants
    const slideVariants = {
        enter: { x: 20, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -20, opacity: 0 }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col font-sans select-none sm:select-text relative overflow-x-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-80 bg-primary/5 -z-10 border-b border-border/40">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/30"></div>
            </div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                <div className="container mx-auto px-4 md:px-6 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>
                </div>
            </header>

            <div className="w-full relative z-10 pt-8 pb-4">
                <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                        Claim Your Daycare
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-sm font-medium">
                        Join CareConnect BC to take control of your waitlist and availability.
                    </p>
                </div>
            </div>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-md w-full relative z-10">

                {/* Stepper Progress Bar */}
                <div className="mb-8 flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-8 rounded-full transition-colors ${step === "search" || step === "verify" || step === "update" || step === "success" ? "bg-primary" : "bg-muted"}`} />
                        <div className={`h-2.5 w-8 rounded-full transition-colors ${step === "verify" || step === "update" || step === "success" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <div className={`h-2.5 w-8 rounded-full transition-colors ${step === "update" || step === "success" ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        <div className={`h-2.5 w-8 rounded-full transition-colors ${step === "success" ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* STEP 1: SEARCH */}
                    {step === "search" && (
                        <motion.div key="search" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                            <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Find Your Facility</CardTitle>
                                    <CardDescription className="text-base text-foreground/70">
                                        We&apos;ll look up your government record.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSearchSubmit} className="space-y-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="phone" className="text-base">Facility Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    placeholder="(555) 000-0000"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="pl-11 h-12 text-lg bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:bg-background"
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold shadow-sm">
                                            Search <Search className="ml-2 h-4 w-4" />
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 2: VERIFY */}
                    {step === "verify" && (
                        <motion.div key="verify" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                            <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Verify Ownership</CardTitle>
                                    <CardDescription className="text-base text-foreground/70">
                                        For security, we sent a code to <strong className="text-foreground">({phone.substring(0, 3) || "555"}) ***-**{phone.slice(-2) || "99"}</strong>.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleVerifySubmit} className="space-y-6">
                                        <div className="space-y-3">
                                            <Label htmlFor="otp" className="text-base">Enter 4-Digit Code</Label>
                                            <Input
                                                id="otp"
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={4}
                                                placeholder="••••"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="h-14 text-center text-3xl tracking-[0.5em] bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:bg-background font-mono font-bold"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                        <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold shadow-sm">
                                            Verify & Continue <ChevronRight className="ml-1 h-5 w-5" />
                                        </Button>
                                        <div className="text-center">
                                            <button type="button" className="text-sm text-primary font-medium hover:underline">
                                                Didn&apos;t receive a code?
                                            </button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 3: UPDATE PROFILE */}
                    {step === "update" && (
                        <motion.div key="update" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                            <Card className="border-border/60 shadow-lg shadow-black/5 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Update Availability</CardTitle>
                                    <CardDescription className="text-base text-foreground/70">
                                        Let parents know your current status.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfileSubmit} className="space-y-6">

                                        {/* Toggle */}
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/30">
                                            <div className="space-y-1">
                                                <Label htmlFor="accepting" className="text-[15px] font-bold cursor-pointer">Accepting Kids?</Label>
                                                <p className="text-xs text-muted-foreground mr-4">Turn off if your waitlist is full.</p>
                                            </div>
                                            <Switch
                                                id="accepting"
                                                checked={isAccepting}
                                                onCheckedChange={setIsAccepting}
                                            />
                                        </div>

                                        {/* Date Input */}
                                        <div className="space-y-3">
                                            <Label htmlFor="date" className="text-base font-semibold">Next Opening Date</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="date"
                                                    type="date"
                                                    value={openDate}
                                                    onChange={(e) => setOpenDate(e.target.value)}
                                                    className="pl-11 h-12 text-base bg-muted/40 border-border/80 focus-visible:ring-primary/40 focus-visible:bg-background"
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">Leave blank if unknown.</p>
                                        </div>

                                        <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold shadow-sm">
                                            Save & Go Live
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === "success" && (
                        <motion.div key="success" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, type: "spring" }}>
                            <Card className="border-emerald-200/60 shadow-lg shadow-emerald-500/5 rounded-2xl overflow-hidden bg-emerald-50/30 dark:bg-emerald-950/20 text-center relative border-2">

                                {/* Decor */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl"></div>

                                <div className="pt-10 pb-8 px-6 flex flex-col items-center">
                                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-200 dark:border-emerald-800">
                                        <UserCheck className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <h2 className="text-2xl font-extrabold text-foreground mb-3 tracking-tight">
                                        You&apos;re Live!
                                    </h2>
                                    <p className="text-lg text-emerald-800/80 dark:text-emerald-300 font-medium mb-8 leading-snug max-w-[250px]">
                                        Your profile is now Live and Verified on CareConnect BC.
                                    </p>

                                    <div className="w-full space-y-3">
                                        <Button size="lg" className="w-full h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 border-none">
                                            Go to Provider Dashboard
                                        </Button>
                                        <Button variant="ghost" className="w-full h-12 text-foreground/70 font-medium">
                                            View Public Profile
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                </AnimatePresence>

            </main>

        </div>
    );
}
