"use client";

import soccer from "@/assets/images/soccer.png";
import CancelXIcon from "@/assets/svgs/cancel-x";
import GreaterThan from "@/assets/svgs/double-greaterthan";
import LessThan from "@/assets/svgs/double-lessthan";
import EditIcon from "@/assets/svgs/edit-icon";
import PendingIcon from "@/assets/svgs/pending";
import { useBettingSlips } from "@/context/useBettingSlips";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const [showEnterPoolModal, setShowEnterPoolModal] = useState(false);

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
                  <p>
                    {new Date(game.matchDate) < new Date() ? (
                      <span className="size-2 rounded-full bg-[#32ff40]" />
                    ) : (
                      new Date(game.matchDate)
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
                        })
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
          {!hasPoolStarted && (
            <button
              onClick={() => router.push("/create-slip?tab=upcoming")}
              className="text-lg font-normal border-[2px] border-[var(--primary)] text-[var(--primary)] bg-white rounded-lg py-3.5 px-4 capitalize hover:bg-white/80"
            >
              Add game
            </button>
          )}
          {!hasEnteredPool && (
            <button className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80">
              Enter Pool
            </button>
          )}
        </div>
      </div>
    </>
  );
}
