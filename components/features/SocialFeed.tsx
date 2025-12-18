"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { MessageCircle, Twitter, RefreshCw } from "lucide-react";

interface Cast {
    hash: string;
    author: {
        username: string;
        pfp_url: string;
        display_name: string;
    };
    text: string;
    timestamp: string;
    reactions: {
        likes_count: number;
        recasts_count: number;
    };
}

export function SocialFeed() {
    const [activeTab, setActiveTab] = useState<"farcaster" | "twitter">("farcaster");
    const [casts, setCasts] = useState<Cast[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === "farcaster") {
            loadCasts();
        }
    }, [activeTab]);

    const loadCasts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/social/feed");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCasts(data);
            }
        } catch (e) {
            console.error("Feed error", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-sm h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Social Feed
                    {isLoading && <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />}
                </h3>
                <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab("farcaster")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTab === "farcaster"
                            ? "bg-purple-500 text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            Farcaster
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("twitter")}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${activeTab === "twitter"
                            ? "bg-blue-400 text-white"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        <div className="flex items-center gap-1">
                            <Twitter className="w-4 h-4" />
                            X (Twitter)
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {activeTab === "farcaster" ? (
                    <div className="space-y-4">
                        {casts.map((cast) => (
                            <div key={cast.hash} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={cast.author.pfp_url} alt={cast.author.username} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <div className="font-bold text-white text-sm">{cast.author.display_name}</div>
                                        <div className="text-xs text-gray-400">@{cast.author.username} • {new Date(cast.timestamp).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-3">{cast.text}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        ❤️ {cast.reactions.likes_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        🔁 {cast.reactions.recasts_count}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div className="text-center pt-4">
                            <a href="https://warpcast.com/~/channel/momcoin" target="_blank" className="text-purple-400 text-sm hover:underline">
                                View more on Warpcast
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar p-2">
                        {/* MomCoin Tweets */}
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="font-bold text-pink-400 mb-2">@momcoined</h4>
                            <a
                                className="twitter-timeline"
                                data-theme="dark"
                                data-height="400"
                                href="https://twitter.com/momcoined?ref_src=twsrc%5Etfw"
                            >
                                Tweets by MomCoin
                            </a>
                        </div>

                        {/* BlokMom Tweets */}
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="font-bold text-blue-400 mb-2">@blokmom</h4>
                            <a
                                className="twitter-timeline"
                                data-theme="dark"
                                data-height="400"
                                href="https://twitter.com/blokmom?ref_src=twsrc%5Etfw"
                            >
                                Tweets by BlokMom
                            </a>
                        </div>
                        <script async src="https://platform.twitter.com/widgets.js"></script>
                    </div>
                )}
            </div>
        </Card>
    );
}
