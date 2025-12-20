"use client";

import { useEffect, useRef } from 'react';

export function XVideoEmbed() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Twitter widget script
        if (!(window as any).twttr) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
        }

        const renderTweet = () => {
            if ((window as any).twttr && (window as any).twttr.widgets) {
                if (containerRef.current) {
                    containerRef.current.innerHTML = "";
                    (window as any).twttr.widgets.createTweet(
                        "1869850682245362098", // MomCoin holiday video tweet
                        containerRef.current,
                        {
                            theme: "dark",
                            conversation: "none",
                        }
                    );
                }
            } else {
                setTimeout(renderTweet, 500);
            }
        };

        renderTweet();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto bg-black rounded-2xl overflow-hidden border border-white/10 shadow-xl">
            <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-white/5 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                <span className="font-bold text-white">Watch Our Story 🎄</span>
            </div>
            <div ref={containerRef} className="min-h-[300px] flex items-center justify-center text-gray-500">
                Loading...
            </div>
            <div className="p-3 border-t border-white/5 flex gap-2 justify-center">
                <a href="https://x.com/momcoined" target="_blank" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/70 hover:text-white transition">
                    Follow @momcoined
                </a>
                <a href="https://warpcast.com/momcoined" target="_blank" className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 rounded-full text-sm text-purple-300 hover:text-purple-200 transition">
                    On Farcaster
                </a>
            </div>
        </div>
    );
}
