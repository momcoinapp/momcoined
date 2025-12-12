"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import Confetti from "react-confetti";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CookieJarSlider() {
    const [filled, setFilled] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const controls = useAnimation();

    // Transform x value to progress (0-100)
    const progress = useTransform(x, [0, 250], [0, 100]);
    const opacity = useTransform(x, [0, 250], [1, 0]);
    const fillOpacity = useTransform(x, [0, 250], [0.3, 1]);
    const rotate = useTransform(x, [0, 250], [0, 360]);

    const handleDragEnd = async () => {
        if (x.get() > 200) {
            setFilled(true);
            setShowConfetti(true);
            controls.start({ x: 250 });
            setTimeout(() => setShowConfetti(false), 5000);
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 relative">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl overflow-hidden relative">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">Fill Mom's Jar 🍪</h3>
                    <p className="text-pink-200 text-sm">Drag the cookie to fill the jar and mint!</p>
                </div>

                {/* Jar Visual */}
                <div className="relative w-40 h-52 mx-auto mb-8 border-4 border-white/30 rounded-full rounded-t-none border-t-0 bg-white/5 overflow-hidden">
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 to-purple-600"
                        style={{ height: useTransform(progress, (p) => `${p}%`), opacity: fillOpacity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-4xl filter drop-shadow-md">🫙</span>
                    </div>
                </div>

                {/* Slider Track */}
                <div className="relative h-16 bg-black/20 rounded-full border border-white/10 flex items-center px-2" ref={constraintsRef}>
                    <motion.div style={{ opacity }} className="absolute left-16 text-white/50 text-sm font-bold uppercase tracking-widest pointer-events-none">
                        Slide to Fill &gt;&gt;&gt;
                    </motion.div>

                    {/* Draggable Cookie */}
                    <motion.div
                        drag="x"
                        dragConstraints={constraintsRef}
                        dragElastic={0}
                        dragMomentum={false}
                        onDragEnd={handleDragEnd}
                        animate={controls}
                        style={{ x, rotate }}
                        className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
                    >
                        <Cookie className="text-amber-900 w-6 h-6" />
                    </motion.div>
                </div>

                {filled && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 p-6 text-center"
                    >
                        <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-4">
                            JAR FILLED! 🎉
                        </h4>
                        <p className="text-white mb-6">Mom is proud! Ready to mint your earnings?</p>
                        <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 border-none shadow-lg shadow-pink-500/20">
                            Mint Rewards Now
                        </Button>
                        <button
                            onClick={() => {
                                setFilled(false);
                                controls.start({ x: 0 });
                            }}
                            className="mt-4 text-sm text-gray-400 hover:text-white"
                        >
                            Reset
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
