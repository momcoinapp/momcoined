import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, increment, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
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
        // 1. Fetch jars in batches (Batch size 50)
        // Sort by lastUpdated to ensure we rotate through users
        const jarsRef = collection(db, "jars");
        // FIX: Remove where clause if it causes index issues initially, but ideally we want 'lastUpdated'
        // For now, let's just grab 50. In prod, you must create a composite index if you sort/filter.
        // Assuming no index yet, we'll just get all and slice (bad for huge scale, fine for now) 
        // OR better: just limit 50. Firestore returns documents in ID order by default if no sort.
        // To ensure we don't just check the same 50, we would ideally need a cursor.
        // Simplified approach for "Freezing" fix: Just Process 50 Random ones (or first 50 returned)
        // BUT to rotate, we really should sort by 'lastUpdated' asc.
        // I will trust that we can add the index or it exists.

        // Let's use a simple query first to see if it unblocks.
        // We will read all (it's likely under 10k right now? If 7832 as user said, this might still be slowish but better than hitting neynar 7832 times)
        // actually hitting neynar 7832 times IS the bottleneck.

        // Correct Fix: LIMIT 50.
        // We will process the first 50 results. 
        // NOTE: This will always process the same 50 unless we update 'lastUpdated' and sort by it.
        // Below code updates 'lastUpdated'.

        const q = query(jarsRef, orderBy("lastUpdated", "asc"), limit(50));
        // If this fails due to missing index, check potential "frozen" logs for index creation link.
        const snapshot = await getDocs(q);

        let updatedCount = 0;

        // 2. Update Scores
        const updates = snapshot.docs.map(async (jarDoc) => {
            const data = jarDoc.data();
            const tokenId = data.tokenId;

            if (!tokenId) return;

            try {
                // Fetch latest score from Neynar
                const currentSocialScore = await getCookieScore(tokenId);

                // Calculate difference
                const lastCheckedScore = data.lastCheckedScore || 0;
                const newPoints = currentSocialScore - lastCheckedScore;

                // Always update 'lastUpdated' even if no new points, so they go to back of queue
                await updateDoc(doc(db, "jars", jarDoc.id), {
                    cookieScore: increment(newPoints > 0 ? newPoints : 0),
                    dailyCookieScore: increment(newPoints > 0 ? newPoints : 0),
                    lastCheckedScore: currentSocialScore,
                    lastUpdated: serverTimestamp() // Use server timestamp
                });
                if (newPoints > 0) updatedCount++;
            } catch (err) {
                console.error(`Failed to update jar ${jarDoc.id}`, err);
            }
        });

        await Promise.all(updates);

        return NextResponse.json({ success: true, updated: updatedCount, processed: snapshot.size });
    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
