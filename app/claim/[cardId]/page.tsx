'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import type { Metadata } from 'next';

interface CardData {
    templateId: number;
    templateName: string;
    imageUri: string;
    style: string;
    event: string;
    rarity: string;
    recipientName: string;
    message: string;
    quote: string;
    senderWallet: string;
    recipientWallet?: string;
    status: 'pending' | 'claimed';
    createdAt: any;
    expiresAt: any;
}

export default function ClaimPage() {
    const params = useParams();
    const cardId = params.cardId as string;
    const { address, isConnected } = useAccount();

    const [cardData, setCardData] = useState<CardData | null>(null);
    const [step, setStep] = useState<'loading' | 'envelope' | 'opening' | 'revealed' | 'claiming' | 'claimed' | 'error'>('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCard = async () => {
            if (!cardId || !db) return;

            try {
                const docSnap = await getDoc(doc(db, 'superhodlmas_cards', cardId));

                if (!docSnap.exists()) {
                    setError('Card not found');
                    setStep('error');
                    return;
                }

                const data = docSnap.data() as CardData;

                // Check expiry
                if (data.expiresAt && data.expiresAt.toDate() < new Date()) {
                    setError('This card has expired');
                    setStep('error');
                    return;
                }

                setCardData(data);
                setStep(data.status === 'claimed' ? 'claimed' : 'envelope');
            } catch (err) {
                console.error('Error fetching card:', err);
                setError('Failed to load card');
                setStep('error');
            }
        };

        fetchCard();
    }, [cardId]);

    const handleRipOpen = () => {
        setStep('opening');
        setTimeout(() => setStep('revealed'), 1500);
    };

    const handleClaim = async () => {
        if (!isConnected || !address || !cardId || !db) {
            toast.error('Please connect your wallet');
            return;
        }

        setStep('claiming');

        try {
            // Update Firebase
            await updateDoc(doc(db, 'superhodlmas_cards', cardId), {
                status: 'claimed',
                recipientWallet: address.toLowerCase(),
                claimedAt: Timestamp.now(),
            });

            // TODO: Mint NFT + Send 100 MOM via contract
            // For now, just update status

            setStep('claimed');
            toast.success('Gift claimed! +100 $MOMCOIN incoming! 🎉');
        } catch (err) {
            console.error('Error claiming:', err);
            toast.error('Failed to claim gift');
            setStep('revealed');
        }
    };

    const handleShare = () => {
        const shareText = `Just ripped open Mom's envelope – got NFT + 100 $MOMCOIN! 🎁\n\nThanks @blokmom #CryptoChristmas\n\nhttps://app.momcoined.com/cards`;
        window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}`, '_blank');
    };

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-950 to-black flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="text-6xl"
                >
                    🎁
                </motion.div>
            </div>
        );
    }

    if (step === 'error') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-950 to-black flex items-center justify-center">
                <Card className="bg-white/10 border-white/20 p-8 text-center max-w-md">
                    <p className="text-6xl mb-4">😢</p>
                    <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
                    <p className="text-gray-300">{error}</p>
                    <Button
                        onClick={() => window.location.href = '/cards'}
                        className="mt-6 bg-green-600 hover:bg-green-500"
                    >
                        Send Your Own Card
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-950 via-green-950 to-black py-8 px-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <AnimatePresence mode="wait">
                    {/* Envelope State */}
                    {step === 'envelope' && (
                        <motion.div
                            key="envelope"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="text-center"
                        >
                            <h1 className="text-2xl font-bold text-white mb-4">
                                🎁 You've Got a SuperHODLmas Gift!
                            </h1>
                            <p className="text-gray-300 mb-6">
                                From: {cardData?.senderWallet?.slice(0, 6)}...{cardData?.senderWallet?.slice(-4)}
                            </p>

                            {/* Sealed Envelope */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative cursor-pointer mx-auto"
                                onClick={handleRipOpen}
                            >
                                <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-8 shadow-2xl border-4 border-yellow-500">
                                    <div className="text-center">
                                        <p className="text-6xl mb-4">✉️</p>
                                        <p className="text-white font-bold">HODL</p>
                                        <p className="text-yellow-300 text-sm">Tap to Rip Open!</p>
                                    </div>
                                </div>
                            </motion.div>

                            <p className="text-yellow-400 text-sm mt-6 animate-pulse">
                                Contains: NFT + 100 $MOMCOIN 🎄
                            </p>

                            <Button
                                onClick={handleRipOpen}
                                className="mt-6 bg-green-600 hover:bg-green-500 text-white text-lg py-6 px-8"
                            >
                                🎄 Rip Open Gift!
                            </Button>
                        </motion.div>
                    )}

                    {/* Opening Animation */}
                    {step === 'opening' && (
                        <motion.div
                            key="opening"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                        >
                            <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500/50">
                                <video
                                    src="/card-opening.mp4"
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    onEnded={() => setStep('revealed')}
                                />
                            </div>
                            <p className="text-white mt-4 animate-pulse">Ripping open...</p>
                        </motion.div>
                    )}

                    {/* Revealed Card */}
                    {(step === 'revealed' || step === 'claiming') && cardData && (
                        <motion.div
                            key="revealed"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.4 }}
                            className="text-center"
                        >
                            <Card className="bg-white/10 border-white/20 p-4 overflow-hidden">
                                <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                                    <Image
                                        src={cardData.imageUri}
                                        alt={cardData.templateName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="text-left space-y-3 mb-4">
                                    <p className="text-white">
                                        <span className="text-gray-400">To:</span> {cardData.recipientName}
                                    </p>
                                    <p className="text-white text-lg">{cardData.message}</p>
                                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                                        <p className="text-yellow-200 italic">"{cardData.quote}"</p>
                                        <p className="text-yellow-400 text-xs mt-1">— Mom</p>
                                    </div>
                                </div>

                                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 mb-4">
                                    <p className="text-green-300 font-bold">🎁 Your Gift:</p>
                                    <p className="text-white">• SuperHODLmas NFT Card</p>
                                    <p className="text-white">• 100 $MOMCOIN</p>
                                    <p className="text-white">• +2 Raffle Entries 🎟️</p>
                                </div>

                                <Button
                                    onClick={handleClaim}
                                    disabled={step === 'claiming' || !isConnected}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white text-lg py-6"
                                >
                                    {step === 'claiming' ? '🎄 Claiming...' : '🎁 Claim FREE Gift'}
                                </Button>

                                {!isConnected && (
                                    <p className="text-yellow-400 text-sm mt-2">
                                        Connect wallet to claim
                                    </p>
                                )}
                            </Card>
                        </motion.div>
                    )}

                    {/* Claimed State */}
                    {step === 'claimed' && (
                        <motion.div
                            key="claimed"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="relative w-full aspect-video mb-6 rounded-xl overflow-hidden shadow-2xl border-4 border-green-500">
                                <Image
                                    src="/superhodlmas-claimed.jpg"
                                    fill
                                    alt="Gift Claimed"
                                    className="object-cover"
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Gift Claimed!</h1>
                            <p className="text-green-400 mb-4">+100 $MOMCOIN + NFT + Raffle Entries</p>

                            <Card className="bg-white/10 border-white/20 p-4 mb-6">
                                <p className="text-white mb-2">Welcome to the MomCoin family! 🍪</p>
                                <p className="text-gray-300 text-sm">
                                    Your NFT and $MOMCOIN are on their way. Explore the app to earn more!
                                </p>
                            </Card>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleShare}
                                    className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                                >
                                    🟣 Share on Farcaster
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/cards'}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white"
                                >
                                    📮 Send Your Own Card
                                </Button>
                                <Button
                                    onClick={() => window.location.href = '/'}
                                    variant="outline"
                                    className="w-full border-white/20 text-white"
                                >
                                    🏠 Explore MomCoin
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
