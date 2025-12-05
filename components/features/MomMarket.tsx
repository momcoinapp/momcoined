import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";
import { CONTRACT_ADDRESSES, MOM_PREDICTION_ABI } from "@/lib/contracts";
import { useUserSession } from "@/components/providers/UserSessionProvider";
import { toast } from "react-hot-toast";

// Mock Data for Chart
const MOCK_HISTORY = [100, 102, 98, 105, 110, 108, 115, 120, 118, 125];

export function MomMarket() {
    const { address } = useAccount();
    const { updateUserScore } = useUserSession();
    const [betAmount, setBetAmount] = useState("100");
    const [timeLeft, setTimeLeft] = useState("Loading...");
    const [currentPrice, setCurrentPrice] = useState(0.00);

    // Fetch Live Price from DexScreener
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                // Clanker Pair Address
                const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/base/0x2177bCAC5c26507bfb4F0FF2cCbd255AE4BEDb07");
                const data = await res.json();
                if (data.pair && data.pair.priceUsd) {
                    setCurrentPrice(parseFloat(data.pair.priceUsd));
                }
            } catch (error) {
                console.error("Failed to fetch price", error);
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, []);

    // 1. Get Current Round ID
    const { data: currentRoundId } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_PREDICTION,
        abi: MOM_PREDICTION_ABI,
        functionName: "currentRoundId",
    });

    // 2. Get Round Data
    const { data: roundData } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_PREDICTION,
        abi: MOM_PREDICTION_ABI,
        functionName: "rounds",
        args: currentRoundId ? [currentRoundId] : undefined,
        query: {
            enabled: !!currentRoundId,
        }
    });

    const { writeContract, isPending } = useWriteContract();

    // Timer Logic
    useEffect(() => {
        if (!roundData) return;
        const [id, startTime, lockPrice, closePrice, totalAmount, upAmount, downAmount, resolved, cancelled] = roundData as any; // Cast to any to avoid strict tuple issues for now, or define type

        const roundDuration = 8 * 60 * 60 * 1000; // 8 hours in ms
        const endTime = Number(startTime) * 1000 + roundDuration;

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("Round Ended");
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [roundData]);

    const handleBet = (isUp: boolean) => {
        if (!betAmount) return;
        try {
            writeContract({
                address: CONTRACT_ADDRESSES.MOM_PREDICTION,
                abi: MOM_PREDICTION_ABI,
                functionName: "placeBet",
                args: [isUp, parseEther(betAmount)],
            }, {
                onSuccess: () => {
                    toast.success("Bet placed! +50 Points");
                    updateUserScore("prediction_bet", 50);
                },
                onError: (error) => {
                    console.error("Bet error:", error);
                    toast.error("Bet failed");
                }
            });
        } catch (error) {
            console.error("Bet error:", error);
        }
    };

    // Parse Round Data for UI
    const upPool = roundData ? formatEther((roundData as any)[5]) : "0";
    const downPool = roundData ? formatEther((roundData as any)[6]) : "0";

    return (
        <div className="space-y-6">
            {/* Header / Ticker */}
            <div className="flex items-center justify-between bg-black border-2 border-green-500 p-4 rounded-lg font-mono text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 animate-pulse" />
                    <span className="text-xl font-bold tracking-wider">MOM MARKET</span>
                </div>
                <div className="text-right">
                    <div className="text-sm opacity-70">CLANKER PRICE</div>
                    <div className="text-2xl font-bold">${currentPrice.toFixed(4)}</div>
                </div>
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart Area */}
                <Card className="bg-gray-900 border-2 border-purple-500 p-4 min-h-[300px] relative overflow-hidden">
                    <div className="absolute top-2 left-2 text-purple-400 font-mono text-xs">LIVE CHART (8H)</div>

                    {/* Retro Grid Background */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    {/* Simple CSS Chart Visualization */}
                    <div className="absolute bottom-0 left-0 right-0 h-3/4 flex items-end justify-between px-4 pb-4 gap-2">
                        {MOCK_HISTORY.map((val, i) => (
                            <div key={i}
                                className={`w-full rounded-t-sm ${i === MOCK_HISTORY.length - 1 ? 'bg-green-500 animate-pulse' : 'bg-purple-500/50'}`}
                                style={{ height: `${(val / 150) * 100}%` }}
                            />
                        ))}
                    </div>
                </Card>

                {/* Betting Controls */}
                <div className="space-y-4">
                    <Card className="bg-gray-900 border-2 border-blue-500 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Clock className="w-5 h-5" />
                                <span className="font-mono text-xl">{timeLeft}</span>
                            </div>
                            <div className="text-xs text-gray-400 uppercase tracking-widest">Round Ends In</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBet(true)}
                                    disabled={isPending}
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white p-4 rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-1 disabled:opacity-50"
                                >
                                    <TrendingUp className="w-8 h-8" />
                                    <span className="font-black text-xl">BET UP</span>
                                </button>
                                <button
                                    onClick={() => handleBet(false)}
                                    disabled={isPending}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white p-4 rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-1 disabled:opacity-50"
                                >
                                    <TrendingDown className="w-8 h-8" />
                                    <span className="font-black text-xl">BET DOWN</span>
                                </button>
                            </div>

                            <div className="bg-black/50 p-3 rounded border border-gray-700 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-yellow-500" />
                                <input
                                    type="number"
                                    value={betAmount}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    className="bg-transparent w-full text-white font-mono outline-none"
                                    placeholder="Amount to Bet"
                                />
                                <span className="text-gray-500 font-bold">MOM</span>
                            </div>

                            <div className="text-center text-xs text-gray-500">
                                1 $MOMCOIN = $0.01 USD (Est.)
                            </div>
                            <div className="text-center text-xs text-pink-400 font-bold animate-pulse">
                                "Mom says: Don't bet the house, sweetie! (+50 pts)"
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-900/30 border border-green-500/30 p-2 rounded text-center">
                            <div className="text-xs text-green-400">UP POOL</div>
                            <div className="font-mono font-bold text-white">{Number(upPool).toFixed(2)} MOM</div>
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 p-2 rounded text-center">
                            <div className="text-xs text-red-400">DOWN POOL</div>
                            <div className="font-mono font-bold text-white">{Number(downPool).toFixed(2)} MOM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
