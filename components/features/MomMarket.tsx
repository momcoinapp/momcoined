import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { formatEther, parseEther } from "viem";

// Mock Data for Chart
const MOCK_HISTORY = [100, 102, 98, 105, 110, 108, 115, 120, 118, 125];

export function MomMarket() {
    const { address } = useAccount();
    const [betAmount, setBetAmount] = useState("100");
    const [timeLeft, setTimeLeft] = useState("07:59:59");
    const [currentPrice, setCurrentPrice] = useState(0.015); // Mock Clanker Price

    // Timer Logic (Mock)
    useEffect(() => {
        const timer = setInterval(() => {
            // Just a visual countdown for now
            const now = new Date();
            const hours = 7 - (now.getHours() % 8);
            const minutes = 59 - now.getMinutes();
            const seconds = 59 - now.getSeconds();
            setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleBet = (isUp: boolean) => {
        // TODO: Integrate with MomPrediction contract
        console.log(`Betting ${betAmount} MOM on ${isUp ? "UP" : "DOWN"}`);
    };

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
                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white p-4 rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-1"
                                >
                                    <TrendingUp className="w-8 h-8" />
                                    <span className="font-black text-xl">BET UP</span>
                                </button>
                                <button
                                    onClick={() => handleBet(false)}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white p-4 rounded-lg border-b-4 border-red-800 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center gap-1"
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
                                1 MOM = $0.01 USD (Est.)
                            </div>
                        </div>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-green-900/30 border border-green-500/30 p-2 rounded text-center">
                            <div className="text-xs text-green-400">UP POOL</div>
                            <div className="font-mono font-bold text-white">12,500 MOM</div>
                        </div>
                        <div className="bg-red-900/30 border border-red-500/30 p-2 rounded text-center">
                            <div className="text-xs text-red-400">DOWN POOL</div>
                            <div className="font-mono font-bold text-white">8,200 MOM</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
