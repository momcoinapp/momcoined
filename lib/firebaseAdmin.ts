import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

function initFirebaseAdmin() {
    if (getApps().length === 0) {
        const privateKey = process.env.MOM_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const clientEmail = process.env.MOM_ADMIN_CLIENT_EMAIL;

        console.log("[Firebase Admin] Initializing...");
        console.log("  - Project ID:", projectId ? "✓" : "✗");
        console.log("  - Client Email:", clientEmail ? "✓" : "✗");
        console.log("  - Private Key:", privateKey ? "✓" : "✗");

        if (!projectId || !clientEmail || !privateKey) {
            console.warn("[Firebase Admin] Missing credentials. Admin features will be disabled.");
            return null;
        }

        try {
            return initializeApp({
                credential: cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            });
        } catch (error) {
            console.error("[Firebase Admin] Failed to initialize:", error);
            return null;
        }
    }
    return getApps()[0];
}

const adminApp = initFirebaseAdmin();
export const adminDb = adminApp ? getAdminFirestore(adminApp) : null;
