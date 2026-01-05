import { WalletState, Currency, PastWinner, GameSession } from '../types';

const MOCK_DELAY = 800;

export const connectWallet = async (): Promise<WalletState> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const mockAddress = "0x71C...39A2";
  return {
    isConnected: true,
    address: mockAddress,
    farcasterHandle: "cryptomom.eth",
    balances: {
      MOM: 420690,
      USDC: 1500,
      ETH: 1.45
    }
  };
};

export const purchaseCards = async (gameId: string, count: number, currency: Currency, priceTier?: number): Promise<{success: boolean, txHash: string}> => {
  const cost = (priceTier || 0) * count;
  console.log(`[Base Paymaster] Sponsoring Gas for Game ${gameId}...`);
  console.log(`[Base Chain] Spending ${cost} ${currency} for ${count} cards @ ${priceTier}`);
  
  // Logic check: "Buy 10 get 1 free" is handled in smart contract, but frontend sends total requested
  // In a real app, you might send { buyAmount: 10 } and contract mints 11.
  
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  return {
    success: true,
    txHash: "0x" + Math.random().toString(16).substr(2, 40)
  };
};

// Helper to get next occurrence of a specific UTC hour
const getNextTime = (hourUTC: number) => {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours(hourUTC, 0, 0, 0);
  if (target.getTime() < now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }
  return target.getTime();
};

export const fetchUpcomingGames = async (): Promise<GameSession[]> => {
  const games: GameSession[] = [];

  // 1. HOURLY MOMCOIN BURN (Next 24 hours)
  // Just show the next 6 for the carousel
  for (let i = 0; i < 24; i++) {
    const nextHour = new Date();
    nextHour.setMinutes(0, 0, 0);
    nextHour.setHours(nextHour.getHours() + i + 1);
    
    games.push({
      id: `hourly-${i}`,
      type: 'HOURLY_MOM',
      name: `🔥 ${nextHour.getHours()}:00 Burn`,
      subtext: "Deflationary Burn",
      startTime: nextHour.getTime(),
      status: 'UPCOMING',
      currency: 'MOM',
      ticketPrice: 10000,
      ticketPriceDisplay: "10k $MOM",
      prizePool: 50000 + (Math.random() * 20000), 
      players: Math.floor(Math.random() * 200) + 50,
      rakeDetails: "5% Burn • 95% Pot"
    });
  }

  // 2. DAILY USDC SCHEDULE (9, 12, 15, 18, 20, 23 UTC)
  // Strict pricing: .10, .25, .50
  const usdcSchedule = [
    { name: "☀️ Morning Rush", hour: 9, pot: 50 },
    { name: "🍽️ Lunch Break", hour: 12, pot: 55 },
    { name: "💼 Afternoon Peak", hour: 15, pot: 75 },
    { name: "🌅 Evening Grind", hour: 18, pot: 120 },
    // 8 PM IS MAIN EVENT
    { name: "🦉 Late Night", hour: 23, pot: 40 },
  ];

  usdcSchedule.forEach((slot, idx) => {
    games.push({
      id: `usdc-${idx}`,
      type: 'USDC_DAILY',
      name: slot.name,
      subtext: "Feeds 8PM Pot",
      startTime: getNextTime(slot.hour),
      status: 'UPCOMING',
      currency: 'USDC',
      ticketPrice: 0.10,
      priceOptions: [0.10, 0.25, 0.50],
      ticketPriceDisplay: "$0.10 | $0.25 | $0.50",
      prizePool: slot.pot,
      prizePoolDisplay: `$${slot.pot}`,
      players: Math.floor(Math.random() * 100) + 20,
      feed8pm: true,
      rakeDetails: "3% Feeds 8PM Jackpot"
    });
  });

  // 3. BINGO NIGHT (8 PM UTC) - THE MAIN EVENT
  games.push({
    id: 'usdc-main',
    type: 'USDC_MAIN_EVENT',
    name: "🎉 BINGO NIGHT",
    subtext: "THE MAIN EVENT",
    startTime: getNextTime(20), // 8 PM UTC
    status: 'UPCOMING',
    currency: 'USDC',
    ticketPrice: 0.10,
    priceOptions: [0.10, 0.25, 0.50],
    ticketPriceDisplay: "$0.10 | $0.25 | $0.50",
    prizePool: 450,
    prizePoolDisplay: "$450+",
    progressive: 1250, // Starts at 100, rolls over + feeds
    players: 1542,
    feed8pm: false, // This IS the 8pm pot
    rakeDetails: "Full Progressive Payout"
  });

  return games.sort((a, b) => a.startTime - b.startTime);
};

export const fetchPastWinners = async (): Promise<PastWinner[]> => {
  return [
    { id: 'w-1', gameName: "BINGO NIGHT #402", winner: "0xA4...99B1", prize: "$580 USDC", bonus: "+1000 $MOM", timestamp: Date.now() - 86400000, txHash: "0xabc...123" },
    { id: 'w-2', gameName: "Evening Grind", winner: "dwr.eth", prize: "$125 USDC", bonus: "+1000 $MOM", timestamp: Date.now() - 93600000, txHash: "0xdef...456" },
    { id: 'w-3', gameName: "Lunch Break", winner: "0xC9...11D3", prize: "$52 USDC", bonus: "+1000 $MOM", timestamp: Date.now() - 115200000, txHash: "0xghi...789" },
  ];
};

export const generateVRFHash = (): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 40; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
};

export const generateBingoCard = (): number[][] => {
  const card: number[][] = [];
  const ranges = [
    { min: 1, max: 15 },
    { min: 16, max: 30 },
    { min: 31, max: 45 },
    { min: 46, max: 60 },
    { min: 61, max: 75 }
  ];

  for (let row = 0; row < 5; row++) {
    const rowData: number[] = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        rowData.push(0);
      } else {
        let num;
        do {
          num = Math.floor(Math.random() * (ranges[col].max - ranges[col].min + 1)) + ranges[col].min;
        } while (rowData.includes(num) || (card.some(r => r[col] === num)));
        rowData.push(num);
      }
    }
    card.push(rowData);
  }
  return card;
};

export const checkWin = (grid: boolean[][]): boolean => {
  for (let i = 0; i < 5; i++) if (grid[i].every(cell => cell)) return true;
  for (let i = 0; i < 5; i++) if (grid.every(row => row[i])) return true;
  if ([0, 1, 2, 3, 4].every(i => grid[i][i])) return true;
  if ([0, 1, 2, 3, 4].every(i => grid[i][4 - i])) return true;
  return false;
};