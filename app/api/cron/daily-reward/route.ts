import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI } from "@/lib/contracts";

export async function GET(req: NextRequest) {
    // 1. Verify Cron Secret (Security)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        // 2. Get Top 25 Users
        const q = query(
            collection(db, "users"),
            orderBy("leaderboardScore", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return NextResponse.json({ message: "No users found" });
        }

        // 3. Setup Admin Wallet
        const privateKey = process.env.MOM_ADMIN_PRIVATE_KEY;
        if (!privateKey) return NextResponse.json({ error: "Admin Key Missing" }, { status: 500 });

        const account = privateKeyToAccount(privateKey as `0x${string}`);
        const client = createWalletClient({ account, chain: base, transport: http() });
        const publicClient = createPublicClient({ chain: base, transport: http() });

        const results = [];

        // 4. Loop through Top 25 & Fill Jars
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            const userAddress = userData.walletAddress;

            // Check if user has a Jar (Token ID)
            // In a real app, we'd query the contract or DB to find their active Jar ID.
            // For this MVP, we assume `activeJarId` is stored in their user profile.
            // If not, we skip.
            const tokenId = userData.activeJarId;

            if (tokenId) {
                try {
                    const { request } = await publicClient.simulateContract({
                        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                        abi: MOM_COOKIE_JAR_ABI,
                        functionName: 'adminFill',
                        args: [BigInt(tokenId)],
                        account
                    });
                    const hash = await client.writeContract(request);
                    results.push({ user: userAddress, status: "Filled", tx: hash });
                } catch (e) {
                    console.error(`Failed to fill for ${userAddress}:`, e);
                    results.push({ user: userAddress, status: "Failed", error: String(e) });
                }
            } else {
                results.push({ user: userAddress, status: "Skipped (No Active Jar)" });
            }
        }

        return NextResponse.json({
            success: true,
            processed: results.length,
            details: results
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Cron Failed" }, { status: 500 });
    }
}
