import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
    try {
        if (!adminDb) {
            return NextResponse.json({ status: "error", message: "Firebase Admin not initialized (Check MOM_ADMIN_PRIVATE_KEY)" }, { status: 500 });
        }

        // Try to read a test collection
        const snapshot = await adminDb.collection('users').limit(1).get();
        const userCount = snapshot.size;

        // Try to write a ping
        await adminDb.collection('system_logs').add({
            event: "ping",
            timestamp: new Date().toISOString()
        });

        return NextResponse.json({
            status: "success",
            message: "Firebase Connected!",
            userCountPreview: userCount,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
