import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { daycare } = await req.json();

        if (!daycare || !daycare.name) {
            return NextResponse.json({ error: "Missing daycare data" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
    You are an expert childcare consultant reviewing a specific daycare provider in British Columbia.
    Below is the information provided about the daycare:
    
    Name: ${daycare.name}
    City: ${daycare.city}
    Capacity: ${daycare.capacity}
    Monthly Price: $${daycare.priceMonth}
    Verified Partner: ${daycare.isVerified ? "Yes" : "No"}
    Google Maps Average Rating: ${daycare.googleMapReview ? daycare.googleMapReview : "N/A"}
    Total Number of Ratings: ${daycare.userRatingsTotal ? daycare.userRatingsTotal : "N/A"}

    Write a brief, clear, and objective analysis of this daycare for a parent. Your analysis should be 2-4 sentences max.
    Highlight its strong points (like price, high rating, or being a verified partner) and point out any potential drawbacks or areas where a parent should do more research (like unverified status or lack of reviews).
    Do NOT format the response as JSON. Write it as standard text paragraphs.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textArea = response.text().trim();

        return NextResponse.json({ analysis: textArea });
    } catch (error: unknown) {
        console.error("Error with Gemini API (Analysis):", error);
        const err = error as Error;
        return NextResponse.json({ error: err.message || "Failed to generate analysis" }, { status: 500 });
    }
}
