import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import GameLobby from './components/GameLobby';
import BingoCard from './components/BingoCard';
import ChatSystem from './components/ChatSystem';
import { GameState, WalletState, BingoCard as BingoCardType, DrawnNumber, ChatChannel, GameSession } from './types';
import * as Web3Service from './services/web3Service';
import * as GeminiService from './services/geminiService';
import { Share, Plus, Activity, Zap, ShieldCheck, Fuel, Loader, Gift, Info, Minus } from 'lucide-react';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balances: { MOM: 0, USDC: 0, ETH: 0 }
  });

  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [activeGameSession, setActiveGameSession] = useState<GameSession | null>(null);
  const [selectedPriceTier, setSelectedPriceTier] = useState<number>(0);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);
  
  const [myCards, setMyCards] = useState<BingoCardType[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<DrawnNumber[]>([]);
  const [currentCall, setCurrentCall] = useState<string>("Waiting for game start...");
  const [chatMessages, setChatMessages] = useState<{id: string, user: string, text: string, channel: ChatChannel, isSystem?: boolean}[]>([]);
  const [winningCardId, setWinningCardId] = useState<string | null>(null);
  const [isProcessingBuy, setIsProcessingBuy] = useState(false);

  const gameLoopRef = useRef<number | null>(null);

  const handleConnect = async () => {
    const walletData = await Web3Service.connectWallet();
    setWallet(walletData);
    setChatMessages(prev => [...prev, {
        id: 'sys-login',
        user: 'System',
        text: 'Welcome back, cryptomom.eth!',
        channel: 'GLOBAL',
        isSystem: true
    }]);
  };

  const handleJoinGame = async (session: GameSession) => {
    if (!wallet.isConnected) {
      alert("Please connect wallet first!");
      handleConnect();
      return;
    }
    setActiveGameSession(session);
    // Default to first price tier or base price
    setSelectedPriceTier(session.priceOptions ? session.priceOptions[0] : session.ticketPrice);
    setBuyQuantity(1);
    setGameState(GameState.BUYING);
  };

  const handleBuyCards = async () => {
    if (!activeGameSession) return;
    setIsProcessingBuy(true);
    
    // Simulate transaction delay
    const result = await Web3Service.purchaseCards(activeGameSession.id, buyQuantity, activeGameSession.currency, selectedPriceTier);
    
    setIsProcessingBuy(false);
    
    if (result.success) {
      // Calculate total cards including bonus
      const bonusCards = Math.floor(buyQuantity / 10);
      const totalCards = buyQuantity + bonusCards;

      const newCards: BingoCardType[] = Array(totalCards).fill(0).map((_, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        cells: Web3Service.generateBingoCard().map((row, rIdx) => 
          row.map((num, cIdx) => ({
            number: num,
            isDaubed: false,
            isFree: rIdx === 2 && cIdx === 2
          }))
        ),
        hasBingo: false
      }));
      setMyCards(newCards);
      setGameState(GameState.LIVE);
      
      setChatMessages(prev => [...prev, {
          id: `sys-${Date.now()}`,
          user: 'System',
          text: `Purchased ${buyQuantity} cards (+${bonusCards} free) for ${activeGameSession.name}. Tx: ${result.txHash.slice(0,6)}...`,
          channel: 'ROOM',
          isSystem: true
      }]);

      startGameLoop();
    }
  };

  const handleShareForFreeCard = () => {
    // Mock share functionality
    alert("Shared to Farcaster! Free $MomCoin card added to your account.");
    // In real app, this would verify the share via API
  };

  const startGameLoop = () => {
    let availableNumbers = Array.from({length: 75}, (_, i) => i + 1);
    setWinningCardId(null);
    setDrawnNumbers([]);
    
    setChatMessages(prev => [...prev, { id: 'gm-start', user: "MomAI", text: "Game starting! Verifying contract randomness...", channel: 'ROOM' }]);

    gameLoopRef.current = window.setInterval(async () => {
      if (availableNumbers.length === 0) {
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return;
      }

      // 1. Draw Number
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const number = availableNumbers[randomIndex];
      availableNumbers.splice(randomIndex, 1);
      const vrfHash = Web3Service.generateVRFHash();

      // 2. Get AI Commentary (Non-blocking)
      GeminiService.getBingoCallCommentary(number, []).then(comment => {
        setCurrentCall(comment);
      });

      // 3. Update State
      setDrawnNumbers(prev => {
        const newDrawn = [...prev, { number, timestamp: Date.now(), vrfHash }];
        
        setMyCards(currentCards => {
          const updatedCards = currentCards.map(card => {
            const gridStatus = card.cells.map(row => 
              row.map(cell => {
                if (cell.isFree) return true;
                if (cell.number === number) return true;
                return newDrawn.some(d => d.number === cell.number);
              })
            );

            const hasWin = Web3Service.checkWin(gridStatus);
            if (hasWin && !winningCardId) {
               handleWin(card.id);
            }

            return { ...card, hasBingo: hasWin };
          });
          return updatedCards;
        });

        return newDrawn;
      });

      // 4. Bot Chatter
      if (Math.random() > 0.6) {
        const botMsg = await GeminiService.getBotChatter();
        setChatMessages(prev => [...prev.slice(-40), { 
            id: `msg-${Date.now()}-${Math.random()}`,
            user: `Player${Math.floor(Math.random()*999)}`, 
            text: botMsg,
            channel: 'ROOM'
        }]);
      }

    }, 3500); 
  };

  const handleWin = (cardId: string) => {
    setWinningCardId(cardId);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setGameState(GameState.ENDED);
    setCurrentCall("BINGO! WE HAVE A WINNER! 🎉");
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  // Helper for bonus card calculation
  const bonusCards = Math.floor(buyQuantity / 10);

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-white">
      <Navbar wallet={wallet} onConnect={handleConnect} />
      
      <main className="pt-20 px-2 sm:px-4">
        {gameState === GameState.LOBBY && (
          <GameLobby onJoin={handleJoinGame} />
        )}

        {gameState === GameState.BUYING && activeGameSession && (
          <div className="max-w-md mx-auto mt-10 animate-in fade-in slide-in-from-bottom-8">
            <div className="glass-panel p-6 sm:p-8 rounded-2xl relative">
                {/* Back Button */}
                <button onClick={() => setGameState(GameState.LOBBY)} className="absolute top-4 right-4 text-xs text-slate-400 hover:text-white">
                    Cancel
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-1">Buy Cards</h2>
                    <div className="text-sm text-[#0052FF] font-bold uppercase tracking-wider">{activeGameSession.name}</div>
                </div>
            
                {/* Price Selection (if multiple tiers) */}
                {activeGameSession.priceOptions && activeGameSession.priceOptions.length > 1 ? (
                    <div className="mb-6">
                        <p className="text-xs text-slate-400 mb-2 font-bold uppercase text-center">Select Card Tier</p>
                        <div className="grid grid-cols-3 gap-2">
                            {activeGameSession.priceOptions.map(price => (
                                <button
                                    key={price}
                                    onClick={() => setSelectedPriceTier(price)}
                                    className={`py-3 rounded-xl font-bold transition-all border ${
                                        selectedPriceTier === price 
                                        ? 'bg-[#0052FF] border-[#0052FF] text-white shadow-lg' 
                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    {activeGameSession.currency === 'USDC' ? '$' : ''}{price.toFixed(2)}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center mb-6">
                        <div className="inline-block bg-slate-900 rounded-lg px-4 py-2 border border-slate-800">
                            Ticket Price: <span className="text-white font-bold">{activeGameSession.ticketPriceDisplay || activeGameSession.ticketPrice}</span>
                        </div>
                    </div>
                )}
            
                {/* Quantity Stepper */}
                <div className="mb-6">
                    <p className="text-xs text-slate-400 mb-2 font-bold uppercase text-center">Quantity</p>
                    <div className="flex items-center justify-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
                        <button 
                            onClick={() => setBuyQuantity(Math.max(1, buyQuantity - 1))}
                            className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                        >
                            <Minus size={18} />
                        </button>
                        <div className="w-16 text-center font-mono text-2xl font-bold">
                            {buyQuantity}
                        </div>
                        <button 
                            onClick={() => setBuyQuantity(buyQuantity + 1)}
                            className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                    
                    {/* Bonus Logic */}
                    <div className="text-center mt-2 h-6">
                        {bonusCards > 0 ? (
                            <span className="text-xs text-green-400 font-bold bg-green-900/20 px-2 py-0.5 rounded animate-pulse">
                                +{bonusCards} FREE CARD{bonusCards > 1 ? 'S' : ''}! 🎉
                            </span>
                        ) : (
                            <span className="text-[10px] text-slate-500">Buy 10 get 1 FREE</span>
                        )}
                    </div>
                </div>

                {/* Summary & Action */}
                <div className="bg-slate-900/80 rounded-xl p-4 mb-6 border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">Total Cards:</span>
                        <span className="text-white font-bold">{buyQuantity + bonusCards}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
                        <span className="text-sm text-slate-400">Total Cost:</span>
                        <span className="text-xl font-mono font-bold text-white">
                            {(buyQuantity * selectedPriceTier).toFixed(2)} {activeGameSession.currency}
                        </span>
                    </div>
                    
                    <button 
                        disabled={isProcessingBuy}
                        onClick={handleBuyCards}
                        className="w-full py-4 bg-gradient-to-r from-[#0052FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessingBuy ? <Loader className="animate-spin" /> : 'Confirm Purchase'}
                    </button>
                </div>

                {/* Share for Free Card */}
                <button 
                    onClick={handleShareForFreeCard}
                    className="w-full py-3 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <Share size={16} /> Share for a FREE $MomCoin Card
                </button>

                <div className="mt-6 flex flex-col gap-2 items-center justify-center text-[10px] text-slate-500">
                    <div className="flex items-center gap-1">
                        <ShieldCheck size={12} />
                        <span>Verifiable Randomness via Chainlink VRF</span>
                    </div>
                    <div>Rake Info: {activeGameSession.rakeDetails}</div>
                </div>
            </div>
          </div>
        )}

        {(gameState === GameState.LIVE || gameState === GameState.ENDED) && activeGameSession && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 pb-20 h-[calc(100vh-100px)]">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
              <div className="glass-panel p-4 rounded-xl border-t-4 border-[#0052FF] relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Activity size={48} /></div>
                <div className="text-xs text-blue-400 font-bold uppercase mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> MomAI Caller
                </div>
                <div className="min-h-[4rem] flex items-center justify-center text-center">
                  <p className="text-xl font-medium leading-tight text-white">{currentCall}</p>
                </div>
                {drawnNumbers.length > 0 && (
                   <div className="mt-2 pt-2 border-t border-white/10 text-[10px] text-slate-500 font-mono flex justify-between">
                     <span>VRF Verified</span>
                     <span className="text-blue-400 underline cursor-pointer">{drawnNumbers[drawnNumbers.length-1].vrfHash?.slice(0, 8)}...</span>
                   </div>
                )}
              </div>
              
              <div className="hidden lg:block glass-panel p-4 rounded-xl flex-1">
                 <h3 className="font-bold text-slate-300 mb-4 text-sm uppercase">Live Standings</h3>
                 <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-slate-800 flex items-center justify-center text-xs font-mono text-slate-500">{i}</div>
                          <span className="text-slate-400">0x...{Math.floor(Math.random()*9000+1000)}</span>
                        </div>
                        <div className="text-blue-400 font-mono text-xs">
                          {i === 1 ? '1 TO GO' : '2 TO GO'}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* MIDDLE COLUMN */}
            <div className="lg:col-span-6 flex flex-col order-1 lg:order-2">
              {gameState === GameState.ENDED && winningCardId && (
                <div className="mb-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 p-6 rounded-2xl text-center animate-in zoom-in shrink-0">
                  <h2 className="text-3xl font-black text-yellow-400 mb-2">FULL HOUSE!</h2>
                  <p className="text-slate-300 mb-4">You just won the {activeGameSession.name} pot!</p>
                  
                  {activeGameSession.currency === 'USDC' && (
                      <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 mb-4 inline-flex items-center gap-2">
                          <Gift className="text-green-400" size={20} />
                          <span className="font-bold text-green-400">+1000 $MOM Bonus Applied!</span>
                      </div>
                  )}

                  <div className="flex justify-center gap-4 flex-wrap">
                    <button onClick={() => setGameState(GameState.LOBBY)} className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-yellow-300 flex items-center gap-2 shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                      <Zap size={18} /> Claim {activeGameSession.currency}
                    </button>
                    <button className="bg-slate-800 text-white font-bold px-6 py-2 rounded-lg hover:bg-slate-700 flex items-center gap-2">
                      <Share size={18} /> Share on Farcaster
                    </button>
                  </div>
                  <div className="mt-4 text-[10px] text-slate-500 underline cursor-pointer">Verify on Basescan</div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pb-4 custom-scrollbar">
                {myCards.map(card => (
                  <BingoCard key={card.id} card={card} drawnNumbers={drawnNumbers.map(d => d.number)} />
                ))}
                
                <div onClick={() => setGameState(GameState.LOBBY)} className="border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-8 text-slate-600 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group min-h-[250px]">
                  <Plus className="w-12 h-12 mb-2 group-hover:text-blue-500 transition-colors" />
                  <span className="font-bold group-hover:text-blue-400">Pre-order Next Round</span>
                </div>
              </div>
            </div>

             {/* RIGHT COLUMN */}
             <div className="lg:col-span-3 h-[300px] lg:h-auto order-3">
               <ChatSystem 
                  messages={chatMessages} 
                  currentRoomName={activeGameSession.name}
               />
             </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default App;