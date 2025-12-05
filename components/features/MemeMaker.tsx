"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Copy, Share2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useUserSession } from "@/components/providers/UserSessionProvider";

export default function MemeMaker() {
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const { updateUserScore } = useUserSession();

    const generateCaption = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({
                    message: "Write a short, hilarious, viral meme caption about crypto moms, holding bags, or 'eating vegetables' while trading. Max 10 words."
                })
            });
            const data = await res.json();
            setCaption(data.response.replace(/"/g, ''));

            // Reward user
            updateUserScore("meme_gen", 10);
            toast.success("Meme generated! +10 Points");

        } catch (e) {
            toast.error("Mom is tired. Try again.");
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(caption + " $MOMCOIN #MomCoin");
        toast.success("Copied! Now go post it!");
    };

    return (
        <Card className="p-6 border-2 border-yellow-400 bg-yellow-400/10">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-xl font-bold text-yellow-400">Mom's Meme Maker</h2>
            </div>

            <div className="bg-black/40 p-6 rounded-xl min-h-[100px] flex items-center justify-center text-center mb-4 border border-white/10">
                {loading ? (
                    <span className="animate-pulse text-gray-400">Thinking of a banger...</span>
                ) : (
                    <p className="text-2xl font-impact text-white uppercase tracking-wide">
                        {caption || "CLICK GENERATE FOR GOLD"}
                    </p>
                )}
            </div>

            <div className="flex gap-2">
                <Button onClick={generateCaption} disabled={loading} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    {loading ? "Cooking..." : "Generate Caption"}
                </Button>
                {caption && (
                    <Button onClick={copyToClipboard} variant="secondary">
                        <Copy className="w-4 h-4" />
                    </Button>
                )}
            </div>
            <div className="mt-4 text-center text-xs text-yellow-600 font-bold">
                "Mom says: Make me famous! (+10 pts)"
            </div>
        </Card>
    );
}
