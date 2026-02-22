import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

const isProtectedRoute = createRouteMatcher(["/outreach(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // Protect /outreach — require authentication
    if (isProtectedRoute(req)) {
        await auth.protect();

        // Check onboarding status for authenticated users on /outreach
        const { userId } = await auth();
        if (userId) {
            const { data } = await supabase
                .from("parents")
                .select("id")
                .eq("id", userId)
                .single();

            if (!data) {
                // User hasn't completed onboarding, redirect
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }
        }
    }

    // Prevent already-onboarded users from seeing the onboarding page again
    if (isOnboardingRoute(req)) {
        const { userId } = await auth();
        if (userId) {
            const { data } = await supabase
                .from("parents")
                .select("id")
                .eq("id", userId)
                .single();

            if (data) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
