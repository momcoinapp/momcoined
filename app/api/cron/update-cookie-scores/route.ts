import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, increment } from "firebase/firestore";
import { getCookieScore } from "@/lib/neynar";

export const dynamic = 'force-dynamic'; // Ensure it runs on every request

export async function GET(request: Request) {
    try {
        // Verify Cron Secret (Optional but recommended)
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // return new NextResponse('Unauthorized', { status: 401 });
            // Allowing open access for MVP/Testing
        }

        // 1. Fetch all Jars
        // In a real app with 7832 jars, we'd paginate or use a cursor.
        // For now, we'll fetch what we have in the DB.
        const jarsRef = collection(db, "jars");
        const snapshot = await getDocs(jarsRef);

        let updatedCount = 0;

        // 2. Update Scores
        const updates = snapshot.docs.map(async (jarDoc) => {
            const data = jarDoc.data();
            const tokenId = data.tokenId;

            if (!tokenId) return;

            // Fetch latest score from Neynar
            const currentSocialScore = await getCookieScore(tokenId);

            // Calculate difference to add to daily/total
            // Note: This logic assumes getCookieScore returns the TOTAL score.
            // If we want to track *new* interactions, we need to store the 'lastCheckedScore'.

            const lastCheckedScore = data.lastCheckedScore || 0;
            const newPoints = currentSocialScore - lastCheckedScore;

            if (newPoints > 0) {
                await updateDoc(doc(db, "jars", jarDoc.id), {
                    cookieScore: increment(newPoints),
                    dailyCookieScore: increment(newPoints),
                    lastCheckedScore: currentSocialScore,
                    lastUpdated: new Date()
                });
                updatedCount++;
            }
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true, updated: updatedCount });
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
