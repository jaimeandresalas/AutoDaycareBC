"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, LogIn } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useOutreachStore } from "@/store/useOutreachStore";

export default function FloatingOutreachBar() {
    const { selectedDaycares, clearSelection } = useOutreachStore();
    const { isSignedIn } = useAuth();
    const count = selectedDaycares.length;

    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-border/60 shadow-2xl rounded-full px-6 py-3">
                        <button
                            onClick={clearSelection}
                            className="h-7 w-7 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors flex-shrink-0"
                            aria-label="Clear selection"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>

                        <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                            <span className="text-primary font-bold">{count}</span>{" "}
                            {count === 1 ? "Daycare" : "Daycares"} selected for outreach
                        </span>

                        {isSignedIn ? (
                            <Button size="sm" className="rounded-full font-semibold px-5 shadow-sm" asChild>
                                <Link href="/outreach">
                                    Review Campaign
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <SignInButton mode="modal" forceRedirectUrl="/outreach">
                                <Button size="sm" className="rounded-full font-semibold px-5 shadow-sm bg-amber-600 hover:bg-amber-700 text-white border-none">
                                    <LogIn className="mr-1.5 h-4 w-4" />
                                    Sign in to Contact
                                    <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </SignInButton>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
