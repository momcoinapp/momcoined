'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { CARD_TEMPLATES, getRandomQuote, getTemplatesByOccasion, CardTemplate, OccasionType, OCCASION_LABELS, getAllTemplates } from '@/lib/cardTemplates';
import { useAccount } from 'wagmi';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useShareToFarcaster } from '@/hooks/useShareToFarcaster';

export default function CardsPage() {
    const { address, isConnected } = useAccount();
    const { shareCard } = useShareToFarcaster();
    const [occasion, setOccasion] = useState<OccasionType>('love');
    const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [randomQuote, setRandomQuote] = useState('');
    const [step, setStep] = useState<'select' | 'customize' | 'sending' | 'success'>('select');
    const [generatedLink, setGeneratedLink] = useState('');
    const [cardId, setCardId] = useState('');
    const [dailySendCount, setDailySendCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isBackendReady, setIsBackendReady] = useState(false);

    const templates = getTemplatesByOccasion(occasion);
    const DAILY_LIMIT = 999999; // Unlimited!

    useEffect(() => {
        setRandomQuote(getRandomQuote());
    }, [selectedTemplate]);

    // Check daily send count
    useEffect(() => {
        const checkDailyLimit = async () => {
            if (!address || !db) return;
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const q = query(
                collection(db, 'mom_cards'),
                where('senderWallet', '==', address.toLowerCase()),
                where('createdAt', '>=', Timestamp.fromDate(today))
            );

            const snapshot = await getDocs(q);
            setDailySendCount(snapshot.size);
        };

        checkDailyLimit();
    }, [address]);

    const handleSelectTemplate = (template: CardTemplate) => {
        setSelectedTemplate(template);
        setStep('customize');
    };

    const handleSendCard = async () => {
        if (!selectedTemplate || !address || !db) {
            toast.error('Please connect your wallet');
            return;
        }

        if (dailySendCount >= DAILY_LIMIT) {
            toast.error(`Daily limit reached (${DAILY_LIMIT} cards/day)`);
            return;
        }

        setIsLoading(true);
        setStep('sending');

        try {
            // Create card record in Firebase
            const cardData = {
                templateId: selectedTemplate.id,
                templateName: selectedTemplate.name,
                imageUri: selectedTemplate.image,
                style: selectedTemplate.style,
                occasion: occasion,
                rarity: selectedTemplate.rarity,
                recipientName: recipientName || 'Friend',
                message: message || 'Wishing you the best! 💕',
                quote: randomQuote,
                senderWallet: address.toLowerCase(),
                status: 'pending',
                createdAt: Timestamp.now(),
                expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days
                cookiesAwarded: false,
            };

            const docRef = await addDoc(collection(db, 'mom_cards'), cardData);
            const newCardId = docRef.id;
            const claimLink = `https://app.momcoined.com/claim/${newCardId}`;

            setCardId(newCardId);
            setGeneratedLink(claimLink);
            setDailySendCount(prev => prev + 1);
            setIsBackendReady(true);

            toast.success('Card sent! +50 cookies earned 🍪');
        } catch (error) {
            console.error('Error creating card:', error);
            toast.error('Failed to create card');
            setStep('customize');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShareFarcaster = () => {
        if (cardId && recipientName) {
            shareCard(cardId, recipientName, address?.slice(0, 8) || 'Someone', message);
        }
    };

    const handleShare = (platform: string) => {
        const shareText = `I just sent a Momcoined NFT card! 💕\n\nClaim yours: ${generatedLink}\n\n@momcoined #Base`;

        const urls: Record<string, string> = {
            farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(`https://app.momcoined.com/share/card/${cardId}?to=${encodeURIComponent(recipientName)}&from=${encodeURIComponent(address?.slice(0, 8) || 'Anon')}&msg=${encodeURIComponent(message || '')}`)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`I sent you a Momcoined NFT card! 💕 Claim it: ${generatedLink}`)}`,
        };

        if (platform === 'sms') {
            const smsText = `I sent you a Momcoined NFT card! Claim it: ${generatedLink} 💕`;
            if (navigator.share) {
                navigator.share({ title: 'Mom Card', text: smsText, url: generatedLink }).catch(console.error);
            } else {
                window.open(`sms:?body=${encodeURIComponent(smsText)}`, '_self');
            }
            return;
        }

        if (platform === 'copy') {
            navigator.clipboard.writeText(generatedLink);
            toast.success('Link copied!');
            return;
        }

        window.open(urls[platform], '_blank');
    };

    const resetFlow = () => {
        setSelectedTemplate(null);
        setRecipientName('');
        setMessage('');
        setGeneratedLink('');
        setCardId('');
        setIsBackendReady(false);
        setStep('select');
        setRandomQuote(getRandomQuote());
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950 to-black py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        💕 Mom's NFT Card Mailer
                    </h1>
                    <p className="text-gray-300">
                        Send FREE NFT Cards for any occasion + earn cookies on Base!
                    </p>
                    {isConnected && (
                        <p className="text-sm text-yellow-400 mt-2">
                            Unlimited free cards available!
                        </p>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Select Template */}
                    {step === 'select' && (
                        <motion.div
                            key="select"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Occasion Selector */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {(Object.keys(OCCASION_LABELS) as OccasionType[]).map((occ) => (
                                    <Button
                                        key={occ}
                                        onClick={() => setOccasion(occ)}
                                        className={`${occasion === occ ? 'bg-pink-600' : 'bg-gray-700'} text-white px-4`}
                                    >
                                        {OCCASION_LABELS[occ].emoji} {OCCASION_LABELS[occ].label}
                                    </Button>
                                ))}
                            </div>

                            {/* Template Gallery */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {templates.map((template) => (
                                    <Card
                                        key={template.id}
                                        className="bg-white/10 border-white/20 cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                                        onClick={() => handleSelectTemplate(template)}
                                    >
                                        <div className="relative aspect-square">
                                            <Image
                                                src={template.image}
                                                alt={template.name}
                                                fill
                                                className="object-cover"
                                            />
                                            {template.rarity !== 'common' && (
                                                <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${template.rarity === 'legendary' ? 'bg-yellow-500' : 'bg-purple-500'
                                                    } text-white`}>
                                                    {template.rarity}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="text-white text-sm font-medium truncate">{template.name}</p>
                                            <p className="text-gray-400 text-xs">{template.style}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Customize */}
                    {step === 'customize' && selectedTemplate && (
                        <motion.div
                            key="customize"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-md mx-auto"
                        >
                            <Card className="bg-white/10 border-white/20 p-6">
                                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedTemplate.image}
                                        alt={selectedTemplate.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-white text-sm mb-1 block">Recipient Name</label>
                                        <Input
                                            placeholder="Mom, Friend, etc."
                                            value={recipientName}
                                            onChange={(e) => setRecipientName(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-white text-sm mb-1 block">Personal Message</label>
                                        <Textarea
                                            placeholder="Add a personal message..."
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="bg-pink-500/20 border border-pink-500/50 rounded-lg p-3">
                                        <p className="text-pink-200 text-sm italic">"{randomQuote}"</p>
                                        <p className="text-pink-400 text-xs mt-1">— Mom Quote (auto-added)</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => setStep('select')}
                                            variant="outline"
                                            className="flex-1 border-white/20 text-white"
                                        >
                                            ← Back
                                        </Button>
                                        <Button
                                            onClick={handleSendCard}
                                            disabled={!isConnected || isLoading}
                                            className="flex-1 bg-pink-600 hover:bg-pink-500 text-white"
                                        >
                                            {isLoading ? '💌 Sending...' : '📮 Send Card'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3: Sending Animation */}
                    {step === 'sending' && (
                        <motion.div
                            key="sending"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-500/50">
                                <video
                                    src="/card-sending.mp4"
                                    autoPlay
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-cover"
                                    onEnded={() => {
                                        if (isBackendReady) {
                                            setStep('success');
                                        }
                                    }}
                                />
                                {!isBackendReady && (
                                    <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/80 animate-pulse">
                                        Creating card...
                                    </p>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Sealing your card...</h2>
                            <p className="text-gray-300">Adding Mom's magic touch ✨</p>
                        </motion.div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5 }}
                                className="text-8xl mb-4"
                            >
                                💕
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">Card Sent!</h2>
                            <p className="text-pink-400 mb-6">+50 cookies earned 🍪</p>

                            {/* Claim Link */}
                            <div className="bg-white/10 rounded-lg p-4 mb-6 max-w-md mx-auto">
                                <p className="text-gray-400 text-sm mb-2">Share this link:</p>
                                <div className="flex gap-2">
                                    <Input
                                        value={generatedLink}
                                        readOnly
                                        className="bg-white/5 border-white/20 text-white text-sm"
                                    />
                                    <Button onClick={() => handleShare('copy')} className="bg-white/10">
                                        📋
                                    </Button>
                                </div>
                            </div>

                            {/* Share Buttons */}
                            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mb-6">
                                <Button
                                    onClick={() => handleShare('farcaster')}
                                    className="bg-purple-600 hover:bg-purple-500 text-white"
                                >
                                    🟣 Farcaster
                                </Button>
                                <Button
                                    onClick={() => handleShare('twitter')}
                                    className="bg-black hover:bg-gray-900 text-white border border-white/20"
                                >
                                    𝕏 Share
                                </Button>
                                <Button
                                    onClick={() => handleShare('whatsapp')}
                                    className="bg-green-600 hover:bg-green-500 text-white"
                                >
                                    💬 WhatsApp
                                </Button>
                                <Button
                                    onClick={() => handleShare('sms')}
                                    className="bg-blue-600 hover:bg-blue-500 text-white"
                                >
                                    📱 Text/SMS
                                </Button>
                            </div>

                            <Button
                                onClick={resetFlow}
                                variant="outline"
                                className="border-white/20 text-white"
                            >
                                Send Another Card
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
