import { NextRequest, NextResponse } from "next/server";
import { generateMomMetadata } from "@/lib/gemini-generator";
import { db } from "@/lib/firebase"; // Assuming you have firebase setup
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Alchemy Webhook Payload Structure
        const { event } = body;

        if (!event || !event.data) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        // We are looking for "JarFilled" event logs
        // Note: In a real app, you'd parse the ABI to decode the logs.
        // For now, we assume we get the tokenId and tier from the log data.

        // Mocking the extraction for this example
        const tokenId = "123"; // Extracted from log
        const tier = "OG Based Mom"; // Extracted/Decoded from log
        const userAddress = "0x..."; // Extracted from log

        // 1. Generate Metadata with Gemini
        const metadata = await generateMomMetadata(tokenId, tier, 500); // 500 is mock cookie score

        // 2. Save to Firebase (or IPFS)
        await setDoc(doc(db, "nft_metadata", tokenId), metadata);

        // 3. (Optional) Trigger Image Generation here if using Imagen/Midjourney API

        return NextResponse.json({ success: true, metadata });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
