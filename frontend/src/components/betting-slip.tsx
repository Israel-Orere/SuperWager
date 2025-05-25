"use client";
import PoolEntry from '@/blockchain/contracts/components/PoolEntry';
import PoolRewards from '@/blockchain/contracts/components/PoolRewards';
import { toast } from "sonner";
import GreaterThan from "@/assets/svgs/double-greaterthan";
import LessThan from "@/assets/svgs/double-lessthan";
import { useBettingSlips } from "@/context/useBettingSlips";
import { fetchMatches } from "@/utils/queries";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
// import { toast } from "sonner";
import SlipCard from "./slip-card";

export default function BettingSlip() {
  const router = useRouter();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    hasPoolEnded,
    hasWon,
    setHasEnteredPool,
    removeSlip,
    updateSlipStatus,
    updateGameOutcome,
    resetSlip,
  } = useBettingSlips();

  const [showEnterPoolModal, setShowEnterPoolModal] = useState(false);

  const [betslipLeagues, setBetslipLeagues] = useState<string[]>([]);

  useEffect(() => {
    if (slips)
      setBetslipLeagues([...new Set(slips.map((slip) => slip.league_key))]);
  }, [slips]);

  const { data: scoresData = [] } = useQuery({
    queryKey: ["scores", betslipLeagues],
    queryFn: async () => {
      const results = await Promise.all(
        betslipLeagues.map((league) => fetchMatches(league))
      );

      const flattedResult = results.map((res) => res.schedules).flat();

      const slipMatches = slips
        .map((slip) =>
          flattedResult.find(
            (match) =>
              match.sport_event.competitors[0].name === slip.homeTeam &&
              match.sport_event.competitors[1].name === slip.awayTeam
          )
        )
        .filter(Boolean) as Schedule[];

      return slipMatches;
    },
    refetchOnWindowFocus: true,
    // staleTime: 10000,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!scoresData?.length || hasPoolEnded) return;

    const checkPoolEnded = () => {
      const hasPoolEnded = scoresData.every(
        (match) => match?.sport_event_status.match_status === "ended"
      );

      if (hasPoolEnded) {
        updateSlipStatus(hasPoolEnded);
        clearInterval(intervalId);
      }
    };

    checkPoolEnded();
    const intervalId = setInterval(checkPoolEnded, 5000);
    return () => clearInterval(intervalId);
  }, [scoresData, hasPoolEnded]);

  useEffect(() => {
    if (!(hasPoolEnded && hasWon === "pending" && slips)) return;

    resetSlip();
  }, [hasPoolEnded, hasWon, slips]);

  useEffect(() => {
    if (!hasPoolEnded) return;

    setShowConfetti(hasPoolEnded && hasWon === "won");
  }, [hasPoolEnded, hasWon]);

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
          <div className="absolute inset-0 bg-black/50" onClick={() => resetSlip()} />
          <div className="bg-white rounded-[20px] p-10 relative flex flex-col items-center justify-center gap-10">
            <PoolRewards 
              hasWon={hasWon} 
              onClose={resetSlip} 
            />
          </div>
        </div>
      )}
      {showEnterPoolModal && (
        <div className="fixed inset-0 items-center justify-center flex z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowEnterPoolModal(false)} />
          <div className="bg-white rounded-[20px] p-10 relative flex flex-col items-center justify-center gap-10">
            <PoolEntry 
              onSuccess={() => {
                setHasEnteredPool(true);
                toast.success("You have entered the pool");
                setShowEnterPoolModal(false);
                localStorage.setItem(
                  "game",
                  JSON.stringify({
                    slips,
                    poolId,
                    hasEnteredPool: true,
                    hasPoolStarted,
                    hasPoolEnded,
                    hasWon,
                  })
                );
              }}
              onError={(error) => {
                toast.error(error);
              }}
            />
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
            <SlipCard
              key={i}
              idx={i}
              game={game}
              hasPoolStarted={hasPoolStarted}
              removeSlip={removeSlip}
              updateGameOutcome={updateGameOutcome}
              scoresData={scoresData}
            />
          ))}
        </div>
      </div>
    </>
  );
}
