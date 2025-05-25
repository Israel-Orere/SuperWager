"use client";

import GreaterThan from "@/assets/svgs/double-greaterthan";
import LessThan from "@/assets/svgs/double-lessthan";
import { useAuthModal } from "@/context/AuthModalContext";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

const mockData = [
  {
    name: "Alex Smith",
    totalOdds: { odds: 10, points: 1.5 },
    accuracy: { accuracy: 1.5, points: 5.2 },
    totalPoints: 7.5,
  },
  {
    name: "Jordan Johnson",
    totalOdds: { odds: 8, points: 2.0 },
    accuracy: { accuracy: 2.0, points: 4.8 },
    totalPoints: 6.8,
  },
  {
    name: "Taylor Williams",
    totalOdds: { odds: 12, points: 1.2 },
    accuracy: { accuracy: 1.8, points: 5.0 },
    totalPoints: 6.2,
  },
  {
    name: "Morgan Brown",
    totalOdds: { odds: 7, points: 2.2 },
    accuracy: { accuracy: 1.2, points: 3.5 },
    totalPoints: 5.7,
  },
  {
    name: "Riley Davis",
    totalOdds: { odds: 9, points: 1.8 },
    accuracy: { accuracy: 1.0, points: 3.0 },
    totalPoints: 4.8,
  },
  {
    name: "Caseth Lee",
    totalOdds: { odds: 11, points: 1.3 },
    accuracy: { accuracy: 0.8, points: 2.5 },
    totalPoints: 3.8,
  },
  {
    name: "Jamie Taylor",
    totalOdds: { odds: 6, points: 2.5 },
    accuracy: { accuracy: 0.5, points: 1.2 },
    totalPoints: 3.7,
  },
  {
    name: "Dakota Rodriguez",
    totalOdds: { odds: 5, points: 3.0 },
    accuracy: { accuracy: 0.3, points: 0.8 },
    totalPoints: 3.8,
  },
  {
    name: "Sam Wilson",
    totalOdds: { odds: 13, points: 1.6 },
    accuracy: { accuracy: 1.3, points: 2.0 },
    totalPoints: 3.6,
  },
  {
    name: "Casey Martinez",
    totalOdds: { odds: 9, points: 1.4 },
    accuracy: { accuracy: 0.9, points: 2.1 },
    totalPoints: 3.5,
  },
  {
    name: "Terry Johnson",
    totalOdds: { odds: 7, points: 1.7 },
    accuracy: { accuracy: 0.7, points: 1.7 },
    totalPoints: 3.4,
  },
  {
    name: "Robin Ahmed",
    totalOdds: { odds: 8, points: 1.5 },
    accuracy: { accuracy: 0.8, points: 1.8 },
    totalPoints: 3.3,
  },
  {
    name: "Avery Thompson",
    totalOdds: { odds: 10, points: 1.1 },
    accuracy: { accuracy: 1.0, points: 2.1 },
    totalPoints: 3.2,
  },
  {
    name: "Jordan Smith",
    totalOdds: { odds: 6, points: 1.3 },
    accuracy: { accuracy: 0.6, points: 1.8 },
    totalPoints: 3.1,
  },
  {
    name: "Quinn Jones",
    totalOdds: { odds: 5, points: 1.8 },
    accuracy: { accuracy: 0.5, points: 1.2 },
    totalPoints: 3.0,
  },
];

type LeaderboardData = typeof mockData;

const simulateUpdates = (
  data: LeaderboardData,
  updateCallback: React.Dispatch<React.SetStateAction<LeaderboardData>>,
  displayCount: number
) =>
  setInterval(() => {
    const updatedData: LeaderboardData = JSON.parse(JSON.stringify(data));

    updatedData.forEach((player) => {
      if (Math.random() > 0.7) {
        player.totalOdds.points = Math.max(
          0,
          player.totalOdds.points + (Math.random() * 0.5 - 0.25)
        );

        player.accuracy.points = Math.max(
          0,
          player.accuracy.points + (Math.random() * 0.5 - 0.25)
        );

        player.totalPoints = player.totalOdds.points + player.accuracy.points;
      }
    });

    updatedData.sort((a, b) => b.totalPoints - a.totalPoints);

    updateCallback(updatedData.slice(0, displayCount));
  }, 5000);

export default function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData>([]);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const { openModal } = useAuthModal();
  const { authenticated } = usePrivy();

  const displayCount = showFullLeaderboard ? mockData.length : 5;

  useEffect(() => {
    setLeaderboardData(mockData.slice(0, displayCount));

    const intervalId = simulateUpdates(mockData, setLeaderboardData, displayCount);
    return () => clearInterval(intervalId);
  }, [displayCount]);

  const handleViewFullLeaderboard = () => {
    if (authenticated) {
      setShowFullLeaderboard(true);
    } else {
      openModal();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 bg-[var(--primary-light)] p-6 md:px-8 rounded-2xl">
      <div className="w-full items-center flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-center">
            <h2 className="text-3xl font-normal">
              {showFullLeaderboard ? "Complete Leaderboard" : "Weekly Leaderboard"}
            </h2>
            <p className="text-[#32FF40] text-2xl">2D: 06H: 37M: 12S</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-2">
              <span className="size-2.5 bg-[#32ff40] rounded-full" />
              <span>Total Players: 1,879</span>
            </p>
            <p>Updated 1 hour ago</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-xl font-normal">Pool (STT)</h4>
          <div className="flex items-center justify-center gap-4">
            <LessThan className="size-6 cursor-pointer" />
            <h4 className="text-2xl font-normal">0.1</h4>
            <GreaterThan className="size-6 cursor-pointer" />
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2 font-normal text-center">Position</th>
            <th className="p-2 font-normal text-center">Players</th>
            <th className="p-2 font-normal text-center">
              Odds Won <span className="text-black/50">(Point)</span>
            </th>
            <th className="p-2 font-normal text-center">
              Accuracy <span className="text-black/50">(Point)</span>
            </th>
            <th className="p-2 font-normal text-center">Total Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((player, i) => (
            <tr
              key={i}
              className={`${i == 0 ? "text-[var(--primary)]" : "text-black"}`}
            >
              <td className="p-2 py-4 text-center border-b border-b-[var(--primary)]/30">
                {i + 1}
              </td>
              <td className="p-2 py-4 text-center border-b border-b-[var(--primary)]/30">
                {player.name}
              </td>
              <td className="p-2 py-4 text-center border-b border-b-[var(--primary)]/30">
                {player.totalOdds.odds.toFixed(1)}{" "}
                <span className="text-black/50">
                  ({player.totalOdds.points.toFixed(1)})
                </span>
              </td>
              <td className="p-2 py-4 text-center border-b border-b-[var(--primary)]/30">
                {player.accuracy.accuracy.toFixed(1)}
                <span className="text-black/50">
                  ({player.accuracy.points.toFixed(1)})
                </span>
              </td>
              <td className="p-2 py-4 text-center border-b border-b-[var(--primary)]/30">
                {player.totalPoints.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {!showFullLeaderboard && (
          <button
            onClick={handleViewFullLeaderboard}
            className="text-lg font-normal bg-[var(--primary)] rounded-lg p-3.5 text-white capitalize hover:bg-[var(--primary)]/80"
          >
            See Full Leaderboard
          </button>
        )}
        {showFullLeaderboard && (
          <button
            onClick={() => setShowFullLeaderboard(false)}
            className="text-lg font-normal bg-gray-600 rounded-lg p-3.5 text-white capitalize hover:bg-gray-700"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
}
