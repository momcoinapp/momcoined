import MomChat from "@/components/features/MomChat";
import { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Brain, TrendingUp, Shield } from "lucide-react";

export const metadata: Metadata = {
    title: "MomAI Agent 🤖",
    description: "Chat with MomAI, get trading advice, and see the roadmap.",
};

export default function MomAIPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                    MomAI Agent 🤖
                </h1>
                <p className="text-gray-300 text-lg">
                    The smartest Mom in the room. Powered by Gemini 2.0.
                </p>
            </div>

            <MomChat />

            {/* Roadmap / Features Teaser */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="p-6 bg-white/5 border-white/10">
                    <Brain className="w-8 h-8 text-pink-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Smart Trading</h3>
                    <p className="text-sm text-gray-400">
                        Mom analyzes market sentiment and on-chain data to give you "motherly advice" on your portfolio.
                    </p>
                </Card>
                <Card className="p-6 bg-white/5 border-white/10">
                    <TrendingUp className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Auto-Staking</h3>
                    <p className="text-sm text-gray-400">
                        (Coming Soon) Let Mom manage your yield farming. She knows how to save for a rainy day.
                    </p>
                </Card>
                <Card className="p-6 bg-white/5 border-white/10">
                    <Shield className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Rug Protection</h3>
                    <p className="text-sm text-gray-400">
                        Mom scans contracts for danger. She won't let you talk to strangers (bad tokens).
                    </p>
                </Card>
            </div>
        </div>
    );
}
