"use client";

import { Card } from "@/components/ui/Card";
import { Heart, TrendingUp } from "lucide-react";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { toast } from "react-hot-toast";

export function CharityJar() {
    const { updateUserScore } = useUserSession();

    const handleDonate = () => {
        // Mock donation for now
        toast.success("Thank you for your donation! +100 Points");
        updateUserScore("charity_donate", 100);
    };

    return (
        <Card className="p-6 border-2 border-pink-400 bg-pink-500/10">
            <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                <h2 className="text-xl font-bold text-pink-500">Mom's Charity Jar</h2>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Donated</span>
                    <span className="text-2xl font-bold text-white">$12,450</span>
                </div>

                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-pink-500 w-[45%]"></div>
                </div>

                <div className="text-sm text-gray-400">
                    <p>Causes supported:</p>
                    <ul className="list-disc list-inside mt-1 text-white">
                        <li>Empowering Women in Crypto</li>
                        <li>Homeless Shelters</li>
                        <li>Financial Literacy</li>
                    </ul>
                </div>

                <button
                    onClick={handleDonate}
                    className="w-full py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                    <Heart className="w-4 h-4" />
                    Donate $MOMCOIN
                </button>
                <div className="text-center text-xs text-pink-300 font-bold">
                    "Mom says: Sharing is caring! (+100 pts)"
                </div>
            </div>
        </Card>
    );
}
