"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/Dialog"; // Assuming you have a Dialog component or similar
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"; // Assuming Input component
import { Flame, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useUserSession } from "@/components/providers/UserSessionProvider";

interface InviteMomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InviteMomModal({ isOpen, onClose }: InviteMomModalProps) {
    const { userData } = useUserSession();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<"input" | "confirm" | "success">("input");

    const handleSend = async () => {
        setIsSubmitting(true);

        // Simulate Burn (Real burn would require wallet signature)
        // For MVP, we just open the email client

        const subject = encodeURIComponent("Welcome to MomCoin!");
        const body = encodeURIComponent("Hi Mom,\n\nI'm inviting you to join MomCoin! It's the crypto movement for moms.\n\nClaim your welcome gift here: https://momcoined.com");

        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

        // Show success UI
        setTimeout(() => {
            setStep("success");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0 }}
                className="bg-gray-900 border border-pink-500/30 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            >
                <div className="relative h-32 bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/mom-logo-1.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                    <div className="text-center z-10">
                        <h2 className="text-3xl font-black text-white drop-shadow-lg">Invite Mom</h2>
                        <p className="text-pink-100 font-medium">Send her a Digital Welcome Card</p>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">✕</button>
                </div>

                <div className="p-8 space-y-6">
                    {step === "input" && (
                        <>
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Mail className="w-8 h-8 text-pink-500" />
                                </div>
                                <p className="text-gray-300">
                                    Enter Mom's email address to send her a special NFT card and 1,000 $MomCoin.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">Mom's Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="mom@example.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-pink-500 outline-none transition-colors"
                                />
                            </div>
                            <Button
                                onClick={() => setStep("confirm")}
                                disabled={!email}
                                className="w-full py-4 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border-none"
                            >
                                Next
                            </Button>
                        </>
                    )}

                    {step === "confirm" && (
                        <>
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <Flame className="w-10 h-10 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Confirm Burn</h3>
                                <p className="text-gray-300">
                                    Sending this invite will burn <span className="text-pink-500 font-bold">1,000 $MomCoin</span> from your wallet.
                                </p>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Your Balance</span>
                                        <span className="text-white">{userData?.momBalance?.toLocaleString() ?? 0} MOM</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-gray-400">Cost</span>
                                        <span className="text-red-400">-1,000 MOM</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep("input")} className="flex-1">Back</Button>
                                <Button
                                    onClick={handleSend}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-red-600 hover:bg-red-500 border-none flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Burning..." : <>Confirm & Burn <Flame className="w-4 h-4" /></>}
                                </Button>
                            </div>
                        </>
                    )}

                    {step === "success" && (
                        <div className="text-center space-y-6 py-4">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <Send className="w-10 h-10 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Invite Sent!</h3>
                                <p className="text-gray-300">
                                    We've sent a Digital Welcome Card to <span className="text-pink-400">{email}</span>.
                                </p>
                            </div>
                            <Button onClick={onClose} className="w-full">Done</Button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
