"use client";

import { leagues } from "@/utils/constant";
import { buildOddsUrl, buildScoresUrl } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { createContext, useContext, useState } from "react";

type MatchesContextType = {
  matches: MatchesType[];
  scores: ScoresDataType[];
  league: number;
  next: () => void;
  prev: () => void;
  isLoading: boolean;
  isError: boolean;
  startingDate: string;
  setStartingDate: React.Dispatch<React.SetStateAction<string>>;
  isReady: boolean;
  val: any;
};

const MatchesContext = createContext<MatchesContextType | undefined>(undefined);

const getDateLabel = (date: Date, index: number) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
};

const daysArray = Array.from({ length: 5 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    label: getDateLabel(date, i),
    date: date.toISOString().split("T")[0] + "T00:00:00Z",
  };
});

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

  const [startingDate, setStartingDate] = useState<string>(
    new Date().toISOString().split("T")[0] + "T00:00:00Z"
  );

  const {
    data: matches = [],
    isLoading,
    isError,
    error,
  } = useQuery<MatchesType[]>({
    queryKey: ["matches", leagues[league].key, startingDate],
    queryFn: async () =>
      await axios
        .get(buildOddsUrl(leagues[league].key, startingDate))
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

  // const ws = useRef<WebSocket | null>(null);

  // useEffect(() => {
  //   const socket = new WebSocket(buildOddsWebSocketUrl("soccer_italy_serie_a"));

  //   socket.onopen = () => setIsReady(true);
  //   socket.onclose = () => setIsReady(false);
  //   socket.onmessage = (event) => {
  //     setVal(event.data);
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
        startingDate,
        setStartingDate,
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
