"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface BettingSlip {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  selection: "home" | "away" | "draw";
  odds: number;
  outcome: "pending" | "won" | "lost";
}

export type BettingSlips = { id: string; slip: BettingSlip[] };

const BettingSlipsContext = createContext<
  | {
      slips: BettingSlips[];
      addSlip: (slip: BettingSlips) => void;
      removeSlip: (id: string) => void;
      updateSlip: (id: string, updatedSlip: BettingSlips) => void;
    }
  | undefined
>(undefined);

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [slips, setSlips] = useState<BettingSlips[]>([]);

  const addSlip = (slip: BettingSlips) => {
    setSlips((prevSlips) => [...prevSlips, slip]);
  };

  const removeSlip = (id: string) => {
    setSlips((prevSlips) => prevSlips.filter((slip) => slip.id !== id));
  };

  const updateSlip = (id: string, updatedSlip: BettingSlips) => {
    setSlips((prevSlips) =>
      prevSlips.map((slip) => (slip.id === id ? updatedSlip : slip))
    );
  };

  return (
    <BettingSlipsContext.Provider
      value={{ slips, addSlip, removeSlip, updateSlip }}
    >
      {children}
    </BettingSlipsContext.Provider>
  );
};

export const useBettingSlips = () => {
  const context = useContext(BettingSlipsContext);
  if (!context) {
    throw new Error(
      "useBettingSlips must be used within a BettingSlipsProvider"
    );
  }
  return context;
};
