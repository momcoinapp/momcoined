import { Card } from "@/components/ui/Card";
import { CreditCard } from "lucide-react";

// Note: In a real implementation, we would use the OnchainKit Buy component.
// Since we are in a dev environment without the full OnchainKit setup verified,
// we will create a placeholder that links to the Coinbase Onramp or simulates the flow.
// For production, you would uncomment the import and usage below.

// import { Buy } from '@coinbase/onchainkit/buy';

export function BuyMomWidget() {
    const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

    const handleBuy = () => {
        // For now, we can link to a DEX or open the Coinbase Wallet buy flow
        window.open("https://wallet.coinbase.com/", "_blank");
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

                {/* 
                  TODO: Uncomment this when ready to test with live Project ID
                  <Buy 
                    projectId={projectId} 
                    defaultAsset="USDC" 
                    defaultNetwork="base" 
                    defaultPaymentMethod="CARD" 
                  /> 
                */}

                <button
                    onClick={handleBuy}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <CreditCard className="w-5 h-5" />
                    Buy with Card
                </button>
            </div>
        </Card>
    );
}
