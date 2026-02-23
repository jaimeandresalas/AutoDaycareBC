"use server";

import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// ── Zod validation schema ───────────────────────────────────
const parentProfileSchema = z.object({
    childName: z.string().min(1, "Child name is required"),
    childDob: z.string().date("Child date of birth must be a valid ISO date (YYYY-MM-DD)"),
    expectedStartDate: z.string().date("Expected start date must be a valid ISO date (YYYY-MM-DD)"),
    careTypeNeeded: z.enum(["full-time", "part-time", "both"]),
});

export type ParentProfileData = z.infer<typeof parentProfileSchema>;

export interface ParentProfile {
    id: string;
    child_name: string;
    child_dob: string;
    care_type_needed: "full-time" | "part-time" | "both";
    expected_start_date: string;
}

export async function saveParentProfile(data: ParentProfileData) {
    // Validate inputs before touching the database
    const parsed = parentProfileSchema.safeParse(data);
    if (!parsed.success) {
        const firstError = parsed.error.issues[0]?.message || "Invalid input.";
        return { success: false, error: firstError };
    }

    const { userId } = await auth();

    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabaseAdmin
        .from("parents")
        .upsert(
            {
                id: userId,
                child_name: data.childName,
                child_dob: data.childDob,
                care_type_needed: data.careTypeNeeded,
                expected_start_date: data.expectedStartDate,
            },
            { onConflict: "id" }
        );

    if (error) {
        console.error("Supabase upsert error:", error);
        return { success: false, error: error.message };
    }

    // Set Clerk publicMetadata so middleware can check onboarding
    // without hitting the database on every request
    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: { onboarded: true },
        });
    } catch (clerkError) {
        console.error("Clerk metadata update error:", clerkError);
        // Non-blocking: profile was saved, metadata will sync on next save
    }

    return { success: true };
}

export async function getParentProfile(): Promise<ParentProfile | null> {
    const { userId } = await auth();

    if (!userId) return null;

    const { data, error } = await supabaseAdmin
        .from("parents")
        .select("id, child_name, child_dob, care_type_needed, expected_start_date")
        .eq("id", userId)
        .single();

    if (error || !data) return null;
    return data as ParentProfile;
}

export async function checkOnboardingStatus(): Promise<boolean> {
    const { userId } = await auth();

    if (!userId) return false;

    const { data, error } = await supabaseAdmin
        .from("parents")
        .select("id")
        .eq("id", userId)
        .single();

    if (error || !data) return false;
    return true;
}

/**
 * Backward-compatibility sync for legacy users.
 * If the user already has a Supabase profile but is missing the Clerk
 * publicMetadata.onboarded flag, this sets it automatically.
 * Returns true if the user was already onboarded (and metadata was synced).
 */
export async function syncOnboardingMetadata(): Promise<boolean> {
    const { userId } = await auth();

    if (!userId) return false;

    const { data } = await supabaseAdmin
        .from("parents")
        .select("id")
        .eq("id", userId)
        .single();

    if (!data) return false;

    // User has a profile — ensure Clerk metadata is set
    try {
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: { onboarded: true },
        });
    } catch (err) {
        console.error("Failed to sync onboarding metadata:", err);
    }

    return true;
}
