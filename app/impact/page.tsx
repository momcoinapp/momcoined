import { Metadata } from "next";
import { Heart, HandHeart, Home, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Mom's Mission | Fight Trafficking",
    description: "How MomCoin helps fight human trafficking and build homes for survivors.",
};

export default function ImpactPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full mb-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="text-pink-200 font-bold text-sm uppercase tracking-wider">Do Good</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl">
                    Fighting for Families
                </h1>
                <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                    Crypto isn't just about gains. It's about freedom. MomCoin uses fees to fund rescues and build tiny homes for trafficking survivors.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-pink-500/30 flex flex-col items-center text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-pink-400" />
                    <h2 className="text-2xl font-bold text-white">Rescue Operations</h2>
                    <p className="text-gray-300">
                        A portion of mint fees and Clanker trading volume goes directly to vetted organizations like Operation Underground Railroad (O.U.R.) to help recover potential victims.
                    </p>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 flex flex-col items-center text-center space-y-4">
                    <Home className="w-16 h-16 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Tiny Homes for Survivors</h2>
                    <p className="text-gray-300">
                        Survivors need safe housing to rebuild. We are funding the construction of sustainable tiny home communities for rescued moms and kids.
                    </p>
                </Card>
            </div>

            <Card className="p-8 bg-white/5 border-white/10 text-center space-y-6">
                <h3 className="text-2xl font-bold text-white">How You Help</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="text-3xl font-black text-pink-500 mb-2">1%</div>
                        <div className="text-sm text-gray-400">of Clanker Fees</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="text-3xl font-black text-purple-500 mb-2">10%</div>
                        <div className="text-sm text-gray-400">of NFT Mints</div>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl">
                        <div className="text-3xl font-black text-yellow-500 mb-2">100%</div>
                        <div className="text-sm text-gray-400">of Direct Donations</div>
                    </div>
                </div>
                <Button className="w-full md:w-auto bg-white text-black hover:bg-gray-200 mt-4">
                    Donate Directly (Coming Soon)
                </Button>
            </Card>

            <div className="text-center pt-8 border-t border-white/10">
                <p className="text-gray-400 italic">
                    "Every blockchain needs a Mom. Every survivor needs a home."
                </p>
            </div>
        </div>
    );
}
