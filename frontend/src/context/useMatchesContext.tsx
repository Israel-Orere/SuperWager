"use client";

import { leagues } from "@/utils/constant";
import {
  buildOddsUrl,
  buildOddsWebSocketUrl,
  buildScoresUrl,
} from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useRef, useEffect, useState } from "react";

type MatchesContextType = {
  matches: MatchesType[];
  scores: ScoresDataType[];
  league: number;
  next: () => void;
  prev: () => void;
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  val: any;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

export const MatchesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [league, setLeague] = useState<number>(0);
  const next = () => {
    if (league === leagues.length - 1) setLeague(0);
    else setLeague((prev) => prev + 1);
  };
  const prev = () => {
    if (league === 0) setLeague(leagues.length - 1);
    else setLeague((prev) => prev - 1);
  };

  const {
    data: matches = [],
    isLoading,
    isError,
  } = useQuery<MatchesType[]>({
    queryKey: ["matches", leagues[league].key],
    queryFn: async () =>
      await axios
        .get(buildOddsUrl(leagues[league].key))
        .then((res) => res.data),
  });
  const { data: scores = [] } = useQuery<ScoresDataType[]>({
    queryKey: ["scores", leagues[league].key],
    queryFn: async () =>
      await axios
        .get(buildScoresUrl(leagues[league].key))
        .then((res) => res.data),

    // staleTime: 10000,
  });

  const [isReady, setIsReady] = useState(false);
  const [val, setVal] = useState(null);

  const ws = useRef<WebSocket | null>(null);

  // useEffect(() => {
  //   const socket = new WebSocket(buildOddsWebSocketUrl("soccer_italy_serie_a"));

  //   socket.onopen = () => setIsReady(true);
  //   socket.onclose = () => setIsReady(false);
  //   socket.onmessage = (event) => {
  //     setVal(event.data);
  //     console.log(event);
  //   };

  //   ws.current = socket;

  //   return () => {
  //     socket.close();
  //   };
  // }, []);

  return (
    <MatchesContext.Provider
      value={{
        matches,
        scores,
        league,
        next,
        prev,
        isLoading,
        isError,
        isReady,
        val,
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
};

export const useMatches = () => {
  const context = useContext(MatchesContext);
  if (!context) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }
  return context;
};
