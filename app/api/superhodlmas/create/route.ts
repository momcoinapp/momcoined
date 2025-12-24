import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { getRandomQuote } from '@/lib/cardTemplates';
import { createPublicClient, createWalletClient, http } from 'viem';
import { base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract addresses
const CHRISTMAS_CARDS_ADDRESS = '0xe2fed307e70e76f1b089ef34996c4b2187051afe' as const;
const TREASURY_ADDRESS = process.env.TREASURY_WALLET_ADDRESS as `0x${string}`;

// ERC-1155 ABI (mintCard function)
const CHRISTMAS_CARDS_ABI = [
    {
        inputs: [{ name: 'id', type: 'uint256' }],
        name: 'mintCard',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
] as const;

// Daily limit raised for Christmas rush!
const DAILY_LIMIT = 10;

// Public client for reading
const publicClient = createPublicClient({
    chain: base,
    transport: http(),
});

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const { templateId, templateName, imageUri, style, event, rarity, recipientName, message, senderWallet } = data;

        if (!senderWallet || !templateId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!db) {
            return NextResponse.json({ error: 'Database not available' }, { status: 500 });
        }

        // Check daily limit
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const q = query(
            collection(db, 'superhodlmas_cards'),
            where('senderWallet', '==', senderWallet.toLowerCase()),
            where('createdAt', '>=', Timestamp.fromDate(today))
        );

        const snapshot = await getDocs(q);
        if (snapshot.size >= DAILY_LIMIT) {
            return NextResponse.json({
                error: `Daily limit reached (${DAILY_LIMIT} cards/day)`,
                remaining: 0
            }, { status: 429 });
        }

        // Generate random Mom quote
        const quote = getRandomQuote();

        // Create card record in Firebase
        const cardData = {
            templateId,
            templateName,
            imageUri,
            style,
            event,
            rarity,
            recipientName: recipientName || 'Friend',
            message: message || 'Wishing you a SuperHODLmas! 🎄',
            quote,
            senderWallet: senderWallet.toLowerCase(),
            status: 'pending',
            createdAt: Timestamp.now(),
            expiresAt: Timestamp.fromDate(new Date('2026-01-15')),
            cookiesAwarded: false,
            raffleEntries: 1,
            tokenId: null, // Will be set after mint
        };

        const docRef = await addDoc(collection(db, 'superhodlmas_cards'), cardData);
        const cardId = docRef.id;

        // Award cookies to sender (+500)
        try {
            const userRef = doc(db, 'users', senderWallet.toLowerCase());
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                await updateDoc(userRef, {
                    cookies: increment(500),
                    cardsSent: increment(1),
                });
            }
        } catch (cookieError) {
            console.error('Cookie update error:', cookieError);
            // Continue even if cookie update fails
        }

        const claimLink = `https://app.momcoined.com/claim/${cardId}`;

        return NextResponse.json({
            success: true,
            cardId,
            claimLink,
            cookiesEarned: 500,
            raffleEntries: 1,
            remaining: DAILY_LIMIT - snapshot.size - 1,
        });

    } catch (error) {
        console.error('Error creating card:', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }
}
