"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Baby, CalendarDays, Search, Sparkles, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { saveParentProfile } from "@/app/actions/userActions";

// ── Validation Schema ───────────────────────────────────────
const onboardingSchema = z.object({
    childName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    childDob: z
        .string()
        .min(1, "Date of birth is required"),
    expectedStartDate: z
        .string()
        .min(1, "Expected start date is required"),
    careTypeNeeded: z.enum(["full-time", "part-time", "both"]),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            childName: "",
            childDob: "",
            expectedStartDate: "",
            careTypeNeeded: "full-time",
        },
    });

    const onSubmit = async (data: OnboardingFormData) => {
        setIsSubmitting(true);
        setServerError(null);

        const result = await saveParentProfile(data);

        if (result.success) {
            router.push("/dashboard");
        } else {
            setServerError(result.error || "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur shadow-sm">
                <div className="container mx-auto px-6 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-sm">
                            <Search className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12 relative">
                {/* Background blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/8 rounded-full mix-blend-multiply filter blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full mix-blend-multiply filter blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-lg"
                >
                    {/* Welcome Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                            className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5"
                        >
                            <Sparkles className="h-8 w-8 text-primary" />
                        </motion.div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-2">
                            Welcome to AutoDayCare BC!
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg">
                            Tell us about your child so we can find the best match.
                        </p>
                    </div>

                    {/* Form Card */}
                    <Card className="border-border/60 shadow-xl bg-card/80 backdrop-blur-sm">
                        <CardHeader className="pb-2 pt-6 px-6">
                            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Baby className="h-4 w-4" />
                                Child Details
                            </div>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                    {/* Child Name */}
                                    <FormField
                                        control={form.control}
                                        name="childName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Child&apos;s First Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g. Emma"
                                                        className="h-12 bg-background border-border/60 focus-visible:ring-primary/40"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Date of Birth */}
                                    <FormField
                                        control={form.control}
                                        name="childDob"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Date of Birth
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        className="h-12 bg-background border-border/60 focus-visible:ring-primary/40"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Expected Start Date */}
                                    <FormField
                                        control={form.control}
                                        name="expectedStartDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold flex items-center gap-2">
                                                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                                                    Desired Start Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        className="h-12 bg-background border-border/60 focus-visible:ring-primary/40"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Care Type */}
                                    <FormField
                                        control={form.control}
                                        name="careTypeNeeded"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Care Type Needed</FormLabel>
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-3 gap-3 pt-1"
                                                    >
                                                        {[
                                                            { value: "full-time", label: "Full-time" },
                                                            { value: "part-time", label: "Part-time" },
                                                            { value: "both", label: "Any" },
                                                        ].map((option) => (
                                                            <Label
                                                                key={option.value}
                                                                htmlFor={`care-${option.value}`}
                                                                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-3.5 cursor-pointer font-semibold text-sm transition-all ${field.value === option.value
                                                                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                                                                    : "border-border/60 bg-background hover:border-primary/30 text-muted-foreground hover:text-foreground"
                                                                    }`}
                                                            >
                                                                <RadioGroupItem
                                                                    value={option.value}
                                                                    id={`care-${option.value}`}
                                                                    className="sr-only"
                                                                />
                                                                {option.label}
                                                            </Label>
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Server Error */}
                                    {serverError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-lg border border-destructive/20"
                                        >
                                            {serverError}
                                        </motion.div>
                                    )}

                                    {/* Submit */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={isSubmitting}
                                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-indigo-600/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-white border-none rounded-xl"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Continue to Dashboard →"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}
