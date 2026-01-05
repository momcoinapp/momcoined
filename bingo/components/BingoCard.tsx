import React, { useMemo } from 'react';
import { BingoCard as BingoCardType } from '../types';
import { Check } from 'lucide-react';

interface BingoCardProps {
  card: BingoCardType;
  drawnNumbers: number[];
}

const BingoCard: React.FC<BingoCardProps> = ({ card, drawnNumbers }) => {
  const gridState = useMemo(() => {
    return card.cells.map(row => 
      row.map(cell => {
        const isDrawn = drawnNumbers.includes(cell.number);
        // Center is always free/daubed
        if (cell.isFree) return { ...cell, isDaubed: true };
        return { ...cell, isDaubed: isDrawn };
      })
    );
  }, [card, drawnNumbers]);

  return (
    <div className={`relative p-1.5 sm:p-2 rounded-xl border-2 transition-all duration-500 ${card.hasBingo ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-slate-800' : 'border-slate-700 bg-slate-900'}`}>
      {card.hasBingo && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-xl backdrop-blur-sm">
          <div className="bg-yellow-400 text-black font-black text-2xl sm:text-3xl px-6 py-2 rounded-full transform -rotate-12 shadow-2xl animate-pop">
            BINGO!
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-5 gap-1 mb-1.5 sm:mb-2">
        {['B', 'I', 'N', 'G', 'O'].map((letter) => (
          <div key={letter} className="text-center font-black text-pink-500 text-lg sm:text-xl">
            {letter}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1">
        {gridState.map((row, rIndex) => 
          row.map((cell, cIndex) => (
            <div 
              key={`${rIndex}-${cIndex}`}
              className={`
                aspect-square flex items-center justify-center rounded-md text-xs sm:text-base font-bold relative overflow-hidden transition-all duration-300
                ${cell.isDaubed ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300'}
                ${cell.isFree ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
              `}
            >
              {cell.isFree ? (
                <span className="text-[10px] sm:text-xs">MOM</span>
              ) : (
                cell.number
              )}
              {cell.isDaubed && !cell.isFree && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-full h-full bg-pink-400 rounded-full scale-150 blur-sm"></div>
                </div>
              )}
              {cell.isDaubed && (
                 <Check className="absolute w-full h-full text-white/20 p-1" />
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-1.5 sm:mt-2 text-center text-[10px] sm:text-xs text-slate-500 font-mono uppercase tracking-wider">
        #{card.id.slice(0,6)}
      </div>
    </div>
  );
};

export default BingoCard;