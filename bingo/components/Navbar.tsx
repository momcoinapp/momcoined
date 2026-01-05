import React, { useState } from 'react';
import { Wallet, Menu, UserCircle, X, ChevronDown, Fuel } from 'lucide-react';
import { WalletState } from '../types';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBalances, setShowBalances] = useState(false);

  return (
    <nav className="w-full h-16 glass-panel flex items-center justify-between px-4 fixed top-0 z-50 shadow-lg shadow-black/20 border-b border-white/5">
      <div className="flex items-center gap-2 z-50">
        <div className="w-8 h-8 bg-[#0052FF] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
          <div className="w-4 h-4 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white leading-none">
            MomBingo
          </span>
          <span className="text-[10px] text-blue-400 font-bold tracking-wider">ON BASE</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        {/* Gasless Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
            <Fuel size={14} className="text-green-400" />
            <span className="text-xs font-bold text-green-400">Gasless Mode</span>
        </div>

        {wallet.isConnected ? (
          <div className="relative">
            <button 
              onClick={() => setShowBalances(!showBalances)}
              className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 py-1.5 px-3 rounded-full border border-slate-700 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-end leading-none">
                <span className="text-xs text-gray-400">Balance</span>
                <span className="text-sm font-bold text-white flex items-center gap-1">
                   {wallet.balances.USDC.toLocaleString()} USDC <ChevronDown size={12}/>
                </span>
              </div>
              <div className="h-6 w-[1px] bg-slate-600"></div>
              <div className="flex items-center gap-2">
                {/* Simulated Farcaster PFP */}
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {wallet.farcasterHandle?.[0].toUpperCase()}
                </div>
                <span className="text-xs text-slate-300 font-bold">{wallet.farcasterHandle}</span>
              </div>
            </button>
            
            {showBalances && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">$MOM</span>
                    <span className="font-mono font-bold text-pink-400">{wallet.balances.MOM}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">ETH</span>
                    <span className="font-mono font-bold text-purple-400">{wallet.balances.ETH}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onConnect}
            className="flex items-center gap-2 bg-[#855DCD] hover:bg-[#734FB3] text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-purple-900/20"
          >
            <UserCircle size={18} />
            Sign in with Farcaster
          </button>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-slate-300 z-50 p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-40 flex flex-col items-center justify-center p-8 backdrop-blur-md animate-in fade-in">
          {wallet.isConnected && (
            <div className="w-full max-w-sm bg-slate-900 rounded-2xl p-6 border border-slate-800 mb-8 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                 <span className="text-slate-400 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {wallet.farcasterHandle?.[0].toUpperCase()}
                    </div>
                    {wallet.farcasterHandle}
                 </span>
                 <div className="flex items-center gap-1.5 bg-green-900/30 px-2 py-1 rounded">
                    <Fuel size={12} className="text-green-400" />
                    <span className="text-[10px] font-bold text-green-400">GASLESS</span>
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between"><span className="text-blue-400 font-bold">USDC</span> <span>{wallet.balances.USDC.toLocaleString()}</span></div>
                 <div className="flex justify-between"><span className="text-pink-400 font-bold">$MOM</span> <span>{wallet.balances.MOM.toLocaleString()}</span></div>
                 <div className="flex justify-between"><span className="text-purple-400 font-bold">ETH</span> <span>{wallet.balances.ETH.toLocaleString()}</span></div>
              </div>
            </div>
          )}
          
          {!wallet.isConnected && (
            <button
              onClick={() => { onConnect(); setIsMobileMenuOpen(false); }}
              className="w-full max-w-sm bg-[#855DCD] text-white py-4 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2"
            >
              <UserCircle size={24} />
              Sign in with Farcaster
            </button>
          )}
          
          <div className="text-slate-500 text-sm mt-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Powered by Base
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;