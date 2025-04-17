"use client";

import soccer from "@/assets/images/soccer.png";
import CancelXIcon from "@/assets/svgs/cancel-x";
import EditIcon from "@/assets/svgs/edit-icon";
import PendingIcon from "@/assets/svgs/pending";
import { useBettingSlips } from "@/context/useBettingSlips";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BettingSlip() {
  const router = useRouter();

  const {
    slips,
    poolId,
    hasEnteredPool,
    hasPoolStarted,
    setHasEnteredPool,
    removeSlip,
  } = useBettingSlips();

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
              Total Odds: {slips.reduce((acc, slip) => acc + slip.odds, 0)}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              if (hasEnteredPool) router.push("/create-slip?tab=upcoming");
              else {
                setHasEnteredPool(true);
                toast.success("You have entered the pool");
              }
            }}
            className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80"
          >
            {!hasEnteredPool ? "Enter Pool" : "Edit Slip"}
          </button>
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
                <p>
                  {new Date(game.matchDate)
                    .toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })
                    .replace(/(\d+)$/, (num) => {
                      const lastDigit = +num % 10;
                      const lastTwoDigits = +num % 100;
                      if (lastTwoDigits >= 11 && lastTwoDigits <= 13)
                        return num + "th";
                      if (lastDigit === 1) return num + "st";
                      if (lastDigit === 2) return num + "nd";
                      if (lastDigit === 3) return num + "rd";
                      return num + "th";
                    })}
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
                    <PendingIcon />
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-8">
                <div className="flex gap-16 justify-between w-64">
                  <p>{game.homeTeam}</p>
                  <p>-</p>
                </div>
                <div className="flex gap-16 justify-between w-64">
                  <p>{game.awayTeam}</p>
                  <p>-</p>
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

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => router.push("/create-slip?tab=upcoming")}
          className="text-lg font-normal border-[2px] border-[var(--primary)] text-[var(--primary)] bg-white rounded-lg py-3.5 px-4 capitalize hover:bg-white/80"
        >
          Add game
        </button>
        {!hasEnteredPool && (
          <button className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80">
            Enter Pool
          </button>
        )}
      </div>
    </div>
  );
}
