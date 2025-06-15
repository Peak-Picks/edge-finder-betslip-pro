import React, { createContext, useState, useContext, ReactNode } from "react";

export interface Bet {
  id: string;
  type: string;
  description?: string;
  title?: string;
  subtitle?: string;
  odds: string;
  edge: number;
  [x: string]: any;
}

export interface SavedBetSlip {
  bets: Bet[];
  amount: string;
  timestamp: number;
  status: 'pending' | 'won' | 'lost' | 'void' | 'partial';
  settledAt?: number;
  actualPayout?: number;
  notes?: string;
  betResults: { betId: string; result: 'won' | 'lost' | 'void' }[];
}

interface BetSlipContextProps {
  betSlip: Bet[];
  setBetSlip: React.Dispatch<React.SetStateAction<Bet[]>>;
  addToBetSlip: (bet: Bet) => void;
  removeFromBetSlip: (betId: string) => void;
  clearBetSlip: () => void;

  savedBetSlips: SavedBetSlip[];
  addSavedBetSlip: (bets: Bet[], amount: string) => void;
  markBetSlipResult: (slipIndex: number, status: 'won' | 'lost' | 'void', actualPayout?: number, notes?: string) => void;
  markIndividualBetResult: (slipIndex: number, betId: string, result: 'won' | 'lost' | 'void') => void;
  editSavedBetSlip: (slipIndex: number, amount: string, notes?: string) => void;
  deleteSavedBetSlip: (slipIndex: number) => void;
}

const BetSlipContext = createContext<BetSlipContextProps | undefined>(undefined);

export function useBetSlipContext() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlipContext must be used within BetSlipProvider");
  return ctx;
}

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<Bet[]>([]);
  const [savedBetSlips, setSavedBetSlips] = useState<SavedBetSlip[]>([]);

  const addToBetSlip = (bet: Bet) => {
    setBetSlip(prev =>
      prev.some(b => b.id === bet.id) ? prev : [...prev, bet]
    );
  };

  const removeFromBetSlip = (betId: string) => {
    setBetSlip(prev => prev.filter(bet => bet.id !== betId));
  };

  const clearBetSlip = () => setBetSlip([]);

  const addSavedBetSlip = (bets: Bet[], amount: string) => {
    setSavedBetSlips(prev => [
      ...prev,
      { 
        bets: bets, 
        amount, 
        timestamp: Date.now(),
        status: 'pending',
        betResults: []
      }
    ]);
  };

  const markBetSlipResult = (slipIndex: number, status: 'won' | 'lost' | 'void', actualPayout?: number, notes?: string) => {
    setSavedBetSlips(prev => 
      prev.map((slip, index) => 
        index === slipIndex 
          ? { 
              ...slip, 
              status, 
              settledAt: Date.now(), 
              actualPayout, 
              notes 
            }
          : slip
      )
    );
  };

  const markIndividualBetResult = (slipIndex: number, betId: string, result: 'won' | 'lost' | 'void') => {
    setSavedBetSlips(prev => 
      prev.map((slip, index) => 
        index === slipIndex 
          ? { 
              ...slip, 
              betResults: [
                ...slip.betResults.filter(br => br.betId !== betId),
                { betId, result }
              ]
            }
          : slip
      )
    );
  };

  const editSavedBetSlip = (slipIndex: number, amount: string, notes?: string) => {
    setSavedBetSlips(prev => 
      prev.map((slip, index) => 
        index === slipIndex 
          ? { ...slip, amount, notes }
          : slip
      )
    );
  };

  const deleteSavedBetSlip = (slipIndex: number) => {
    setSavedBetSlips(prev => prev.filter((_, index) => index !== slipIndex));
  };

  return (
    <BetSlipContext.Provider value={{
      betSlip,
      setBetSlip,
      addToBetSlip,
      removeFromBetSlip,
      clearBetSlip,
      savedBetSlips,
      addSavedBetSlip,
      markBetSlipResult,
      markIndividualBetResult,
      editSavedBetSlip,
      deleteSavedBetSlip,
    }}>
      {children}
    </BetSlipContext.Provider>
  );
}
