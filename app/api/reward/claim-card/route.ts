import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from "firebase/firestore";

export async function POST(req: NextRequest) {
    try {
        const { userAddress, cardId } = await req.json();

        if (!userAddress || !cardId) {
            return NextResponse.json({ error: "Missing Address or Card ID" }, { status: 400 });
        }

        const normalizedAddress = userAddress.toLowerCase();

        // 1. Check uniqueness (Optional: prevent double claiming reward for same card if desired, 
        // but the contract prevents minting same ID? No, IDs are 1-10 or custom. 
        // User can mint multiple cards. Let's limit reward to ONE per Card Type per User? 
        // Or just one per day? For now, let's just give the reward. It's off-chain points.)

        // 2. Award Points
        const userRef = doc(db, "users", normalizedAddress);

        // Ensure user exists
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                momBalance: 100,
                joinedAt: serverTimestamp(),
                lastActive: serverTimestamp()
            });
        } else {
            await updateDoc(userRef, {
                momBalance: increment(100),
                lastActive: serverTimestamp()
            });
        }

        // 3. Log Transaction (Optional)
        // const txRef = doc(db, "transactions", `${normalizedAddress}_claim_${Date.now()}`);
        // await setDoc(txRef, { ... });

        return NextResponse.json({ success: true, message: "Reward Claimed", balanceAdded: 100 });

    } catch (error) {
        console.error("Reward Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
