"use client";

import Analysis from "@/assets/svgs/analysis";
import FootballPitchIcon from "@/assets/svgs/football-pitch";
import { useEffect, useState } from "react";

const footballMatchesData = {
  liveMatches: [
    {
      id: 1,
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      score: { home: 2, away: 1 },
      odds: { home: 2.1, draw: 3.4, away: 3.2 },
    },
    {
      id: 2,
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      score: { home: 0, away: 0 },
      odds: { home: 2.5, draw: 3.3, away: 2.7 },
    },
    {
      id: 3,
      homeTeam: "Bayern Munich",
      awayTeam: "Dortmund",
      score: { home: 4, away: 0 },
      odds: { home: 1.4, draw: 4.5, away: 7.0 },
    },
  ],
  upcomingMatches: [
    {
      id: 4,
      homeTeam: "Liverpool",
      awayTeam: "Man City",
      odds: { home: 3.1, draw: 3.5, away: 2.2 },
    },
    {
      id: 5,
      homeTeam: "Inter Milan",
      awayTeam: "Juventus",
      odds: { home: 2.3, draw: 3.1, away: 3.2 },
    },
    {
      id: 6,
      homeTeam: "PSG",
      awayTeam: "Marseille",
      odds: { home: 1.5, draw: 4.0, away: 6.0 },
    },
  ],
};

const updateLiveMatches = (matches: typeof footballMatchesData.liveMatches) => {
  return matches.map((match) => {
    if (!match.score) return match;

    const updated = { ...match };

    if (Math.random() < 0.1) {
      const outcome = Math.random();

      if (outcome < 0.4) {
        updated.score.home += 1;
      } else if (outcome < 0.8) {
        updated.score.away += 1;
      }

      updated.odds = {
        home: Math.max(
          1.1,
          +(updated.odds.home * (0.95 + Math.random() * 0.1)).toFixed(2)
        ),
        draw: Math.max(
          1.1,
          +(updated.odds.draw * (0.95 + Math.random() * 0.1)).toFixed(2)
        ),
        away: Math.max(
          1.1,
          +(updated.odds.away * (0.95 + Math.random() * 0.1)).toFixed(2)
        ),
      };
    }

    return updated;
  });
};

export default function MatchesTable() {
  const [activeTab, setActiveTab] = useState<"live" | "upcoming">("live");

  const handleTabClick = (tab: "live" | "upcoming") => {
    setActiveTab(tab);
  };

  const [matches, setMatches] = useState(footballMatchesData);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatches((prev) => ({
        liveMatches: updateLiveMatches(prev.liveMatches),
        upcomingMatches: prev.upcomingMatches,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-4xl">Football</h2>
      <div className="flex w-full">
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)] transition-all duration-300 ease-in-out"
          onClick={() => handleTabClick("live")}
        >
          <p
            className={`text-xl ${
              activeTab === "live" ? "text-[var(--primary)]" : ""
            }`}
          >
            Live Matches{" "}
            <span className="text-[#33ff40]">
              ({matches.liveMatches.length})
            </span>
          </p>
          {activeTab === "live" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)] transition-all duration-300 ease-in-out"
          onClick={() => handleTabClick("upcoming")}
        >
          <p
            className={`text-xl ${
              activeTab === "upcoming" ? "text-[var(--primary)]" : ""
            }`}
          >
            Upcoming Matches
          </p>
          {activeTab === "upcoming" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
      </div>
      <div>
        {activeTab === "live"
          ? matches.liveMatches.map((match) => (
              <div
                key={match.id}
                className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center text-[#32ff40]">
                    <span className="text-base">26&apos;</span>
                    <span className="text-sm">FT</span>
                  </div>
                  <div className="text-xl flex flex-col gap-2 justify-center">
                    <span>{match.homeTeam}</span>
                    <span>{match.awayTeam}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-xl flex flex-col gap-2 items-center justify-center">
                    <span>{match.score.home}</span>
                    <span>{match.score.away}</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.home.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span>
                    <Analysis />
                  </span>
                </div>
              </div>
            ))
          : matches.upcomingMatches.map((match) => (
              <div key={match.id} className="match-card"></div>
            ))}
      </div>
    </div>
  );
}
