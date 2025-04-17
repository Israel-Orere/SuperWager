"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface BettingSlip {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  selection: "home" | "away" | "draw";
  odds: number;
  outcome: "pending" | "won" | "lost";
}

const BettingSlipsContext = createContext<
  | {
      slips: BettingSlip[];
      addSlip: (slip: BettingSlip) => void;
      removeSlip: (slip: BettingSlip) => void;
      updateSlip: (index: number, updatedSlip: BettingSlip) => void;
      hasEnteredPool: boolean;
      hasPoolStarted: boolean;
      poolId: string | null;
      setHasEnteredPool: React.Dispatch<React.SetStateAction<boolean>>;
      setPoolId: React.Dispatch<React.SetStateAction<string | null>>;
      setHasPoolStarted: React.Dispatch<React.SetStateAction<boolean>>;
    }
  | undefined
>(undefined);

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [slips, setSlips] = useState<BettingSlip[]>([]);
  const [hasEnteredPool, setHasEnteredPool] = useState(false);
  const [poolId, setPoolId] = useState<string | null>(null);
  const [hasPoolStarted, setHasPoolStarted] = useState(false);
  const [poolEndDate, setPoolEndDate] = useState<string | null>(null);

  const addSlip = (slip: BettingSlip) => {
    setSlips((prevSlips) => [
      ...prevSlips,
      { ...slip, matchDate: new Date(slip.matchDate).toISOString() },
    ]);
  };

  const removeSlip = (slip: Partial<BettingSlip>) => {
    const updatedSlips = slips.filter(
      (s) =>
        s.homeTeam !== slip.homeTeam &&
        s.awayTeam !== slip.awayTeam &&
        s.odds !== slip.odds
    );

    setSlips(updatedSlips);

    if (updatedSlips.length === 0) {
      setPoolId(null);
      setHasEnteredPool(false);
    }
  };

  const updateSlip = (index: number, updatedSlip: BettingSlip) => {
    setSlips((prevSlips) =>
      prevSlips.map((slip, i) => (i === index ? updatedSlip : slip))
    );
  };

  useEffect(() => {}, []);

  return (
    <BettingSlipsContext.Provider
      value={{
        slips,
        addSlip,
        removeSlip,
        updateSlip,
        hasEnteredPool,
        hasPoolStarted,
        poolId,
        setHasEnteredPool,
        setPoolId,
        setHasPoolStarted,
      }}
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
