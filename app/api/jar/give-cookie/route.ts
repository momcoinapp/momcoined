import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const { jarId, userAddress } = await req.json();

        if (!jarId || !userAddress) {
            return NextResponse.json({ error: "Missing ID or Address" }, { status: 400 });
        }

        // 1. Rate Limit Check (One interaction per User per Jar per Day)
        // Store interactions in a subcollection or separate document
        const interactionId = `${jarId}_${userAddress}`;
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const interactionRef = doc(db, "jar_interactions", `${interactionId}_${today}`);

        const interactionSnap = await getDoc(interactionRef);

        if (interactionSnap.exists()) {
            return NextResponse.json({ error: "Already gave a cookie today!" }, { status: 429 });
        }

        // 2. Register Interaction
        await setDoc(interactionRef, {
            jarId,
            user: userAddress,
            timestamp: serverTimestamp()
        });

        // 3. Increment Jar Cookie Count
        const jarRef = doc(db, "jars", jarId);
        // Ensure jar exists, if not create it (lazy init)
        await setDoc(jarRef, { lastUpdated: serverTimestamp() }, { merge: true });
        await updateDoc(jarRef, {
            cookies: increment(1)
        });

        return NextResponse.json({ success: true, message: "Cookie Added!" });

    } catch (error) {
        console.error("Give Cookie Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
