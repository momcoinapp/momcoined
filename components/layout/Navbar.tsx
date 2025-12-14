"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, CheckSquare, MessageSquare, Menu, X, Sparkles, Heart, GraduationCap, Gift } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    ConnectWallet,
    WalletDropdown,
    WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet';
import {
    Identity,
    Avatar,
    Name,
    Address,
    EthBalance
} from '@coinbase/onchainkit/identity';

const NAV_ITEMS = [
    { label: "Earn", href: "/earn", icon: CheckSquare },
    { label: "NFTs", href: "/nfts", icon: Gift },
    { label: "Predict", href: "/predictions", icon: Sparkles },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Cast components to any to bypass TypeScript errors with React 18
    const WalletAny = Wallet as any;
    const ConnectWalletAny = ConnectWallet as any;
    const WalletDropdownAny = WalletDropdown as any;
    const WalletDropdownDisconnectAny = WalletDropdownDisconnect as any;
    const IdentityAny = Identity as any;
    const AvatarAny = Avatar as any;
    const NameAny = Name as any;
    const AddressAny = Address as any;
    const EthBalanceAny = EthBalance as any;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
                            M
                        </div>
                        <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                            MomCoin
                        </span>
                    </Link>



                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    target={(item as any).external ? "_blank" : undefined}
                                    rel={(item as any).external ? "noopener noreferrer" : undefined}
                                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? "text-pink-500" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* OnchainKit Wallet */}
                        <div className="flex items-center relative z-50">
                            <WalletAny>
                                <ConnectWalletAny className="bg-white text-black font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                                    <AvatarAny className="h-6 w-6" />
                                    <NameAny />
                                </ConnectWalletAny>
                                <WalletDropdownAny>
                                    <IdentityAny className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                        <AvatarAny />
                                        <NameAny />
                                        <AddressAny />
                                        <EthBalanceAny />
                                    </IdentityAny>
                                    <WalletDropdownDisconnectAny />
                                </WalletDropdownAny>
                            </WalletAny>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl"
                    >
                        <div className="p-4 space-y-2">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        target={(item as any).external ? "_blank" : undefined}
                                        rel={(item as any).external ? "noopener noreferrer" : undefined}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                                            ? "bg-pink-500/10 text-pink-500"
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile Wallet Connect */}
                        <div className="p-4 border-t border-white/10 flex justify-center">
                            <WalletAny>
                                <ConnectWalletAny className="w-full bg-white text-black font-bold px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2">
                                    <AvatarAny className="h-6 w-6" />
                                    <NameAny />
                                </ConnectWalletAny>
                                <WalletDropdownAny>
                                    <IdentityAny className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                        <AvatarAny />
                                        <NameAny />
                                        <AddressAny />
                                        <EthBalanceAny />
                                    </IdentityAny>
                                    <WalletDropdownDisconnectAny />
                                </WalletDropdownAny>
                            </WalletAny>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
