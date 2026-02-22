"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MapPin, Send, FileText, Smartphone, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


export default function OutreachPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<"idle" | "scraping" | "generating" | "sending" | "completed">("idle");
    const [targetCount] = useState(15);
    const [targetCity] = useState("Coquitlam");

    const messageTemplate = "Hi, I am looking for care for my 2-year-old starting August 2026. Do you have space? Please reply Y/N.";

    // Handle the simulation logic
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isModalOpen && phase !== "completed" && phase !== "idle") {
            // We want to fill the progress bar to 100% over approximately 3 seconds (3000ms).
            // We update it every 30ms by 1%. 30ms * 100 = 3000ms.
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    const next = prev + 1;

                    // Change phases based on progress thresholds
                    if (next === 1) setPhase("scraping");
                    else if (next === 33) setPhase("generating");
                    else if (next === 66) setPhase("sending");
                    else if (next === 100) setPhase("completed");

                    return next;
                });
            }, 30);
        }

        return () => clearInterval(interval);
    }, [isModalOpen, phase]);

    const handleLaunch = () => {
        setProgress(0);
        setPhase("scraping");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (phase === "completed") {
            setIsModalOpen(false);
            setTimeout(() => {
                setPhase("idle");
                setProgress(0);
            }, 300);
        }
    };

    const getPhaseMessage = () => {
        switch (phase) {
            case "scraping": return "Scraping phone numbers...";
            case "generating": return "Generating SMS...";
            case "sending": return "Sending...";
            case "completed": return "Campaign Complete!";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans">
            {/* Simple Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                <div className="container mx-auto px-6 h-16 flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Send className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">Outreach Engine</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Automated Outreach</h1>
                    <p className="text-muted-foreground text-lg">Contact unverified daycares directly via their public records.</p>
                </div>

                <Card className="border-border/60 shadow-sm bg-card/60 backdrop-blur-sm relative overflow-hidden">
                    {/* Subtle aesthetic background color blur */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full mix-blend-multiply blur-3xl pointer-events-none"></div>

                    <CardHeader className="pb-4 border-b border-border/40 bg-card/40">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <span className="relative flex h-3 w-3 mr-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    Campaign Setup
                                </CardTitle>
                                <CardDescription className="text-base mt-2 font-medium text-foreground">
                                    Targeting <span className="text-primary font-bold">{targetCount} Unverified Daycares</span> in <span className="underline decoration-primary/30 underline-offset-4">{targetCity}</span>.
                                </CardDescription>
                            </div>
                            <div className="hidden sm:flex h-12 w-12 rounded-full bg-primary/10 items-center justify-center">
                                <MapPin className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 pb-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Message Preview
                            </label>
                            <div className="relative">
                                <Textarea
                                    readOnly
                                    value={messageTemplate}
                                    className="min-h-[120px] resize-none text-base bg-muted/30 focus-visible:ring-primary/40 border-border/60 p-4 font-medium leading-relaxed"
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border/50">
                                    <Smartphone className="h-3.5 w-3.5" />
                                    SMS Message
                                </div>
                            </div>
                            <p className="text-[13px] text-muted-foreground font-medium">
                                This template is optimized for high response rates.
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="pt-0 pb-6 border-t border-border/40 pt-6 bg-card/40">
                        <Button
                            size="lg"
                            onClick={handleLaunch}
                            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white border-none"
                        >
                            Launch Outreach Campaign
                            <Send className="ml-2 h-5 w-5 fill-white/20" />
                        </Button>
                    </CardFooter>
                </Card>
            </main>

            {/* Progress Modal */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
                // Only allow closing if completed
                if (!open && phase === "completed") {
                    closeModal();
                }
            }}>
                <DialogContent className="sm:max-w-md border-border/50 shadow-2xl [&>button]:hidden">
                    <DialogHeader className="mb-2">
                        <DialogTitle className="text-xl">Outreach in Progress</DialogTitle>
                        <DialogDescription>
                            Please wait while we contact the {targetCount} daycares.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 space-y-8">
                        <AnimatePresence mode="wait">
                            {phase !== "completed" ? (
                                <motion.div
                                    key="progress-view"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm font-semibold">
                                            <span className="text-foreground flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                {getPhaseMessage()}
                                            </span>
                                            <span className="text-muted-foreground tabular-nums">{progress}%</span>
                                        </div>
                                        {/* Using Framer Motion for super smooth progress bar interpolation */}
                                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full"
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ ease: "linear", duration: 0.05 }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-xs font-semibold text-muted-foreground/70 px-1">
                                        <span className={phase === "scraping" || phase === "generating" || phase === "sending" ? "text-primary transition-colors" : ""}>Scraping</span>
                                        <span className={phase === "generating" || phase === "sending" ? "text-primary transition-colors" : ""}>Generating</span>
                                        <span className={phase === "sending" ? "text-primary transition-colors" : ""}>Sending</span>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success-view"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="flex flex-col items-center justify-center py-4 text-center space-y-4"
                                >
                                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-2 shadow-inner border border-emerald-200">
                                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">
                                        {targetCount} Daycares Contacted!
                                    </h3>
                                    <p className="text-muted-foreground text-[15px] font-medium max-w-sm">
                                        We will notify you immediately when they reply via SMS. Sit back and relax.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {phase === "completed" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-2"
                        >
                            <Button onClick={closeModal} className="w-full font-bold shadow-sm" variant="outline">
                                Return to Dashboard
                            </Button>
                        </motion.div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
