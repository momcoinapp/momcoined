"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "mom";
    text: string;
}

import { useUserSession } from "@/components/providers/UserSessionProvider";

export default function MomChat() {
    const { userData } = useUserSession();
    const [messages, setMessages] = useState<Message[]>([
        { role: "mom", text: "Hello sweetie! Have you claimed your $MOMCOIN today? 🍪 Also, don't forget to invite your REAL mom for a special reward! And check out the new NFT mint - it's like a digital family album!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    walletAddress: userData?.walletAddress
                }),
            });
            const data = await res.json();

            if (data.response) {
                setMessages(prev => [...prev, { role: "mom", text: data.response }]);
            } else {
                setMessages(prev => [...prev, { role: "mom", text: "Oh dear, I didn't quite catch that." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: "mom", text: "Mom needs a nap. Try again later!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-[500px] flex flex-col relative overflow-hidden border-2 border-pink-500/30">
            {/* Header with Animated Avatar */}
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-white/5">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-pink-500 rounded-full animate-pulse opacity-50"></div>
                    <img
                        src="/mom-avatar.png"
                        alt="MomAI"
                        className="w-12 h-12 rounded-full border-2 border-pink-400 relative z-10 object-cover"
                        onError={(e) => e.currentTarget.src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Mom&clothing=blazerAndShirt&top=longHairBigHair"}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black z-20"></div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-pink-400">Ask MomAI</h2>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online & Judging You
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pink-500/20">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user"
                                    ? "bg-pink-600 text-white rounded-tr-none"
                                    : "bg-white/10 text-gray-200 rounded-tl-none border border-white/10"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-100" />
                                <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask Mom for advice..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-pink-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-2 bg-pink-600 rounded-xl text-white hover:bg-pink-700 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </Card>
    );
}
