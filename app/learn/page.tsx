import { Metadata } from "next";
import { GraduationCap, BookOpen, BrainCircuit, Rocket } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
    title: "Learn Crypto | Coming Soon",
    description: "Mom teaches you crypto safely. No rugs, just hugs.",
};

export default function LearnPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-center space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span className="text-blue-200 font-bold text-sm uppercase tracking-wider">Mom's School</span>
            </div>

            <h1 className="text-5xl font-black text-white drop-shadow-xl">
                Coming Soon 📚
            </h1>

            <p className="text-xl text-gray-300">
                Mom is writing the curriculum. She's going to teach you how to set up a wallet, spot a rug pull, and trade like a hedge fund manager (without the stress).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                <Card className="p-6 bg-white/5 border-white/10 flex flex-col items-center gap-3">
                    <BookOpen className="w-8 h-8 text-pink-500" />
                    <span className="font-bold text-white">Basics 101</span>
                </Card>
                <Card className="p-6 bg-white/5 border-white/10 flex flex-col items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-purple-500" />
                    <span className="font-bold text-white">Agentic AI</span>
                </Card>
                <Card className="p-6 bg-white/5 border-white/10 flex flex-col items-center gap-3">
                    <Rocket className="w-8 h-8 text-yellow-500" />
                    <span className="font-bold text-white">DeFi Mastery</span>
                </Card>
            </div>
        </div>
    );
}
