import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Gift, Snowflake, Share2, ChevronRight, ChevronLeft, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Metadata } from "next";

// Frame Metadata for Farcaster
export const metadata: Metadata = {
    title: "MomCoin Christmas Cards",
    description: "Mint your 2024 MomCoin Christmas Card. Holders Only!",
    openGraph: {
        title: "MomCoin Christmas Cards",
        description: "Official 10-Card Set. Mint now on Base.",
        images: ["https://app.momcoined.com/christmas-preview.png"],
    },
    other: {
        "fc:frame": "vNext",
        "fc:frame:image": "https://app.momcoined.com/christmas-preview.png",
        "fc:frame:button:1": "Mint Random Card",
        "fc:frame:action": "tx",
        "fc:frame:target": "https://app.momcoined.com/api/frame/mint-christmas",
    }
};

const CARDS = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Card #${i + 1}: ${["Santa Mom", "HODL Rudolph", "Frosty the Trader", "Mistletoe Dip", "Gingerbread Gains", "North Pole Node", "Elf on the Blockchain", "Silent Night, Green Light", "Jingle Bell Rock (Bottom)", "New Year, New ATH"][i]}`,
    desc: "Limited Edition 2024 Series"
}));

export default function InviteMomPage() {
    const [currentCard, setCurrentCard] = useState(0);

    const nextCard = () => setCurrentCard((prev) => (prev + 1) % CARDS.length);
    const prevCard = () => setCurrentCard((prev) => (prev - 1 + CARDS.length) % CARDS.length);

    const handleMint = () => {
        toast.success(`Minting ${CARDS[currentCard].title}... (Simulated)`);
        // In real app: writeContract logic here calling MomChristmasCards.mint(id)
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Christmas Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 text-pink-500/20 animate-pulse delay-700"><Snowflake className="w-12 h-12" /></div>
                <div className="absolute top-40 right-20 text-purple-500/20 animate-pulse delay-100"><Snowflake className="w-8 h-8" /></div>
            </div>

            <div className="text-center mb-8 space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500 drop-shadow-sm font-serif">
                    MomCoin Holiday Collection
                </h1>
                <p className="text-purple-200">
                    Hold $MomCoin to Mint. Collect all 10.
                </p>
            </div>

            <div className="relative w-full max-w-sm aspect-[3/4]">
                {/* Carousel Controls */}
                <button onClick={prevCard} className="absolute left-[-50px] top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <button onClick={nextCard} className="absolute right-[-50px] top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <ChevronRight className="w-8 h-8" />
                </button>

                <Card className="w-full h-full bg-gradient-to-b from-[#1a0b16] to-[#0d050a] border-2 border-red-500/30 p-6 flex flex-col items-center justify-between text-center relative overflow-hidden group">
                    {/* Digital Card Art Placeholder */}
                    <div className="w-full flex-1 bg-black/50 rounded-xl mb-4 flex items-center justify-center border border-white/10 relative">
                        <Gift className="w-20 h-20 text-red-500 opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-9xl opacity-10 select-none">
                            {CARDS[currentCard].id}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">{CARDS[currentCard].title}</h3>
                        <p className="text-xs text-gray-400">{CARDS[currentCard].desc}</p>
                    </div>

                    <Button
                        onClick={handleMint}
                        className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 transition-all font-bold"
                    >
                        Mint for FREE
                    </Button>
                </Card>
            </div>

            <div className="mt-12 flex gap-4">
                <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5"
                    onClick={() => {
                        const text = encodeURIComponent("I just minted my MomCoin Christmas Card! 🎄🍪\n\nClaim yours for FREE:\n");
                        const url = encodeURIComponent(window.location.href);
                        window.open(`https://warpcast.com/~/compose?text=${text}&embeds[]=${url}`, "_blank");
                    }}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Frame
                </Button>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                    <Wallet className="w-4 h-4 mr-2" />
                    Check Eligibility
                </Button>
            </div>
        </div>
    );
}
