"use client";

import { Card } from "@/components/ui/Card";
import { CreditCard } from "lucide-react";
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

export function BuyMomWidget() {
    const projectId = process.env.NEXT_PUBLIC_CDP_API_KEY;

    const handleBuy = () => {
        if (projectId) {
            const onrampUrl = getOnrampBuyUrl({
                projectId,
                assets: ['USDC', 'ETH'],
                network: 'base'
            } as any);
            window.open(onrampUrl, "_blank");
        } else {
            window.open("https://wallet.coinbase.com/", "_blank");
        }
    };

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/30 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-cyan-400" />
                        Buy Crypto with Card
                    </h3>
                    <p className="text-cyan-200 max-w-md">
                        New to crypto? Buy ETH or USDC directly with your credit card to get started.
                    </p>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={handleBuy}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                    >
                        <CreditCard className="w-5 h-5" />
                        Buy with Card
                    </button>
                </div>
            </div>
        </Card>
    );
}
