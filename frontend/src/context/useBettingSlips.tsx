"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface BettingSlip {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  selection: "home" | "away" | "draw";
  odds: string;
  outcome: "pending" | "won" | "lost";
  league_key: string;
}

const BettingSlipsContext = createContext<
  | {
      addSlip: (slip: BettingSlip) => void;
      removeSlip: (slip: BettingSlip) => void;
      setHasEnteredPool: (val: boolean) => void;
      setPoolId: (val: string) => void;
      updateGameOutcome: (
        outcome: "pending" | "won" | "lost",
        i: number
      ) => void;
      slips: BettingSlip[];
      hasEnteredPool: boolean;
      hasPoolStarted: boolean;
      poolId: string | null;
      hasPoolEnded: boolean;
      poolEndDate: string | null;
      hasWon: "pending" | "lost" | "won";
    }
  | undefined
>(undefined);

const initialState = {
  slips: [],
  hasEnteredPool: false,
  poolId: null,
  hasPoolStarted: false,
  hasPoolEnded: false,
  poolEndDate: null,
  hasWon: "pending" as "pending" | "lost" | "won",
};

type GameState = {
  slips: BettingSlip[];
  hasEnteredPool: boolean;
  poolId: string | null;
  hasPoolStarted: boolean;
  hasPoolEnded: boolean;
  poolEndDate: string | null;
  hasWon: "pending" | "lost" | "won";
};

export const BettingSlipsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>(initialState);

  const addSlip = (slip: BettingSlip) => {
    setGameState((prev) => ({
      ...prev,
      slips: [
        ...prev.slips,
        { ...slip, matchDate: new Date(slip.matchDate).toISOString() },
      ],
    }));
  };

  const removeSlip = (slip: Partial<BettingSlip>) => {
    const updatedSlips = gameState.slips.filter(
      (s) =>
        s.homeTeam !== slip.homeTeam &&
        s.awayTeam !== slip.awayTeam &&
        s.odds !== slip.odds
    );
    setGameState((prev) => ({
      ...prev,
      slips: updatedSlips,
      poolId: updatedSlips.length === 0 ? null : prev.poolId,
      hasEnteredPool: updatedSlips.length === 0 ? false : prev.hasEnteredPool,
    }));
  };

  const setPoolId = (id: string) => {
    setGameState((prev) => ({ ...prev, poolId: id }));
  };

  const setHasEnteredPool = (val: boolean) => {
    setGameState((prev) => ({ ...prev, hasEnteredPool: val }));
  };

  const updateGameOutcome = (
    outcome: "pending" | "won" | "lost",
    i: number
  ) => {
    setGameState((prev) => ({
      ...prev,
      slips: prev.slips.map((slip, idx) =>
        idx === i ? { ...slip, outcome } : slip
      ),
    }));
  };

  useEffect(() => {
    if (gameState.hasPoolStarted) return;

    const interval = setInterval(() => {
      if (gameState.slips.length === 0) return;
      const hasStarted = gameState.slips.some(
        (slip) => new Date(slip.matchDate) <= new Date()
      );
      if (hasStarted && gameState.hasEnteredPool) {
        setGameState((prev) => ({ ...prev, hasPoolStarted: true }));
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [gameState.slips, gameState.hasEnteredPool, gameState.hasPoolStarted]);

  useEffect(() => {
    if (!gameState.slips.length && !gameState.hasEnteredPool) {
      setGameState((prev) => ({ ...prev, poolEndDate: null }));
      return;
    }

    const latestMatchDate = gameState.slips.reduce(
      (latest, slip) =>
        new Date(slip.matchDate) > latest ? new Date(slip.matchDate) : latest,
      new Date(0)
    );
    const endDate = new Date(latestMatchDate);
    endDate.setHours(endDate.getHours() + 2);
    setGameState((prev) => ({ ...prev, poolEndDate: endDate.toISOString() }));
  }, [gameState.slips, gameState.hasEnteredPool]);

  useEffect(() => {
    if (!gameState.poolEndDate) return;
    const checkPoolEnded = () => {
      const now = new Date();
      const endDate = new Date(gameState.poolEndDate!);
      if (now >= endDate) {
        setGameState((prev) => ({ ...prev, hasPoolEnded: true }));
        clearInterval(intervalId);
      }
    };
    checkPoolEnded();
    const intervalId = setInterval(checkPoolEnded, 5000);
    return () => clearInterval(intervalId);
  }, [gameState.poolEndDate]);

  useEffect(() => {
    if (
      !gameState.hasPoolEnded ||
      gameState.hasWon !== "pending" ||
      gameState.slips.length > 0
    )
      return;

    if (gameState.slips.some((slip) => slip.outcome === "lost")) {
      setGameState((prev) => ({ ...prev, hasWon: "lost" }));
      return;
    }

    if (gameState.slips.every((slip) => slip.outcome === "won")) {
      setGameState((prev) => ({ ...prev, hasWon: "won" }));
      return;
    }
  }, [gameState.hasPoolEnded, gameState.slips, gameState.hasWon]);

  useEffect(() => {
    const storedGameState = localStorage.getItem("game");
    if (storedGameState) setGameState(JSON.parse(storedGameState));
  }, []);

  useEffect(() => {
    localStorage.setItem("game", JSON.stringify(gameState));
  }, [gameState]);

  return (
    <BettingSlipsContext.Provider
      value={{
        addSlip,
        removeSlip,
        setPoolId,
        setHasEnteredPool,
        updateGameOutcome,
        ...gameState,
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
