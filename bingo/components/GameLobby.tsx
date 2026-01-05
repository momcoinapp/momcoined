import React, { useState, useEffect } from 'react';
import { GameSession, PastWinner } from '../types';
import { Clock, ExternalLink, Flame, Gift, ArrowRight, DollarSign, Info, ShieldCheck } from 'lucide-react';
import * as Web3Service from '../services/web3Service';

interface GameLobbyProps {
  onJoin: (game: GameSession) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ onJoin }) => {
  const [games, setGames] = useState<GameSession[]>([]);
  const [activeTab, setActiveTab] = useState<'PLAY' | 'WINNERS'>('PLAY');
  const [pastWinners, setPastWinners] = useState<PastWinner[]>([]);

  useEffect(() => {
    Web3Service.fetchUpcomingGames().then(setGames);
    Web3Service.fetchPastWinners().then(setPastWinners);
  }, []);

  const getCountdown = (target: number) => {
    const diff = target - Date.now();
    if (diff < 0) return "LIVE";
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hrs}h ${mins}m`;
  };

  const hourlyGames = games.filter(g => g.type === 'HOURLY_MOM');
  const dailyGames = games.filter(g => g.type === 'USDC_DAILY');
  const mainEvent = games.find(g => g.type === 'USDC_MAIN_EVENT');

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 pb-24">
      
      {/* Hero Header */}
      <div className="text-center mb-8 animate-in fade-in zoom-in duration-500">
        <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] via-purple-500 to-pink-500">$MomCoin</span>
          <span className="text-white ml-3">BINGO</span>
        </h1>
        <p className="text-slate-400 text-lg">Hourly Burn. Daily Jackpots. On Base.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
             <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1">
                <ShieldCheck size={12} className="text-green-400" /> Fully On-Chain
             </div>
             <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1">
                <Gift size={12} className="text-pink-400" /> Buy 10 Get 1 Free
             </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-700/50 backdrop-blur flex gap-1">
            <button onClick={() => setActiveTab('PLAY')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'PLAY' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Play Bingo</button>
            <button onClick={() => setActiveTab('WINNERS')} className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'WINNERS' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Winners</button>
        </div>
      </div>

      {activeTab === 'PLAY' && (
      <div className="space-y-12">
        
        {/* SECTION 1: THE MAIN EVENT HERO */}
        {mainEvent && (
        <div className="animate-in slide-in-from-bottom-4">
             <div className="relative bg-gradient-to-br from-[#0052FF] to-purple-800 rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl shadow-blue-900/40 border border-blue-500/50 group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="absolute top-0 right-0 p-12 bg-white/10 blur-3xl rounded-full pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 shadow-lg animate-pulse">
                            <Clock size={14} /> 8 PM UTC MAIN EVENT
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tighter drop-shadow-md">BINGO NIGHT</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-xl">
                           The daily mega-draw. All daily games feed this pot.
                           <br/><span className="text-yellow-300 font-bold">Progressive Jackpot rolls over if unclaimed!</span>
                        </p>
                        
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                             <div className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                                <span className="block text-xs text-blue-200 uppercase font-bold mb-1">Total Jackpot</span>
                                <span className="text-3xl font-black text-yellow-400">${mainEvent.progressive}</span>
                             </div>
                             <div className="bg-black/30 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10">
                                <span className="block text-xs text-blue-200 uppercase font-bold mb-1">Tiers</span>
                                <span className="text-3xl font-bold text-white text-xl md:text-2xl">$0.10 | $0.25 | $0.50</span>
                             </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto flex flex-col gap-3">
                        <button onClick={() => onJoin(mainEvent)} className="w-full md:w-auto px-10 py-5 bg-white text-[#0052FF] font-black text-xl rounded-2xl shadow-xl hover:scale-105 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                            PLAY NOW
                        </button>
                        <div className="text-center text-sm font-mono text-blue-200">
                            Starts in {getCountdown(mainEvent.startTime)}
                        </div>
                    </div>
                </div>
             </div>
        </div>
        )}

        {/* SECTION 2: ROAD TO 8 PM (Daily Games) */}
        <div className="animate-in slide-in-from-bottom-8 delay-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500/20 p-2 rounded-lg text-green-400"><DollarSign size={20} /></div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Daily USDC Schedule</h2>
                        <div className="text-xs text-slate-400">Rakes feed the 8 PM Jackpot</div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                    <Info size={12} /> 3% of every card goes to the Big Pot
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {dailyGames.map((game, idx) => (
                    <div key={game.id} className="relative bg-slate-900 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 transition-all group flex flex-col">
                        {/* Connector Line for Desktop */}
                        {idx < dailyGames.length - 1 && (
                             <div className="hidden lg:block absolute top-1/2 -right-6 w-8 h-[2px] bg-slate-800 z-0"></div>
                        )}
                        
                        <div className="mb-3">
                            <span className="text-[10px] font-mono text-slate-500 uppercase">{new Date(game.startTime).getUTCHours()}:00 UTC</span>
                            <h3 className="font-bold text-white text-lg leading-tight">{game.name.replace(/^[^\s]+\s/, '')}</h3>
                        </div>
                        
                        <div className="mt-auto">
                             <div className="flex justify-between items-end mb-3">
                                 <div>
                                     <div className="text-[10px] text-slate-500">Pot</div>
                                     <div className="text-green-400 font-bold">{game.prizePoolDisplay}</div>
                                 </div>
                                 <div className="text-right">
                                     <div className="text-[10px] text-slate-500">Tiers</div>
                                     <div className="text-white font-bold text-xs">$0.10 | $0.25 | $0.50</div>
                                 </div>
                             </div>
                             <button onClick={() => onJoin(game)} className="w-full py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white text-xs font-bold rounded-lg transition-colors border border-slate-700">
                                Join Game
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION 3: HOURLY MOMCOIN BURN */}
        <div className="animate-in slide-in-from-bottom-8 delay-200 border-t border-slate-800 pt-8">
            <div className="flex items-center gap-2 mb-4">
                <Flame className="text-orange-500" />
                <h2 className="text-xl font-bold text-white">Hourly $MomCoin Burn</h2>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Fast • Cheap • Deflationary</span>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-4 snap-x custom-scrollbar">
                {hourlyGames.slice(0, 8).map((game) => (
                    <div key={game.id} className="min-w-[200px] bg-slate-900 border border-slate-700 rounded-xl p-4 snap-start hover:border-orange-500/50 transition-colors flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-bold text-white">{game.name.replace('🔥 ', '')}</span>
                            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{getCountdown(game.startTime)}</span>
                        </div>
                        <div className="mt-auto">
                            <div className="text-xs text-slate-500">Prize Pool</div>
                            <div className="font-bold text-orange-400 text-lg mb-3">{(game.prizePool / 1000).toFixed(1)}k MOM</div>
                            <button onClick={() => onJoin(game)} className="w-full py-2 bg-slate-800 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors border border-slate-700 hover:border-orange-500">
                                Join (10k MOM)
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Free Ticket Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-xl relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gift size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-black text-white mb-1">🎁 Free $MomCoin Bingo Card</h2>
                    <p className="text-blue-100 font-medium">Share on Farcaster & get a free card for the next MomCoin Burn!</p>
                </div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2">
                    Share & Claim <ArrowRight size={16} />
                </button>
            </div>
        </div>

      </div>
      )}

      {activeTab === 'WINNERS' && (
        <div className="overflow-hidden rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 bg-slate-900/50">
           <table className="w-full text-left border-collapse">
             <thead className="bg-slate-800 text-xs uppercase text-slate-400 font-bold">
               <tr>
                 <th className="p-4">Game</th>
                 <th className="p-4">Winner</th>
                 <th className="p-4 text-right">Total Prize</th>
                 <th className="p-4 text-center">Verify</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-800">
               {pastWinners.map(winner => (
                 <tr key={winner.id} className="hover:bg-slate-800/50 transition-colors">
                   <td className="p-4">
                      <div className="font-bold text-white">{winner.gameName}</div>
                      <div className="text-xs text-slate-500">{new Date(winner.timestamp).toLocaleDateString()}</div>
                   </td>
                   <td className="p-4 font-mono text-blue-400">{winner.winner}</td>
                   <td className="p-4 text-right">
                       <div className="font-bold text-white">{winner.prize}</div>
                       {winner.bonus && <div className="text-[10px] font-bold text-green-400">{winner.bonus}</div>}
                   </td>
                   <td className="p-4 text-center">
                     <a href="#" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                       Basescan <ExternalLink size={10} />
                     </a>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default GameLobby;