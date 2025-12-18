"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import Confetti from "react-confetti";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWriteContract, useAccount, useConnect, useReadContract } from "wagmi";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI, MOM_HELPER_ABI } from "@/lib/contracts";
import { toast } from "react-hot-toast";
import { parseEther } from "viem";

export function CookieJarSlider() {
    const [filled, setFilled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Blockchain Hooks
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { writeContractAsync } = useWriteContract();

    // Check if user already owns a jar
    const { data: balance } = useReadContract({
        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
        abi: MOM_COOKIE_JAR_ABI,
        functionName: "balanceOf",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    const hasJar = balance && Number(balance) > 0;

    // Transform x value to progress (0-100)
    const progress = useTransform(x, [0, 250], [0, 100]);
    const opacity = useTransform(x, [0, 250], [1, 0]);
    const fillOpacity = useTransform(x, [0, 250], [0.3, 1]);
    const rotate = useTransform(x, [0, 250], [0, 360]);

    const handleDragEnd = async () => {
        if (x.get() > 200) {
            // Check Connection
            if (!isConnected) {
                toast.error("Connect wallet to start!");
                const coinbaseConnector = connectors.find((c) => c.id === "coinbaseWalletSDK") || connectors[0];
                if (coinbaseConnector) connect({ connector: coinbaseConnector });
                controls.start({ x: 0 });
                return;
            }

            try {
                // UI Feedback
                setFilled(true);
                setShowConfetti(true);
                controls.start({ x: 250 });

                if (hasJar) {
                    // DAILY CLAIM
                    toast.loading("Collecting daily cookies...", { id: "tx-toast" }); // Keep ID consistent to replace it
                    await writeContractAsync({
                        address: CONTRACT_ADDRESSES.MOM_HELPER,
                        abi: MOM_HELPER_ABI,
                        functionName: "claimDaily",
                        args: [],
                    });
                    toast.success("Daily Cookies Claimed! 🍪", { id: "tx-toast" });

                } else {
                    // MINT JAR
                    toast.loading("Minting Mom's Cookie Jar...", { id: "tx-toast" });
                    await writeContractAsync({
                        address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR,
                        abi: MOM_COOKIE_JAR_ABI,
                        functionName: "mintJarETH",
                        value: parseEther("0.0004"), // Approx $1
                        args: [],
                    });
                    toast.success("Welcome to the family! Jar Minted.", { id: "tx-toast" });
                }

                setTimeout(() => setShowConfetti(false), 5000);
            } catch (error: any) {
                console.error(error);
                // Better error handling
                if (error.message?.includes("User denied")) {
                    toast.error("Transaction cancelled", { id: "tx-toast" });
                } else if (error.message?.includes("already claimed")) {
                    toast.error("Already claimed today! Come back tomorrow.", { id: "tx-toast" });
                } else {
                    toast.error("Transaction failed: " + (error.shortMessage || error.message), { id: "tx-toast" });
                }
                controls.start({ x: 0 });
                setFilled(false);
            }
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 relative">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative transition-all duration-300 hover:bg-white/15">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                        {hasJar ? "Daily Cookie Claim 🍪" : "Get Mom's Cookie Jar 🍪"}
                    </h3>
                    <p className="text-pink-200 text-sm">
                        {hasJar ? "Drag to collect your daily free cookies!" : "Drag to mint your jar ($1) & start earning!"}
                    </p>
                </div>

                {/* Jar Visual */}
                <div className="relative w-40 h-52 mx-auto mb-8 border-4 border-white/30 rounded-full rounded-t-none border-t-0 bg-white/5 overflow-hidden shadow-inner">
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-purple-600"
                        style={{ height: useTransform(progress, (p) => `${p}%`), opacity: fillOpacity }}
                    />

                    {/* Falling Cookies */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-2xl"
                                style={{
                                    left: `${Math.random() * 80 + 10}%`,
                                    top: useTransform(progress, (p) => `${100 - (p * (0.8 + Math.random() * 0.2))}%`), // Cookies rise/stack
                                    rotate: useTransform(progress, [0, 100], [0, Math.random() * 360])
                                }}
                            >
                                🍪
                            </motion.div>
                        ))}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-5xl filter drop-shadow-md opacity-20 transform scale-125">🫙</span>
                    </div>
                </div>

                {/* Slider Track */}
                {!filled && (
                    <div className="relative h-16 bg-black/40 rounded-full border border-white/10 flex items-center px-2 cursor-pointer group" ref={constraintsRef}>
                        <motion.div style={{ opacity }} className="absolute left-16 text-white/50 text-sm font-bold uppercase tracking-widest pointer-events-none group-hover:text-white/80 transition-colors">
                            Slide to {hasJar ? "Claim" : "Mint"} &gt;&gt;&gt;
                        </motion.div>

                        {/* Draggable Cookie */}
                        <motion.div
                            drag="x"
                            dragConstraints={constraintsRef}
                            dragElastic={0.1}
                            dragMomentum={false}
                            onDragEnd={handleDragEnd}
                            animate={controls}
                            style={{ x, rotate }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 border-2 border-white/10"
                        >
                            <Cookie className="text-white w-6 h-6" />
                        </motion.div>
                    </div>
                )}

                {filled && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20 p-6 text-center rounded-3xl"
                    >
                        <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
                            {hasJar ? "YUMMY! 🍪" : "WELCOME! 🎉"}
                        </h4>
                        <p className="text-white mb-6">
                            {hasJar ? "Fresh cookies collected. Mom loves you!" : "Jar Minted! Now you can claim daily cookies."}
                        </p>
                        <div className="flex gap-2 w-full flex-col">
                            <Button
                                onClick={() => window.location.href = '/earn'}
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 border-none shadow-lg shadow-pink-500/20 py-4 text-lg"
                            >
                                View Dashboard
                            </Button>
                            <button
                                onClick={() => {
                                    setFilled(false);
                                    controls.start({ x: 0 });
                                }}
                                className="mt-4 text-sm text-gray-400 hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
