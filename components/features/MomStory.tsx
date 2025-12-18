"use client";

import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { Heart, Twitter, Sparkles } from "lucide-react";

export function MomStory() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gradient-to-r from-pink-900/10 to-purple-900/10 rotate-12 blur-3xl rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-4 py-2 rounded-full">
                            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            <span className="text-pink-200 font-bold text-sm uppercase tracking-wider">The Lore</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-xl">
                            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">OG Mom</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Image / Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                            <Card className="relative p-0 overflow-hidden border-2 border-pink-500/20 bg-black/60 aspect-[3/4] md:aspect-square">
                                <img
                                    src="/mom-real.jpg" // Placeholder, user will need to add this
                                    alt="The Real Mom"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => e.currentTarget.src = "/mememom1.png"}
                                />
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-24 text-center">
                                    <p className="text-2xl font-black text-white uppercase italic">"Grandma Degen"</p>
                                    <p className="text-pink-400 font-mono text-xs">Est. 1958 • Crypto Native since 2022</p>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Story Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="space-y-6 text-lg text-purple-100 leading-relaxed font-medium">
                                <p>
                                    <span className="text-3xl font-bold text-pink-500 block mb-2">It started with a text.</span>
                                    Two years ago, <a href="https://x.com/wolffoftruth" target="_blank" className="text-blue-400 hover:underline font-bold">@wolffoftruth</a> told his grandma to download Coinbase. He thought she'd buy $20 of Bitcoin.
                                </p>
                                <p>
                                    <span className="text-white font-bold bg-pink-600/20 px-2 py-1 rounded">She didn't stop there.</span>
                                </p>
                                <p>
                                    From navigating DeFi to collecting NFTs, she became an instant crypto obsessive. She saw what the young generation was building and said:
                                    <br /><br />
                                    <span className="italic border-l-4 border-purple-500 pl-4 block">"You kids are onto something, but you need a Mom to make sure you're eating your vegetables and holding your bags."</span>
                                </p>
                                <p>
                                    She is the real deal. A grandma, a mother, and now, a crypto advocate for the next billion users.
                                </p>
                            </div>

                            {/* Social Proof */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <a
                                    href="https://x.com/wolffoftruth"
                                    target="_blank"
                                    className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 transition-all group"
                                >
                                    <div className="bg-blue-500 rounded-full p-1 group-hover:scale-110 transition-transform">
                                        <Twitter className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs uppercase opacity-70">The Son</div>
                                        <div className="font-bold">@wolffoftruth</div>
                                    </div>
                                </a>

                                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-300">
                                    <Sparkles className="w-6 h-6 animate-pulse" />
                                    <div className="text-left">
                                        <div className="text-xs uppercase opacity-70">Status</div>
                                        <div className="font-bold">Based Grandma</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
