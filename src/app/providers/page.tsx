"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, PhoneOff, UserCheck, DollarSign, CheckCircle2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveProviderLead } from "@/app/actions/providerLeadActions";

export default function ProviderLeadPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            daycareName: formData.get("daycareName") as string,
            phoneNumber: formData.get("phoneNumber") as string,
            email: formData.get("email") as string,
        };

        const result = await saveProviderLead(data);

        if (result.success) {
            setIsSuccess(true);
        } else {
            setErrorMsg(result.error || "An error occurred.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Minimal Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                            <Search className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="px-6 pt-16 pb-12 md:pt-24 md:pb-20 bg-card border-b border-border/60">
                    <div className="container mx-auto max-w-4xl text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 text-balance">
                            Stop answering the same availability questions.
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed text-balance">
                            Claim your AutoDayCare BC profile. Update your waitlist in one click, receive qualified parent requests, and digitize your daycare for free.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-12 md:py-20 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {/* Left Column: Benefits */}
                        <div className="space-y-10">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                                    <PhoneOff className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Zero Phone Tag</h3>
                                    <p className="text-muted-foreground">Parents see your real-time status online. Stop answering identical calls and focus on the kids.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Qualified Leads</h3>
                                    <p className="text-muted-foreground">Get exact age, start-date requirements, and parent info before you even reply to a request.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Free Forever</h3>
                                    <p className="text-muted-foreground">Your basic listing is always free for verified BC providers. No hidden fees or surprise charges.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Lead Gen Form */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full" />
                            <Card className="border-border/60 shadow-xl relative overflow-hidden">
                                <div className="h-2 bg-primary w-full absolute top-0 left-0" />
                                <CardContent className="pt-8 pb-8 px-6 sm:px-8">
                                    {isSuccess ? (
                                        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                                            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                                                <CheckCircle2 className="h-10 w-10" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-foreground">Thank you!</h2>
                                            <p className="text-muted-foreground font-medium text-lg text-balance">
                                                Our team will contact you shortly to verify your license and activate your dashboard.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6 text-center">
                                                <h2 className="text-2xl font-bold mb-2">Get Started</h2>
                                                <p className="text-muted-foreground text-sm">Join the waitlist to claim your facility.</p>
                                            </div>

                                            {errorMsg && (
                                                <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                                                    {errorMsg}
                                                </div>
                                            )}

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="space-y-2">
                                                    <Label htmlFor="daycareName">Daycare Name</Label>
                                                    <Input
                                                        id="daycareName"
                                                        name="daycareName"
                                                        placeholder="e.g. Sunset Montessori"
                                                        required
                                                        className="h-11"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="phoneNumber">Official Phone Number</Label>
                                                    <Input
                                                        id="phoneNumber"
                                                        name="phoneNumber"
                                                        type="tel"
                                                        placeholder="(604) 555-0123"
                                                        pattern="[\d\s\(\)\-\+]{7,20}"
                                                        title="Enter a valid phone number (e.g. (604) 555-0123)"
                                                        required
                                                        className="h-11"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        placeholder="director@daycare.ca"
                                                        required
                                                        className="h-11"
                                                    />
                                                </div>

                                                <Button
                                                    type="submit"
                                                    className="w-full h-12 text-[15px] font-bold mt-2"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Submitting..." : "Claim My Profile"}
                                                </Button>
                                            </form>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
