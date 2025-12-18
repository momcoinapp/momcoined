import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        // Verify Cron Secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            // return new NextResponse('Unauthorized', { status: 401 });
        }

        const batch = writeBatch(db);
        let operationCount = 0;

        // 1. Reset Users Daily Score
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);

        usersSnapshot.forEach((userDoc) => {
            batch.update(doc(db, "users", userDoc.id), {
                dailyScore: 0,
                lastDailyReset: new Date()
            });
            operationCount++;
        });

        // 2. Reset Jars Daily Cookie Score
        const jarsRef = collection(db, "jars");
        const jarsSnapshot = await getDocs(jarsRef);

        jarsSnapshot.forEach((jarDoc) => {
            batch.update(doc(db, "jars", jarDoc.id), {
                dailyCookieScore: 0,
                lastDailyReset: new Date()
            });
            operationCount++;
        });

        // Commit Batch (Note: Firestore batch limit is 500. In prod, chunk this.)
        if (operationCount > 0) {
            await batch.commit();
        }

        return NextResponse.json({ success: true, resetCount: operationCount });
    } catch (error) {
        console.error("Reset Cron error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
