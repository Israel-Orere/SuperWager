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
import { fetchMatches } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { toast } from "sonner";

export default function BettingSlip() {
  const router = useRouter();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    hasPoolEnded,
    poolEndDate,
    hasWon,
    setHasEnteredPool,
    removeSlip,
    updateGameOutcome,
  } = useBettingSlips();

  const [showEnterPoolModal, setShowEnterPoolModal] = useState(false);

  const [betslipLeagues, setBetslipLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (slips)
      setBetslipLeagues([...new Set(slips.map((slip) => slip.league_key))]);
  }, [slips]);

  const { data: scoresData } = useQuery({
    queryKey: ["scores", betslipLeagues],
    queryFn: async () => {
      const results = await Promise.all(
        betslipLeagues.map((league) => fetchMatches(league))
      );

      return results.map((res) => res.schedules).flat();
    },
    refetchOnWindowFocus: true,
    // staleTime: 10000,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!poolEndDate || !hasPoolEnded) return;

    setShowConfetti(!!poolEndDate && hasPoolEnded && hasWon === "won");
  }, [poolEndDate, hasPoolEnded, hasWon]);

  if (!slips.length)
    return (
      <p className="text-center text-2xl font-medium">
        No betting slip available,{" "}
        <Link href={"/create-slip"} className="text-[var(--primary)]">
          Create Slip
        </Link>
      </p>
    );

  return (
    <>
      {hasWon !== "pending" && (
        <div className="fixed inset-0 items-center justify-center flex z-50">
          <div className="absolute inset-0 bg-black/50" />
          <div className="bg-white rounded-[20px] p-10 relative flex flex-col items-center justify-center gap-10">
            <p className="text-xl font-semibold">
              You {hasWon === "lost" ? "Lose" : "Won"}
            </p>
          </div>
        </div>
      )}
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
                  localStorage.setItem(
                    "game",
                    JSON.stringify({
                      slips,
                      poolId,
                      hasEnteredPool,
                      hasPoolStarted,
                      hasPoolEnded,
                      poolEndDate,
                      hasWon,
                    })
                  );
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
                {slips
                  .reduce((acc, slip) => acc + parseFloat(slip.odds), 0)
                  .toFixed(2)}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {!hasPoolStarted && (
              <button
                onClick={() => {
                  if (hasEnteredPool) router.push("/create-slip");
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
                    {(() => {
                      const match = scoresData?.find(
                        (match) =>
                          match.sport_event.competitors[1].name ===
                            game.awayTeam &&
                          match.sport_event.competitors[0].name ===
                            game.homeTeam
                      );

                      if (!match) return "";

                      if (match.sport_event_status.match_status === "ended")
                        return "FT";
                      if (match.sport_event_status.status === "live")
                        return (
                          <>
                            <span className="text-[#32FF40]">
                              {match.sport_event_status.clock?.played}
                            </span>
                            <span className="capitalize text-[#32FF40]">
                              {match.sport_event_status.match_status ===
                              "1st_half"
                                ? "1st"
                                : match.sport_event_status.match_status ===
                                  "halftime"
                                ? "HT"
                                : "2nd"}
                            </span>
                          </>
                        );

                      return (
                        <>
                          <span>
                            {new Date(
                              match.sport_event.start_time
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            })}
                          </span>
                          <span>
                            {`${new Date(match.sport_event.start_time)
                              .getHours()
                              .toString()
                              .padStart(2, "0")}:${new Date(
                              match.sport_event.start_time
                            )
                              .getMinutes()
                              .toString()
                              .padStart(2, "0")}`}
                          </span>
                        </>
                      );
                    })()}
                  </p>
                </div>
                <div className="flex gap-16">
                  {hasPoolStarted ? (
                    <span>
                      {(() => {
                        const match = scoresData?.find(
                          (match) =>
                            match.sport_event.competitors[1].name ===
                              game.awayTeam &&
                            match.sport_event.competitors[0].name ===
                              game.homeTeam
                        );

                        if (!match) return <PendingIcon />;

                        if (new Date(match.sport_event.start_time) > new Date())
                          return <PendingIcon />;

                        const homeScore = match.sport_event_status
                          .home_score as number;
                        const awayScore = match.sport_event_status
                          .away_score as number;

                        const selection = game.selection.toLowerCase();
                        const isHomeWin = homeScore > awayScore;
                        const isAwayWin = homeScore < awayScore;
                        const isDraw = homeScore === awayScore;

                        if (
                          (selection === "home" && isHomeWin) ||
                          (selection === "away" && isAwayWin) ||
                          (selection === "draw" && isDraw)
                        ) {
                          // updateGameOutcome("won", i);
                          return <GreenCheckIcon />;
                        } else {
                          // updateGameOutcome("lost", i);
                          return <RedXIcon />;
                        }
                      })()}
                    </span>
                  ) : (
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
                </div>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-8">
                  <div className="flex gap-16 justify-between w-64">
                    <p>{game.homeTeam}</p>
                    <p>
                      {scoresData?.find(
                        (match) =>
                          match.sport_event.competitors[1].name ===
                            game.awayTeam &&
                          match.sport_event.competitors[0].name ===
                            game.homeTeam
                      )?.sport_event_status.home_score ?? "-"}
                    </p>
                  </div>
                  <div className="flex gap-16 justify-between w-64">
                    <p>{game.awayTeam}</p>
                    <p>
                      {scoresData?.find(
                        (match) =>
                          match.sport_event.competitors[1].name ===
                            game.awayTeam &&
                          match.sport_event.competitors[0].name ===
                            game.homeTeam
                      )?.sport_event_status.away_score ?? "-"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-16 mt-auto capitalize">
                  <p className="text-xl self-start">{game.selection}</p>
                  <p className="text-xl">{parseFloat(game.odds).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
