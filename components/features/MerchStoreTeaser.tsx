import { Card } from "@/components/ui/Card";
import { ShoppingBag, Lock } from "lucide-react";

export function MerchStoreTeaser() {
    return (
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3" />
                COMING SOON
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white/10 p-4 rounded-full">
                    <ShoppingBag className="w-12 h-12 text-pink-500" />
                </div>

                <div>
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        Mom's Merch Store
                    </h3>
                    <p className="text-gray-500 mt-2">
                        Get ready to rock the official MomCoin look!
                        <br />
                        <span className="text-sm italic">T-Shirts, Mugs, and Aprons dropping soon.</span>
                    </p>
                </div>

                <div className="w-full max-w-xs bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 backdrop-blur-sm">
                    <div className="aspect-square bg-gray-700/50 rounded flex items-center justify-center mb-2">
                        <span className="text-4xl">👕</span>
                    </div>
                    <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2 mx-auto"></div>
                </div>

                <button disabled className="px-6 py-2 bg-gray-700 text-gray-400 rounded-full cursor-not-allowed font-medium">
                    Notify Me When Live
                </button>
            </div>
        </Card>
    );
}
