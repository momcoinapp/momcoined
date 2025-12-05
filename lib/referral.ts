import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, increment, runTransaction } from "firebase/firestore";
import { customAlphabet } from "nanoid";

// Use a safe alphabet for codes (no ambiguous characters like 0/O, 1/I)
const nanoid = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

export interface ReferralData {
    code: string;
    referralCount: number;
    totalPoints: number;
}

/**
 * Generates or retrieves a referral code for a user.
 */
export async function getOrCreateReferralCode(walletAddress: string): Promise<string> {
    const userRef = doc(db, "users", walletAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().referralCode) {
        return userSnap.data().referralCode;
    }

    // Generate a unique code
    let code = "";
    let isUnique = false;

    // Simple retry loop to ensure uniqueness
    while (!isUnique) {
        code = "MOM-" + nanoid();
        const q = query(collection(db, "users"), where("referralCode", "==", code));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            isUnique = true;
        }
    }

    // Save to user profile
    await setDoc(userRef, {
        referralCode: code,
        referralCount: 0,
        referralPoints: 0
    }, { merge: true });

    return code;
}

/**
 * Processes a referral when a new user signs up.
 */
export async function processReferral(newWalletAddress: string, referralCode: string) {
    if (!referralCode) return { success: false, error: "No code provided" };

    // Find referrer
    const q = query(collection(db, "users"), where("referralCode", "==", referralCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return { success: false, error: "Invalid referral code" };
    }

    const referrerDoc = querySnapshot.docs[0];
    const referrerAddress = referrerDoc.id;

    // Prevent self-referral
    if (referrerAddress.toLowerCase() === newWalletAddress.toLowerCase()) {
        return { success: false, error: "Cannot refer yourself" };
    }

    const newUserRef = doc(db, "users", newWalletAddress);
    const referrerRef = doc(db, "users", referrerAddress);

    try {
        await runTransaction(db, async (transaction) => {
            const newUserDoc = await transaction.get(newUserRef);

            // Check if already referred
            if (newUserDoc.exists() && newUserDoc.data().referredBy) {
                throw new Error("User already referred");
            }

            // Update new user
            transaction.set(newUserRef, {
                referredBy: referrerAddress,
                referralCode: null, // They don't have their own code yet
                referralCount: 0,
                referralPoints: 0,
                joinedAt: new Date().toISOString()
            }, { merge: true });

            // Update referrer (increment count and points)
            transaction.update(referrerRef, {
                referralCount: increment(1),
                referralPoints: increment(1000) // 1000 points per referral
            });
        });

        return { success: true, referrerAddress };
    } catch (error) {
        console.error("Referral error:", error);
        return { success: false, error: "Referral failed" };
    }
}
