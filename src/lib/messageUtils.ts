/**
 * Outreach message utilities
 */

/** Calculate age in months from DOB to today */
export function calculateAgeInMonths(dob: string | Date): number {
    const birthDate = new Date(dob);
    const today = new Date();
    const months =
        (today.getFullYear() - birthDate.getFullYear()) * 12 +
        (today.getMonth() - birthDate.getMonth());
    // If today's day is before the birth day, subtract 1 month
    if (today.getDate() < birthDate.getDate()) {
        return Math.max(0, months - 1);
    }
    return Math.max(0, months);
}

/** Format care type for human-readable message */
export function formatCareType(type: string): string {
    switch (type) {
        case "full-time":
            return "full-time care";
        case "part-time":
            return "part-time care";
        case "both":
            return "full-time or part-time care";
        default:
            return "care";
    }
}

/** Format date nicely, e.g. "August 15, 2026" */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/** Build the initial contact message */
export function buildInitialMessage(
    careType: string,
    ageInMonths: number,
    startDate: string | Date
): string {
    const careStr = formatCareType(careType);
    const dateStr = formatDate(startDate);

    return `Hi! I'm a local parent looking for ${careStr} for my ${ageInMonths}-month-old child, starting exactly on ${dateStr}. Do you have any upcoming spots or an open waitlist? Please reply Y/N.

--
Sent via CareConnect BC.
Tired of answering the same availability questions? Claim your free profile to show your real-time status to thousands of local parents: autodaycarebc/providers`;
}

/** Build the follow-up message */
export function buildFollowUpMessage(
    careType: string,
    ageInMonths: number,
    startDate: string | Date
): string {
    const careStr = formatCareType(careType);
    const dateStr = formatDate(startDate);

    return `Hi, I reached out a few weeks ago about ${careStr} for my ${ageInMonths}-month-old child (start date: ${dateStr}). Just following up — have any spots opened up, or is there still a waitlist? Please reply Y/N.

--
Sent via CareConnect BC.
Tired of answering the same availability questions? Claim your free profile to show your real-time status to thousands of local parents: autodaycarebc/providers`;
}

/** Fallback when parent data is unavailable */
export const FALLBACK_MESSAGE = `Hi! I'm a local parent looking for care for my child. Do you have any upcoming spots or an open waitlist? Please reply Y/N.

--
Sent via CareConnect BC.
Tired of answering the same availability questions? Claim your free profile to show your real-time status to thousands of local parents: autodaycarebc/providers`;
