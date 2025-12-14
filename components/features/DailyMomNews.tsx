"use client";

import { Card } from "@/components/ui/Card";
import { Sparkles, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function DailyMomNews() {
    // Inject Twitter Script
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <Card className="p-6 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border-blue-500/20 overflow-hidden h-[500px]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    Daily Mom News
                </h3>
                <a
                    href="https://twitter.com/momcoined"
                    target="_blank"
                    className="text-xs text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    View on X <ArrowRight className="w-3 h-3" />
                </a>
            </div>

            <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/20">
                <a
                    className="twitter-timeline"
                    data-theme="dark"
                    data-height="400"
                    data-chrome="noheader nofooter noborders transparent"
                    href="https://twitter.com/momcoined?ref_src=twsrc%5Etfw"
                >
                    Tweets by momcoined
                </a>
            </div>
        </Card>
    );
}
