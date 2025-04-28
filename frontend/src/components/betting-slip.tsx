"use client";

import soccer from "@/assets/images/soccer.png";
import CancelXIcon from "@/assets/svgs/cancel-x";
import GreaterThan from "@/assets/svgs/double-greaterthan";
import LessThan from "@/assets/svgs/double-lessthan";
import EditIcon from "@/assets/svgs/edit-icon";
import GreenCheckIcon from "@/assets/svgs/green-check";
import PendingIcon from "@/assets/svgs/pending";
import RedXIcon from "@/assets/svgs/red-x";
import { useBettingSlips } from "@/context/useBettingSlips";
import { buildScoresUrl } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Confetti from "react-confetti";

export default function BettingSlip() {
  const router = useRouter();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    setHasEnteredPool,
    removeSlip,
    poolEndDate,
  } = useBettingSlips();

  const [showEnterPoolModal, setShowEnterPoolModal] = useState(false);

  const [betslipLeagues, setBetslipLeagues] = useState<LeagueKey[]>([]);

  useEffect(() => {
    setBetslipLeagues([...new Set(slips.map((slip) => slip.league_key))]);
  }, []);

  const { data: scoresData = [] } = useQuery<ScoresDataType[]>({
    queryKey: ["scores", betslipLeagues],
    queryFn: async () => {
      const results = await Promise.all(
        betslipLeagues.map((league) =>
          axios.get(buildScoresUrl(league, 3)).then((res) => res.data)
        )
      );
      return results.flat();
    },
    // staleTime: 10000,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!poolEndDate) return;

    let hasShown = false;
    const checkPoolEnd = () => {
      console.log(poolEndDate);
      const hasEnded = new Date(poolEndDate).getTime() < Date.now();
      if (hasEnded && !hasShown && hasPoolStarted) {
        setShowConfetti(true);
        toast.success("Pool has ended");
        hasShown = true;
        setTimeout(() => setShowConfetti(false), 5000);
      }
    };

    const interval = setInterval(checkPoolEnd, 1000);
    checkPoolEnd();

    return () => clearInterval(interval);
  }, [poolEndDate]);

  if (!slips.length)
    return (
      <p className="text-center text-2xl font-medium">
        No betting slip available,{" "}
        <Link
          href={"/create-slip?tab=upcoming"}
          className="text-[var(--primary)]"
        >
          Create Slip
        </Link>
      </p>
    );

  return (
    <>
      {showEnterPoolModal && (
        <div className="fixed inset-0 items-center justify-center flex z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="bg-white rounded-[20px] p-10 relative flex flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-6">
              <div className="flex justify-between items-center gap-10">
                <p className="text-3xl">Enter Pool</p>
                <div className="rounded-[10px] gap-5 px-6 py-4 bg-[var(--primary-light)] flex items-center justify-center">
                  <span className="cursor-pointer">
                    <LessThan />
                  </span>
                  <p className="text-2xl">0.1 SST</p>
                  <span className="cursor-pointer">
                    <GreaterThan />
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-3xl">Wallet balance</p>
                <p className="text-2xl">5 STT</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4">
              <p className="text-[var(--primary)] text-2xl flex gap-2 items-center cursor-pointer">
                Fund Wallet
                <span>
                  <Plus className="stroke-[var(--primary)] stroke-2" />
                </span>
              </p>
              <button
                onClick={() => {
                  setHasEnteredPool(true);
                  toast.success("You have entered the pool");
                  setShowEnterPoolModal(false);
                }}
                className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80"
              >
                Choose Pool
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          initialVelocityY={10}
          colors={[
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "#00FFFF",
          ]}
          wind={0.01}
        />
      )}
      <div className="bg-[var(--primary-light)] rounded-2xl py-6 px-8 flex flex-col gap-16">
        <div className="w-full flex justify-between">
          <div className="flex justify-between flex-col">
            <h2 className="text-3xl flex gap-2">
              Betting Slip
              <span className="bg-white py-0.5 px-2.5 text-2xl rounded-[6px] text-black/50">
                {poolId}
              </span>
            </h2>
            <p className="flex gap-6">
              <span>Total Games: {slips.length}</span>
              <span>
                Total Odds:{" "}
                {slips.reduce((acc, slip) => acc + slip.odds, 0).toFixed(2)}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {!hasPoolStarted && (
              <button
                onClick={() => {
                  if (hasEnteredPool) router.push("/create-slip?tab=upcoming");
                  else setShowEnterPoolModal(true);
                }}
                className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80"
              >
                {!hasEnteredPool ? "Enter Pool" : "Edit Slip"}
              </button>
            )}
            <p className="self-end">Pool: 0.1 SST</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {slips.map((game, i) => (
            <div
              className="bg-white/50 p-6 flex flex-col justify-between gap-8 rounded-4xl"
              key={i}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-6">
                  <Image src={soccer} alt="image of a soccerball" />
                  <p className="flex flex-col items-center justify-center gap-1 w-20">
                    {new Date(game.matchDate) <
                    new Date(Date.now() - 2 * 60 * 60 * 1000) ? (
                      "completed"
                    ) : (
                      <>
                        {new Date(game.matchDate) < new Date() ? (
                          <span className="size-2 rounded-full bg-[#32ff40]" />
                        ) : (
                          <>
                            <span>
                              {new Date(game.matchDate)
                                .toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                })
                                .replace(/(\d+)$/, (num) => {
                                  const lastDigit = +num % 10;
                                  const lastTwoDigits = +num % 100;
                                  if (
                                    lastTwoDigits >= 11 &&
                                    lastTwoDigits <= 13
                                  )
                                    return num + "th";
                                  if (lastDigit === 1) return num + "st";
                                  if (lastDigit === 2) return num + "nd";
                                  if (lastDigit === 3) return num + "rd";
                                  return num + "th";
                                })}
                            </span>
                            <span>
                              {`${new Date(game.matchDate)
                                .getHours()
                                .toString()
                                .padStart(2, "0")}:${new Date(game.matchDate)
                                .getMinutes()
                                .toString()
                                .padStart(2, "0")}`}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-16">
                  {!hasPoolStarted && (
                    <>
                      <p
                        className="flex gap-2 text-2xl text-[var(--primary)] cursor-pointer"
                        onClick={() => router.push("/create-slip?tab=upcoming")}
                        title="edit game on slip"
                      >
                        Edit <EditIcon />
                      </p>
                      <span
                        title="remove game from slip"
                        onClick={() => {
                          removeSlip(game);
                        }}
                      >
                        <CancelXIcon className="cursor-pointer" />
                      </span>
                    </>
                  )}
                  {hasPoolStarted && (
                    <>
                      {(() => {
                        const currentScores = scoresData.find(
                          (match) =>
                            match.away_team === game.awayTeam &&
                            match.home_team === game.homeTeam
                        )?.scores;

                        if (!currentScores) return <PendingIcon />;

                        const homeScore = currentScores.find(
                          (item) => item.name === game.homeTeam
                        )?.score as string;

                        const awayScore = currentScores.find(
                          (item) => item.name === game.awayTeam
                        )?.score as string;

                        const selection = game.selection.toLowerCase();
                        const isHomeWin = homeScore > awayScore;
                        const isAwayWin = homeScore < awayScore;
                        const isDraw = homeScore === awayScore;

                        if (
                          (selection === "home" && isHomeWin) ||
                          (selection === "away" && isAwayWin) ||
                          (selection === "draw" && isDraw)
                        )
                          return <GreenCheckIcon />;
                        else return <RedXIcon />;
                      })()}
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-8">
                  <div className="flex gap-16 justify-between w-64">
                    <p>{game.homeTeam}</p>
                    <p>
                      {scoresData
                        .find(
                          (match) =>
                            match.away_team === game.awayTeam &&
                            match.home_team === game.homeTeam
                        )
                        ?.scores?.find((item) => item.name === game.homeTeam)
                        ?.score || "-"}
                    </p>
                  </div>
                  <div className="flex gap-16 justify-between w-64">
                    <p>{game.awayTeam}</p>
                    <p>
                      {scoresData
                        .find(
                          (match) =>
                            match.away_team === game.awayTeam &&
                            match.home_team === game.homeTeam
                        )
                        ?.scores?.find((item) => item.name === game.awayTeam)
                        ?.score || "-"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-16 mt-auto capitalize">
                  <p className="text-xl self-start">{game.selection}</p>
                  <p className="text-xl">{game.odds.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
