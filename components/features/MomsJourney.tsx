"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/Card";

const milestones = [
    {
        year: "1958",
        title: "The Original Cookie Jar",
        desc: "Mom locked her savings in a porcelain jar. It was safe, but it didn't grow. The cookies got stale.",
        icon: "🍪"
    },
    {
        year: "2009",
        title: "The Bitcoin Confusion",
        desc: "Mom heard about 'internet money' but thought it was for hackers. She stuck to the jar.",
        icon: "❓"
    },
    {
        year: "2024",
        title: "The Great Awakening",
        desc: "Mom realizes inflation is eating her cookies. She demands a wallet. She demands YIELD.",
        icon: "🚀"
    },
    {
        year: "Future",
        title: "Matriarch of the Metaverse",
        desc: "Every Mom on-chain. Managing family fortunes with AI. The Cookie Jar is now a Vault.",
        icon: "👑"
    }
];

export function MomsJourney() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <div ref={containerRef} className="relative py-20 px-4 max-w-4xl mx-auto overflow-hidden">

            {/* Central Line */}
            <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-pink-500 to-transparent opacity-30" />

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">The Mom Journey</h2>
                <p className="text-pink-200 text-lg">From Porcelain Jars into the Blockchain.</p>
            </div>

            <div className="space-y-12 md:space-y-24">
                {milestones.map((item, i) => (
                    <Milestone key={i} item={item} index={i} />
                ))}
            </div>

            <div className="mt-24 text-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block p-1 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600"
                >
                    <div className="bg-black rounded-xl px-8 py-4">
                        <p className="text-white font-bold text-xl">You are part of history. Mint your Mom.</p>
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
            <div className="ml-12 md:ml-0 flex-1 md:w-1/2 md:text-right">
                <div className={`hidden md:block ${isEven ? "text-right" : "text-left"}`}>
                    <span className="text-6xl font-black text-white/5">{item.year}</span>
                </div>
            </div>

            {/* Center Icon */}
            <div className="absolute left-[4px] md:left-1/2 md:-ml-8 w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 border-4 border-black flex items-center justify-center text-3xl shadow-xl z-20">
                {item.icon}
            </div>

            <Card className={`ml-12 md:ml-0 flex-1 md:w-1/2 p-6 bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors ${!isEven ? "md:text-right" : ""}`}>
                <div className="md:hidden text-sm font-bold text-pink-500 mb-1">{item.year}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
            </Card>

        </motion.div>
    );
}
