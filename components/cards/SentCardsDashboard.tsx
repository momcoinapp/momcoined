'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface SentCard {
    id: string;
    templateName: string;
    imageUri: string;
    recipientName: string;
    status: 'pending' | 'claimed';
    createdAt: any;
}

export function SentCardsDashboard() {
    const { address, isConnected } = useAccount();
    const [cards, setCards] = useState<SentCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSentCards = async () => {
            if (!address || !db) {
                setIsLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(db, 'superhodlmas_cards'),
                    where('senderWallet', '==', address.toLowerCase()),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                const sentCards: SentCard[] = [];

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    sentCards.push({
                        id: doc.id,
                        templateName: data.templateName,
                        imageUri: data.imageUri,
                        recipientName: data.recipientName,
                        status: data.status,
                        createdAt: data.createdAt,
                    });
                });

                setCards(sentCards);
            } catch (error) {
                console.error('Error fetching sent cards:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSentCards();
    }, [address]);

    const handleCopyLink = (cardId: string) => {
        const link = `https://app.momcoined.com/claim/${cardId}`;
        navigator.clipboard.writeText(link);
        toast.success('Link copied!');
    };

    const handleResend = (cardId: string) => {
        const link = `https://app.momcoined.com/claim/${cardId}`;
        const shareText = `Just sent Mom's #CryptoChristmas SuperHODLmas card! 🎄\n\nClaim yours: ${link}\n\n@blokmom`;

        if (navigator.share) {
            navigator.share({ title: 'SuperHODLmas Gift', text: shareText, url: link }).catch(console.error);
        } else {
            window.open(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(link)}`, '_blank');
        }
    };

    if (!isConnected) {
        return (
            <Card className="bg-white/10 border-white/20 p-6 text-center">
                <p className="text-gray-300">Connect your wallet to see your sent cards</p>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card className="bg-white/10 border-white/20 p-6 text-center">
                <p className="text-gray-300">Loading your sent cards...</p>
            </Card>
        );
    }

    if (cards.length === 0) {
        return (
            <Card className="bg-white/10 border-white/20 p-6 text-center">
                <p className="text-6xl mb-4">📮</p>
                <p className="text-white font-medium mb-2">No cards sent yet</p>
                <p className="text-gray-400 text-sm">Send your first SuperHODLmas card!</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                📬 My Sent Cards ({cards.length})
            </h2>

            <div className="grid gap-3">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="bg-white/10 border-white/20 p-3 flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={card.imageUri}
                                    alt={card.templateName}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{card.templateName}</p>
                                <p className="text-gray-400 text-sm">To: {card.recipientName}</p>
                                <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${card.status === 'claimed'
                                    ? 'bg-green-500/20 text-green-300'
                                    : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                    {card.status === 'claimed' ? '✅ Claimed' : '⏳ Pending'}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-shrink-0">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white/20 text-white"
                                    onClick={() => handleCopyLink(card.id)}
                                >
                                    📋
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-purple-600 hover:bg-purple-500 text-white"
                                    onClick={() => handleResend(card.id)}
                                >
                                    📤
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
