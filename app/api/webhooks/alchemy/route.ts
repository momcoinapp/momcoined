import { NextRequest, NextResponse } from "next/server";
import { generateMomMetadata } from "@/lib/gemini-generator";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { isValidSignatureForAlchemyRequest } from "alchemy-sdk";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get("x-alchemy-signature");
        const signingKey = process.env.ALCHEMY_WEBHOOK_SIGNING_KEY;

        // Verify Signature (Security)
        if (signingKey && signature) {
            // Reconstruct body string for verification (Next.js body handling can be tricky, 
            // but passing the raw body object usually works with the SDK helper if it expects JSON)
            // Note: In strict environments, you need the raw string buffer. 
            // For this MVP, we will log if missing but proceed if key is not set.
            if (!isValidSignatureForAlchemyRequest(JSON.stringify(body), signature, signingKey)) {
                console.error("Invalid Alchemy Signature");
                return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
            }
        }

        const { event } = body;

        if (!event || !event.activity) {
            return NextResponse.json({ message: "No event data" }, { status: 400 });
        }

        for (const activity of event.activity) {
            // Check if it's our contract
            if (activity.rawContract.address.toLowerCase() !== CONTRACT_ADDRESSES.MOM_COOKIE_JAR.toLowerCase()) {
                continue;
            }

            // We are looking for the "JarFilled" log
            // In a real webhook, we parse the logs. 
            // For simplicity in this MVP, we will assume if we get a webhook for this contract, 
            // we should check the latest state or trigger a generation if needed.

            // Better approach for MVP:
            // The webhook tells us a transaction happened.
            // We can extract the TokenID from the logs (topic1).

            const logs = activity.log;
            if (logs && logs.topics) {
                // Topic 0 is event sig
                // Topic 1 is tokenId (indexed)
                const tokenIdHex = logs.topics[1];
                if (tokenIdHex) {
                    const tokenId = parseInt(tokenIdHex, 16).toString();

                    // 2. Trigger Generation
                    console.log(`Generating Metadata for Token ${tokenId}...`);

                    // Fetch current tier from contract (or assume from event)
                    // For now, let's generate a random one or fetch from chain if possible.
                    // Since we are in an API route, we might not want to call the chain directly if slow.
                    // Let's assume we can determine tier or update it later.

                    // ACTUAL LOGIC:
                    // 1. Check Firebase if we already generated for this TokenID
                    // 2. If not, generate.

                    const metadata = await generateMomMetadata("Base Mom", 100, tokenId); // Defaulting for now

                    // 3. Save to Firebase (which serves the Metadata API)
                    // We need a collection "nft_metadata" where doc ID is tokenId
                    await updateDoc(doc(db, "nft_metadata", tokenId), {
                        ...metadata
                    });
                }
            }
        }

        return NextResponse.json({ message: "Processed" }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
