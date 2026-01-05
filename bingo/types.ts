export enum GameState {
  LOBBY = 'LOBBY',
  BUYING = 'BUYING',
  COUNTDOWN = 'COUNTDOWN',
  LIVE = 'LIVE',
  ENDED = 'ENDED'
}

export type GameType = 'HOURLY_MOM' | 'USDC_DAILY' | 'USDC_MAIN_EVENT';

export type Currency = 'MOM' | 'USDC' | 'ETH';

export type ChatChannel = 'GLOBAL' | 'ROOM';

export interface Player {
  address: string;
  cardCount: number;
  isBot: boolean;
}

export interface BingoCell {
  number: number;
  isDaubed: boolean;
  isFree: boolean;
}

export interface BingoCard {
  id: string;
  cells: BingoCell[][]; // 5x5 grid
  hasBingo: boolean;
}

export interface DrawnNumber {
  number: number;
  timestamp: number;
  commentary?: string;
  vrfHash?: string; // Verifiable Random Function hash
}

export interface GameSession {
  id: string;
  type: GameType;
  name: string;
  subtext?: string;
  startTime: number; // Unix timestamp
  status: 'LIVE' | 'UPCOMING' | 'ENDED';
  currency: Currency;
  
  // Pricing
  ticketPrice: number; // Base price
  priceOptions?: number[]; // If room has multiple tiers (e.g. $0.10, $0.50, $1)
  ticketPriceDisplay?: string; 

  // Pot & Rake
  prizePool: number;
  prizePoolDisplay?: string;
  progressive?: number;
  rakeDetails?: string; // e.g. "3% feeds 8PM Pot"
  
  players: number;
  feed8pm?: boolean; // Does rake feed 8pm pot?
}

export interface PastWinner {
  id: string;
  gameName: string;
  winner: string;
  prize: string;
  bonus?: string; // "+1000 MOM"
  timestamp: number;
  txHash: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  farcasterHandle?: string; // Mock Farcaster integration
  balances: {
    MOM: number;
    USDC: number;
    ETH: number;
  };
}