"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

interface ParentProfileData {
    childName: string;
    childDob: string;
    expectedStartDate: string;
    careTypeNeeded: "full-time" | "part-time" | "both";
}

export interface ParentProfile {
    id: string;
    child_name: string;
    child_dob: string;
    care_type_needed: "full-time" | "part-time" | "both";
    expected_start_date: string;
}

export async function saveParentProfile(data: ParentProfileData) {
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

    return { success: true };
}

export async function getParentProfile(): Promise<ParentProfile | null> {
    const { userId } = await auth();

    if (!userId) return null;

    const { data, error } = await supabase
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

    const { data, error } = await supabase
        .from("parents")
        .select("id")
        .eq("id", userId)
        .single();

    if (error || !data) return false;
    return true;
}
