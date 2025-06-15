
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

interface BetSlipContextProps {
  betSlip: Bet[];
  setBetSlip: React.Dispatch<React.SetStateAction<Bet[]>>;
  addToBetSlip: (bet: Bet) => void;
  removeFromBetSlip: (betId: string) => void;
  clearBetSlip: () => void;

  savedBetSlips: { bets: Bet[]; amount: string; timestamp: number }[];
  addSavedBetSlip: (bets: Bet[], amount: string) => void;
}

const BetSlipContext = createContext<BetSlipContextProps | undefined>(undefined);

export function useBetSlipContext() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlipContext must be used within BetSlipProvider");
  return ctx;
}

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [betSlip, setBetSlip] = useState<Bet[]>([]);
  const [savedBetSlips, setSavedBetSlips] = useState<{ bets: Bet[]; amount: string; timestamp: number }[]>([]);

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
      { bets: bets, amount, timestamp: Date.now() }
    ]);
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
    }}>
      {children}
    </BetSlipContext.Provider>
  );
}
