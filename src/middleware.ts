import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/outreach(.*)", "/analytics(.*)"]);
const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

/**
 * Check if user has completed onboarding.
 * Fast path: read from Clerk JWT claims (zero latency).
 * Fallback: query Supabase (for legacy users without metadata).
 */
async function isOnboarded(
    sessionClaims: Record<string, unknown> | null,
    userId: string
): Promise<boolean> {
    // Fast path: Clerk publicMetadata already has the flag
    const meta = sessionClaims?.publicMetadata as { onboarded?: boolean } | undefined;
    if (meta?.onboarded === true) return true;

    // Fallback: check Supabase for legacy users
    const { data } = await supabaseAdmin
        .from("parents")
        .select("id")
        .eq("id", userId)
        .single();

    return !!data;
}

export default clerkMiddleware(async (auth, req) => {
    // Protect dashboard, outreach, analytics — require authentication
    if (isProtectedRoute(req)) {
        await auth.protect();

        const { userId, sessionClaims } = await auth();
        if (userId) {
            const onboarded = await isOnboarded(sessionClaims, userId);
            if (!onboarded) {
                return NextResponse.redirect(new URL("/onboarding", req.url));
            }
        }
    }

    // Prevent already-onboarded users from seeing the onboarding page again
    if (isOnboardingRoute(req)) {
        const { userId, sessionClaims } = await auth();
        if (userId) {
            const onboarded = await isOnboarded(sessionClaims, userId);
            if (onboarded) {
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
