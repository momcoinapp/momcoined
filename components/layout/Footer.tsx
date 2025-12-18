"use client";

import { Twitter, MessageCircle, ExternalLink } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 backdrop-blur-md mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            M
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                            MomCoin
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://x.com/blokmom"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                        >
                            <Twitter className="w-5 h-5" />
                            <span className="hidden md:inline">@blokmom</span>
                        </a>
                        <a
                            href="https://x.com/momcoined"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                        >
                            <Twitter className="w-5 h-5" />
                            <span className="hidden md:inline">@momcoined</span>
                        </a>
                        <a
                            href="https://warpcast.com/momcoin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-purple-500 transition-colors flex items-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="hidden md:inline">/momcoin</span>
                        </a>
                        <a
                            href="https://www.tiktok.com/@momcoined"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="hidden md:inline">TikTok</span>
                        </a>
                        <a
                            href="https://t.me/momcoined"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="hidden md:inline">Telegram</span>
                        </a>
                    </div>

                    <div className="text-sm text-gray-500">
                        © 2024 MomCoin. Made with ❤️ for Moms.
                    </div>
                </div>
            </div>
        </footer>
    );
}
