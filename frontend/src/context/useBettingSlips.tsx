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
  league_key: LeagueKey;
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
      hasPoolEnded: boolean;
      poolEndDate: string | null;
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
  const [hasPoolEnded, setHasPoolEnded] = useState(false);
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

  useEffect(() => {
    if (hasPoolStarted) return;

    const interval = setInterval(() => {
      if (slips.length === 0) return;

      const hasStarted = slips.some(
        (slip) => new Date(slip.matchDate) <= new Date()
      );

      if (hasStarted && hasEnteredPool) {
        setHasPoolStarted(true);
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [slips, hasEnteredPool]);

  useEffect(() => {
    if (slips.length > 0 && hasEnteredPool) {
      const latestMatchDate = slips.reduce(
        (latest, slip) =>
          new Date(slip.matchDate) > latest ? new Date(slip.matchDate) : latest,
        new Date(0)
      );

      const endDate = new Date(latestMatchDate);
      endDate.setHours(endDate.getHours() + 2);
      setPoolEndDate(endDate.toISOString());
    } else setPoolEndDate(null);
  }, [slips, hasEnteredPool]);

  useEffect(() => {
    if (!poolEndDate) return;

    const checkPoolEnded = () => {
      const now = new Date();
      const endDate = new Date(poolEndDate);

      if (now >= endDate) {
        setHasPoolEnded(true);
        clearInterval(intervalId);
      }
    };

    checkPoolEnded();

    const intervalId = setInterval(checkPoolEnded, 5000);

    return () => clearInterval(intervalId);
  }, [poolEndDate]);

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
        hasPoolEnded,
        poolEndDate,
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
