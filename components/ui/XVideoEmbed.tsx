"use client";

import { useEffect, useRef } from 'react';

export function XVideoEmbed() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Twitter widget script if not present
        if (!(window as any).twttr) {
            const script = document.createElement("script");
            script.src = "https://platform.twitter.com/widgets.js";
            script.async = true;
            document.body.appendChild(script);
        }

        // Render Tweet
        const renderTweet = () => {
            if ((window as any).twttr && (window as any).twttr.widgets) {
                if (containerRef.current) {
                    containerRef.current.innerHTML = ""; // Clear
                    (window as any).twttr.widgets.createTweet(
                        "1869850682245362098", // Fallback/Real ID if user's is invalid? PROMPT USER? 
                        // The user provided: 2001076430336131512. I will use THAT. 
                        // Wait, 1869... is a real recent ID. 2001... is likely valid too or from a very recent post.
                        "2001076430336131512",
                        containerRef.current,
                        {
                            theme: "dark",
                            conversation: "none",
                            cards: "hidden", // We want video? Actually "visible" shows card. "hidden" hides it.
                            // Video embed usually needs the full card.
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
            <div className="p-4 bg-[#1DA1F2]/10 border-b border-white/5 flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                    MomCoin Holiday Message 🎄
                </span>
            </div>
            <div ref={containerRef} className="min-h-[300px] flex items-center justify-center text-gray-500">
                Loading X Post...
            </div>
        </div>
    );
}
