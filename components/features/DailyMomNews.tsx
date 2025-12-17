import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function DailyMomNews() {
    useEffect(() => {
        const twScript = document.createElement("script");
        twScript.src = "https://platform.twitter.com/widgets.js";
        twScript.async = true;
        document.body.appendChild(twScript);

        const ttScript = document.createElement("script");
        ttScript.src = "https://www.tiktok.com/embed.js";
        ttScript.async = true;
        document.body.appendChild(ttScript);

        return () => {
            if (document.body.contains(twScript)) {
                document.body.removeChild(twScript);
            }
            if (document.body.contains(ttScript)) {
                document.body.removeChild(ttScript);
            }
        };
    }, []);

    return (
        <Card className="bg-black/40 border-pink-500/20 backdrop-blur-xl p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    Mom News
                </h3>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-pink-500/30">
                {/* Official Update */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20">
                    <h3 className="font-bold text-white mb-2">🚀 MomCoin is LIVE on Base!</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                        <a href="https://app.momcoined.com/christmas" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            <span>Send free Christmas Cards 🎄</span>
                        </a>
                        <a href="https://warpcast.com/momcoined" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            <span>Follow us on Farcaster</span>
                        </a>
                        <a href="https://twitter.com/momcoined" className="flex items-center gap-2 hover:text-pink-400 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                            <span>Join the conversation on X</span>
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Twitter Feed */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Latest Tweets</h4>
                        <a className="twitter-timeline" data-theme="dark" data-chrome="noheader nofooter noborders transparent" href="https://twitter.com/momcoined?ref_src=twsrc%5Etfw">Tweets by momcoined</a>
                    </div>

                    {/* TikTok Feed */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-400 mb-2">Trending on TikTok</h4>
                        <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@momcoined" data-unique-id="momcoined" data-embed-type="creator" style={{ maxWidth: "100%", minWidth: "288px" }} >
                            <section> <a target="_blank" href="https://www.tiktok.com/@momcoined?refer=embed">@momcoined</a> </section>
                        </blockquote>
                    </div>
                </div>
            </div>
        </Card>
    );
}
