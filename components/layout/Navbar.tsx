"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, CheckSquare, Sparkles, Gift, User, Coins } from "lucide-react";
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
    { label: "Home", href: "/", icon: Home },
    { label: "Earn", href: "/earn", icon: CheckSquare },
    { label: "NFTs", href: "/cookiejar", icon: Gift },
    { label: "Stats", href: "/tokenomics", icon: Coins }, // Replaced Predict with Tokenomics
    { label: "Profile", href: "/profile", icon: User },
];

export function Navbar() {
    const pathname = usePathname();

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
        <>
            {/* Desktop Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/80 backdrop-blur-xl border-b border-white/10 h-16">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-md">
                            M
                        </div>
                        <span className="font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 tracking-tight">
                            MomCoin
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_ITEMS.map((item) => {
                            if (item.label === "Home") return null; // Skip Home in desktop menu (logo does it)
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 text-sm font-bold transition-all hover:scale-105 ${isActive ? "text-pink-400" : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Wallet Connect (Desktop) */}
                    <div className="hidden md:flex">
                        <div className="flex items-center relative z-[70]">
                            <WalletAny>
                                <ConnectWalletAny className="bg-white text-black font-bold px-4 py-2 rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-pink-500/25 border-none">
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

                    {/* Mobile Wallet (Top Right) */}
                    <div className="md:hidden flex">
                        <WalletAny>
                            <ConnectWalletAny className="bg-white/10 border border-white/20 text-white font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-2">
                                <AvatarAny className="h-5 w-5" />
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
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-black/90 backdrop-blur-xl border-t border-white/10 pb-safe">
                <div className="flex justify-around items-center h-16 px-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? "text-pink-500" : "text-gray-500"
                                    }`}
                            >
                                <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-pink-500/20" : "bg-transparent"}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
