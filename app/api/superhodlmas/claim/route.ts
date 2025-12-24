import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp, increment } from 'firebase/firestore';
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract addresses
const MOM_TOKEN_ADDRESS = '0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07' as const;
const TREASURY_ADDRESS = process.env.TREASURY_WALLET_ADDRESS as `0x${string}`;

// ERC-20 ABI for transfer
const ERC20_ABI = [
    {
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;

// Public client
const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

export async function POST(req: NextRequest) {
    try {
        const { cardId, recipientAddress } = await req.json();

        if (!cardId || !recipientAddress) {
            return NextResponse.json({ error: 'Missing cardId or recipientAddress' }, { status: 400 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        // Get card from Firebase
        const cardRef = doc(db, 'superhodlmas_cards', cardId);
        const cardSnap = await getDoc(cardRef);

        if (!cardSnap.exists()) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        const card = cardSnap.data();

        // Check if already claimed
        if (card.status === 'claimed') {
            return NextResponse.json({ error: 'Card already claimed' }, { status: 400 });
        }

        // Check expiry
        if (card.expiresAt && card.expiresAt.toDate() < new Date()) {
            return NextResponse.json({ error: 'Card has expired' }, { status: 400 });
        }

        // Update Firebase to claimed
        await updateDoc(cardRef, {
            status: 'claimed',
            recipientWallet: recipientAddress.toLowerCase(),
            claimedAt: Timestamp.now(),
        });

        // Award cookies to recipient (+500)
        try {
            const recipientRef = doc(db, 'users', recipientAddress.toLowerCase());
            const recipientSnap = await getDoc(recipientRef);

            if (recipientSnap.exists()) {
                await updateDoc(recipientRef, {
                    cookies: increment(500),
                    cardsReceived: increment(1),
                });
            }

            // Award referral cookies to sender (+500)
            const senderRef = doc(db, 'users', card.senderWallet);
            const senderSnap = await getDoc(senderRef);

            if (senderSnap.exists()) {
                await updateDoc(senderRef, {
                    cookies: increment(500),
                    referralBonus: increment(1),
                });
            }
        } catch (cookieError) {
            console.error('Cookie update error:', cookieError);
        }

        // TODO: Add 100 MOM transfer when treasury private key is configured
        // const account = privateKeyToAccount(process.env.TREASURY_PRIVATE_KEY as `0x${string}`);
        // const walletClient = createWalletClient({ account, chain: base, transport: http() });
        // await walletClient.writeContract({
        //   address: MOM_TOKEN_ADDRESS,
        //   abi: ERC20_ABI,
        //   functionName: 'transfer',
        //   args: [recipientAddress, 100n * 10n ** 18n],
        // });

        return NextResponse.json({
            success: true,
            cardId,
            recipientAddress,
            cookiesEarned: 500,
            momReward: 100, // Will be transferred when contract integration is active
            raffleEntries: 2, // +2 for recipient on claim
        });

    } catch (error) {
        console.error('Error claiming card:', error);
        return NextResponse.json({ error: 'Failed to claim card' }, { status: 500 });
    }
}
