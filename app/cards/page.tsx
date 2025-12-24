'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea';
import { CARD_TEMPLATES, getRandomQuote, getTemplatesByEvent, CardTemplate } from '@/lib/cardTemplates';
import { useAccount } from 'wagmi';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { SentCardsDashboard } from '@/components/cards/SentCardsDashboard';

type EventType = 'christmas' | 'newyear';
type ViewType = 'create' | 'sent';

export default function CardsPage() {
    const { address, isConnected } = useAccount();
    const [event, setEvent] = useState<EventType>('christmas');
    const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
    const [recipientName, setRecipientName] = useState('');
    const [message, setMessage] = useState('');
    const [randomQuote, setRandomQuote] = useState('');
    const [step, setStep] = useState<'select' | 'customize' | 'sending' | 'success'>('select');
    const [generatedLink, setGeneratedLink] = useState('');
    const [dailySendCount, setDailySendCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isBackendReady, setIsBackendReady] = useState(false);

    const templates = getTemplatesByEvent(event);
    const DAILY_LIMIT = 999999; // Unlimited for Christmas!

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
                collection(db, 'superhodlmas_cards'),
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
                event: event,
                rarity: selectedTemplate.rarity,
                recipientName: recipientName || 'Friend',
                message: message || 'Wishing you a SuperHODLmas! 🎄',
                quote: randomQuote,
                senderWallet: address.toLowerCase(),
                status: 'pending',
                createdAt: Timestamp.now(),
                expiresAt: Timestamp.fromDate(new Date('2026-01-15')),
                cookiesAwarded: false,
                raffleEntries: 1,
            };

            const docRef = await addDoc(collection(db, 'superhodlmas_cards'), cardData);
            const cardId = docRef.id;
            const claimLink = `https://app.momcoined.com/claim/${cardId}`;

            setGeneratedLink(claimLink);
            setDailySendCount(prev => prev + 1);
            setIsBackendReady(true); // Signal that backend work is done

            toast.success('Card sent! +500 cookies earned 🍪');
        } catch (error) {
            console.error('Error creating card:', error);
            toast.error('Failed to create card');
            setStep('customize');
        } finally {
            setIsLoading(false);
        }
    };

    const handleShare = (platform: string) => {
        const shareText = `Just sent Mom's #SuperHODLmas NFT Card + raffle entry! 🎄 #CryptoChristmas\n\nRip open yours: ${generatedLink}\n\n@blokmom @momcoined`;

        const urls: Record<string, string> = {
            farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(generatedLink)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`Merry #CryptoChristmas! 🎄 I sent you a SuperHODLmas gift + 100 $MOMCOIN! Rip it open: ${generatedLink}`)}`,
        };

        if (platform === 'sms') {
            const smsText = `Merry #CryptoChristmas! Mom sent you a SuperHODLmas envelope + 100 $MOMCOIN gift! Rip open: ${generatedLink} 🎄 @blokmom`;
            if (navigator.share) {
                navigator.share({ title: 'SuperHODLmas Gift', text: smsText, url: generatedLink }).catch(console.error);
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
        setIsBackendReady(false);
        setStep('select');
        setRandomQuote(getRandomQuote());
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-950 via-green-950 to-black py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        🎄 CryptoChristmas Card NFT Mailer
                    </h1>
                    <p className="text-gray-300">
                        Send FREE Holiday NFT Cards + 100 $MOM Gifts | Happy New Year from Mom!
                    </p>
                    {isConnected && (
                        <p className="text-sm text-yellow-400 mt-2">
                            {DAILY_LIMIT - dailySendCount} free cards remaining today
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
                            {/* Event Selector */}
                            <div className="flex justify-center gap-4 mb-6">
                                <Button
                                    onClick={() => setEvent('christmas')}
                                    className={`${event === 'christmas' ? 'bg-red-600' : 'bg-gray-700'} text-white px-6`}
                                >
                                    🎄 Christmas 2025
                                </Button>
                                <Button
                                    onClick={() => setEvent('newyear')}
                                    className={`${event === 'newyear' ? 'bg-purple-600' : 'bg-gray-700'} text-white px-6`}
                                >
                                    🎆 New Year 2026
                                </Button>
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

                            {/* AI Options */}
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Button className="bg-pink-600 hover:bg-pink-500 text-white py-6">
                                    ✨ Generate for Mom (Free)
                                </Button>
                                <Button className="bg-purple-600 hover:bg-purple-500 text-white py-6">
                                    🔥 Generate Degen (Free)
                                </Button>
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

                                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3">
                                        <p className="text-yellow-200 text-sm italic">"{randomQuote}"</p>
                                        <p className="text-yellow-400 text-xs mt-1">— Mom Quote (auto-added)</p>
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
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                                        >
                                            {isLoading ? '🎄 Sending...' : '📮 Send Card'}
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
                            <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500/50">
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
                                        } else {
                                            // Ideally loop the last bit or show loading, but for now just wait
                                            // The backend effect could also trigger this if we used a ref, 
                                            // but simple "wait for end" is safer.
                                            // Let's loop if not ready, or just set ready state to trigger effect.
                                        }
                                    }}
                                />
                                {!isBackendReady && (
                                    <p className="absolute bottom-2 left-0 right-0 text-center text-xs text-white/80 animate-pulse">
                                        Minting...
                                    </p>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Sealing your gift...</h2>
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
                                🎁
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">Gift Mailed!</h2>
                            <p className="text-green-400 mb-6">+500 cookies earned 🍪 +1 raffle entry 🎟️</p>

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
