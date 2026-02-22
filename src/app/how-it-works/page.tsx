"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Database, MapPin, Send, Bell, UserCheck, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
    {
        icon: Database,
        title: "1. Verified Government Data",
        description: "We continuously sync with the official BC Government child care database. Every facility on our map is a registered, legitimate provider. No fake listings.",
        color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
    },
    {
        icon: MapPin,
        title: "2. Set Your Criteria",
        description: "Filter by area (e.g., Coquitlam, Burnaby), child age, and start date. We instantly generate a list of all matching facilities, even the 80% that don't have websites.",
        color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
    },
    {
        icon: Send,
        title: "3. One-Click Mass Contact",
        description: "Stop dialing phone numbers. Our engine sends personalized SMS and email inquiries to dozens of offline daycares simultaneously on your behalf.",
        color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
    },
    {
        icon: Bell,
        title: "4. Only Get the \"Yes\"",
        description: "We protect your privacy and filter out the rejections. You only get notified when a daycare replies with available spots or open waitlists.",
        color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
    },
    {
        icon: UserCheck,
        title: "5. Empowering Providers",
        description: "Daycares can claim their profile and digitize their business. To ensure security, providers must verify their identity using the official government phone number on record via an automated code.",
        color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
    }
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                            <Search className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8 font-medium text-[15px] text-muted-foreground">
                        <Link href="/how-it-works" className="text-primary font-semibold">How it Works</Link>
                        <Link href="/dashboard" className="hover:text-primary transition-colors">Search</Link>
                        <Link href="/providers/claim" className="hover:text-primary transition-colors">For Providers</Link>
                        <Button size="sm" className="rounded-full shadow-sm hover:shadow-md transition-all font-semibold px-4" asChild>
                            <Link href="/dashboard">Find Care</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative px-6 pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden">
                    <div className="container mx-auto max-w-4xl text-center flex flex-col items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance leading-[1.1]">
                                How <span className="text-primary block mt-2">CareConnect BC</span> Works
                            </h1>
                            <p className="text-lg md:text-2xl text-muted-foreground mb-10 text-balance leading-relaxed font-medium mx-auto max-w-3xl">
                                We bridge the gap between offline daycares and modern parents using official data and smart automation.
                            </p>
                        </motion.div>
                    </div>

                    {/* Decorative background elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-full -z-10 pointer-events-none opacity-50">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: "2s" }} />
                    </div>
                </section>

                {/* Vertical Timeline / Steps Section */}
                <section className="py-20 md:py-32 bg-card/40 border-y border-border/30 relative">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="space-y-20 md:space-y-32 relative">
                            {/* Connecting subtle vertical line in the background for desktop */}
                            <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 -translate-x-1/2 rounded-full -z-10" />

                            {steps.map((step, index) => {
                                const isEven = index % 2 === 0;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
                                        className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${isEven ? "" : "md:flex-row-reverse"}`}
                                    >
                                        <div className={`w-full md:w-1/2 flex justify-center ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                                            <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-sm ${step.color} rotate-3 hover:rotate-0 transition-transform duration-500`}>
                                                <div className="absolute inset-0 bg-white/40 dark:bg-black/20 rounded-3xl mix-blend-overlay"></div>
                                                <step.icon className="w-20 h-20 md:w-28 md:h-28 relative z-10" />
                                            </div>
                                        </div>

                                        <div className={`w-full md:w-1/2 space-y-5 text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                                            <div className={`inline-flex items-center rounded-full border border-border/60 px-4 py-1.5 text-sm font-bold bg-background shadow-sm text-foreground/70 ${isEven ? "" : "md:ml-auto"}`}>
                                                Step {index + 1}
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                                                {step.title.replace(/^\d+\.\s*/, '')}
                                            </h3>
                                            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 md:py-36 relative overflow-hidden bg-background">
                    <div className="container mx-auto px-6 max-w-3xl text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                            className="relative z-10"
                        >
                            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-foreground">
                                Ready to find your child&apos;s spot?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-10 font-medium">
                                Join hundreds of parents skipping the waitlist phone tag.
                            </p>
                            <Button size="lg" className="text-lg h-16 px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" asChild>
                                <Link href="/dashboard">
                                    Start Auto-Search
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Glow effect behind CTA */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 mix-blend-multiply blur-[120px] rounded-full pointer-events-none -z-10" />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-border mt-auto bg-card/30">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-sm font-medium text-muted-foreground">
                        © {new Date().getFullYear()} AutoDayCare BC. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
