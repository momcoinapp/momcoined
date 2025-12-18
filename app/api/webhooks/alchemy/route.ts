import { NextRequest, NextResponse } from "next/server";
import { generateMomMetadata } from "@/lib/gemini-generator";
// import { db } from "@/lib/firebase";
// import { doc, updateDoc, getDoc } from "firebase/firestore";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const textBody = await req.text();
        const signature = req.headers.get("x-alchemy-signature");
        const signingKey = process.env.ALCHEMY_WEBHOOK_SIGNING_KEY;

        // Verify Signature (Security)
        if (signingKey && signature) {
            const hmac = crypto.createHmac("sha256", signingKey);
            hmac.update(textBody, "utf8");
            const digest = hmac.digest("hex");

            if (signature !== digest) {
                console.error("Invalid Alchemy Signature");
                return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
            }
        }

        const body = JSON.parse(textBody);

        const { event } = body;

        if (!event || !event.activity) {
            return NextResponse.json({ message: "No event data" }, { status: 400 });
        }

        // for (const activity of event.activity) {
        //     // Check if it's our contract
        //     if (activity.rawContract.address.toLowerCase() !== CONTRACT_ADDRESSES.MOM_COOKIE_JAR.toLowerCase()) {
        //         continue;
        //     }

        //     const logs = activity.log;
        //     if (logs && logs.topics) {
        //         // Topic 0 is event sig
        //         // Topic 1 is tokenId (indexed)
        //         const tokenIdHex = logs.topics[1];
        //         if (tokenIdHex) {
        //             const tokenId = parseInt(tokenIdHex, 16).toString();

        //             // 2. Trigger Generation
        //             console.log(`Generating Metadata for Token ${tokenId}...`);

        //             // const metadata = await generateMomMetadata("Base Mom", 100, tokenId); // Defaulting for now

        //             // 3. Save to Firebase (which serves the Metadata API)
        //             // await updateDoc(doc(db, "nft_metadata", tokenId), {
        //             //     ...metadata
        //             // });
        //         }
        //     }
        // }

        return NextResponse.json({ message: "Processed" }, { status: 200 });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
