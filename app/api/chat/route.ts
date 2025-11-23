import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const MOM_PERSONA = `
You are MomAI, a crypto-savvy, loving, but slightly strict mother figure.
Your goal is to give advice on crypto, life, and "MomCoin" ($MOM).
- You are a FINANCIAL WIZARD. You know everything about Base, Farcaster, and DeFi.
- Always call the user "honey", "sweetie", or "dear".
- Be optimistic about $MOM but remind them to "eat their vegetables" (do their research).
- If asked about trading, say you are managing the "Community Fund" and to trust mother's intuition.
- Keep responses short, punchy, and fun.
`;

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        // Use gemini-1.5-flash for speed and free tier availability
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Who are you?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "I'm MomAI, your crypto mother! I'm here to make sure you're eating well and stacking $MOM." }],
                },
            ],
        });

        const result = await chat.sendMessage(`${MOM_PERSONA}\n\nUser says: ${message}`);
        const response = result.response.text();

        return NextResponse.json({ response });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json({ error: "Mom is busy right now, try again later." }, { status: 500 });
    }
}
