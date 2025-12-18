'use client';

import { useState, useEffect } from 'react';
import { getMomAdvice, generateMomQuote } from '@/lib/gemini';
import { useAccount } from 'wagmi';
import { useUserSession } from '@/components/providers/UserSessionProvider';

// Mock functions for data fetching - replace with real implementations later
async function fetchStakeInfo(address: string | undefined) {
    // TODO: Fetch from smart contract
    return {
        amount: 1000,
        riskLevel: 'Medium',
        portfolio: [{ symbol: 'MOM', amount: 1000 }, { symbol: 'ETH', amount: 0.5 }]
    };
}

async function fetchMarketData() {
    // TODO: Fetch from CoinGecko or similar
    return {
        trend: 'bullish',
        btcPrice: 65000,
        momPrice: 0.05
    };
}

export default function MomAIDashboard() {
    const { address } = useAccount();
    const { updateUserScore } = useUserSession();

    const [advice, setAdvice] = useState<any>(null);
    const [quote, setQuote] = useState<string>('');
    const [loading, setLoading] = useState(false);

    async function getAdvice() {
        setLoading(true);
        try {
            // Get user's stake info from contract
            const stakeInfo = await fetchStakeInfo(address);

            // Get current market data
            const marketData = await fetchMarketData();

            // Get Gemini AI advice
            const aiAdvice = await getMomAdvice({
                stakedAmount: stakeInfo.amount,
                riskLevel: stakeInfo.riskLevel,
                currentPortfolio: stakeInfo.portfolio,
                marketConditions: marketData
            });

            setAdvice(aiAdvice);

            // Update Firestore with AI interaction (+2 points)
            await updateUserScore('ai_usage', 2);

        } catch (error) {
            console.error('AI Error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Generate daily mom quote
        generateMomQuote('crypto trading').then(setQuote);
    }, []);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                    🤖 MOM AI Trading Agent
                </h2>
                <p className="text-lg italic text-gray-600 dark:text-gray-300">"{quote}"</p>
            </div>

            {advice && (
                <div className="bg-white/10 rounded-lg p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                        <h3 className="font-bold text-xl text-pink-500">Mom's Advice:</h3>
                        <p className="text-gray-800 dark:text-gray-200">{advice.advice}</p>

                        <div className="text-sm italic text-gray-500">
                            "{advice.momQuote}"
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <strong>Recommended Action:</strong>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${advice.action === 'buy' ? 'bg-green-500/20 text-green-500' :
                                advice.action === 'sell' ? 'bg-red-500/20 text-red-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {advice.action?.toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <label>Risk Level</label>
                                <span>{advice.riskScore}/10</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${advice.riskScore > 7 ? 'bg-red-500' :
                                        advice.riskScore > 4 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}
                                    style={{ width: `${advice.riskScore * 10}%` }}
                                />
                            </div>
                        </div>

                        <div className="text-sm text-gray-400 mt-2">
                            <p>{advice.reasoning}</p>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={getAdvice}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Asking Mom...
                    </>
                ) : (
                    '🔮 Get Mom\'s Advice'
                )}
            </button>
        </div>
    );
}
