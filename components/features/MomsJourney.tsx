"use client";

import { motion as motionOriginal, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/Card";

const motion = motionOriginal as any;

const milestones = [
    {
        year: "1958 - 2000s",
        title: "The Classic Cookie Jar",
        desc: "Mom hid her hard-earned cash in a porcelain cookie jar. Safe? Yes. Growing? Nope. Inflation ate those cookies like a midnight snack raid.",
        icon: "🍪"
    },
    {
        year: "Friday Nights",
        title: "Bingo with the Girls",
        desc: "Mom's true degen origin story. Dabbing cards, yelling 'BINGO!', and chasing jackpots with the ladies. She loved the thrill before she loved the charts.",
        icon: "🎰"
    },
    {
        year: "2022",
        title: "The Awakening",
        desc: "Son sends the text: 'Download Coinbase, Mom.' She buys $20 of Bitcoin. Then she sees what inflation did to her jar. The beast is woken.",
        icon: "⚡"
    },
    {
        year: "2024 - Present",
        title: "The Baseposting Era",
        desc: "Mom goes full degen. Posting on-chain, minting memories, and leading the 'Baseposting' movement. The Cookie Jar is now a portal to family prosperity.",
        icon: "🔵"
    },
    {
        year: "The Future",
        title: "Matriarch of the Metaverse",
        desc: "Every family has a Mom on-chain. Bringing trust back to finance, influencing positivity, and managing fortunes with love. The Cookie Jar is now a global movement.",
        icon: "🌍"
    }
];

export function MomsJourney() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef as any,
        offset: ["start end", "end start"]
    });

    return (
        <div ref={containerRef} className="relative py-20 px-4 max-w-5xl mx-auto overflow-hidden">

            {/* Central Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-pink-400/50 to-transparent" />

            <div className="text-center mb-20 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-sm">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Mom Journey</span>
                </h2>
                <p className="text-pink-100 text-xl font-medium max-w-2xl mx-auto">
                    From hiding cash in porcelain jars to minting NFTs on Base.
                </p>
            </div>

            <div className="space-y-16 md:space-y-32">
                {milestones.map((item, i) => (
                    <Milestone key={i} item={item} index={i} />
                ))}
            </div>

            <div className="mt-32 text-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block p-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 shadow-2xl"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-10 py-6">
                        <p className="text-white font-bold text-2xl">You are part of history. <br /><span className="text-pink-200">Mint your Mom.</span></p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

interface MilestoneItem {
    year: string;
    title: string;
    desc: string;
    icon: string;
}

function Milestone({ item, index }: { item: MilestoneItem, index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
        >
            {/* Mobile Alignment: Always left aligned timeline, but md is centered */}
            <div className={`ml-14 md:ml-0 flex-1 md:w-1/2 ${isEven ? "md:text-right" : "md:text-left"}`}>
                <div className="hidden md:block">
                    <span className="text-5xl font-black text-white/10 select-none">{item.year}</span>
                </div>
            </div>

            {/* Center Icon */}
            <div className="absolute left-[4px] md:left-1/2 md:-ml-8 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-white/20 flex items-center justify-center text-3xl shadow-lg z-20">
                {item.icon}
            </div>

            <Card className={`ml-14 md:ml-0 flex-1 md:w-1/2 p-8 bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ${!isEven ? "md:text-right" : ""}`}>
                <div className="md:hidden text-sm font-bold text-pink-400 mb-2 uppercase tracking-widest">{item.year}</div>
                <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                <p className="text-gray-200 leading-relaxed text-lg">{item.desc}</p>
            </Card>

        </motion.div>
    );
}
