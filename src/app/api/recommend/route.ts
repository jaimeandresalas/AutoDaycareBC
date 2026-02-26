import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa el SDK de Gemini. Si la key no está en el entorno, fallará al llamarlo.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { query, properties } = await req.json();

        if (!query || !properties) {
            return NextResponse.json({ error: "Missing query or properties" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
        }

        // Usaremos gemini-3-flash-preview según lo solicitado
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
    You are an expert assistant helping parents find the best daycare in British Columbia.
    The user is looking for: "${query}"

    Here is a list of available daycares in JSON format. This list has already been pre-filtered if the user has active filters:
    ${JSON.stringify(properties)}

    Analyze the user's request and select the options that best fit their search. You don't have to return all of them, just the top 2 to 4 best matches.
    You must return a JSON strictly with this structure and nothing else:
    {
      "recommendations": [
        {
          "id": "DAYCARE_ID",
          "reason": "A brief and persuasive explanation of why this daycare is perfect for their search. Maximum 2 sentences."
        }
      ]
    }
    Do not return any text outside the JSON. If you cannot find any appropriate daycare, return an empty recommendations array.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Limpiar el texto en caso de que el modelo haya envuelto la respuesta en markdown json
        text = text.trim();
        if (text.startsWith("\`\`\`json")) {
            text = text.replace(/^\`\`\`json\n?/, "").replace(/\n?\`\`\`$/, "");
        } else if (text.startsWith("\`\`\`")) {
            text = text.replace(/^\`\`\`\n?/, "").replace(/\n?\`\`\`$/, "");
        }

        const jsonResult = JSON.parse(text);

        return NextResponse.json(jsonResult);
    } catch (error: unknown) {
        console.error("Error with Gemini API:", error);
        const err = error as Error;
        return NextResponse.json({ error: err.message || "Failed to generate recommendations" }, { status: 500 });
    }
}
