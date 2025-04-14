"use client";

import soccer from "@/assets/images/soccer.png";
import CancelXIcon from "@/assets/svgs/cancel-x";
import EditIcon from "@/assets/svgs/edit-icon";
import GreaterThanIcon from "@/assets/svgs/greater-than";
import { useBettingSlips } from "@/context/useBettingSlips";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BettingSlip() {
  // const [slip] = useState([
  //   {
  //     homeTeam: "Arsenal",
  //     awayTeam: "Chelsea",
  //     matchDate: "2023-11-05T17:30:00",
  //     selection: "home",
  //     odds: 2.1,
  //     outcome: "pending",
  //   },
  //   {
  //     homeTeam: "Bayern Munich",
  //     awayTeam: "Dortmund",
  //     matchDate: "2023-11-05T17:30:00",
  //     selection: "away",
  //     odds: 7.0,
  //     outcome: "lost",
  //   },
  //   {
  //     homeTeam: "Inter Milan",
  //     awayTeam: "Juventus",
  //     matchDate: "2023-11-05T19:45:00",
  //     selection: "draw",
  //     odds: 3.1,
  //     outcome: "won",
  //   },
  //   {
  //     homeTeam: "Tottenham",
  //     awayTeam: "Newcastle",
  //     matchDate: "2023-11-05T15:00:00",
  //     selection: "away",
  //     odds: 3.3,
  //     outcome: "won",
  //   },
  //   {
  //     homeTeam: "Atletico Madrid",
  //     awayTeam: "Sevilla",
  //     matchDate: "2023-11-05T20:00:00",
  //     selection: "home",
  //     odds: 1.8,
  //     outcome: "won",
  //   },
  //   {
  //     homeTeam: "Man United",
  //     awayTeam: "Aston Villa",
  //     matchDate: "2023-11-12T15:00:00",
  //     selection: "home",
  //     odds: 1.9,
  //     outcome: "pending",
  //   },
  //   {
  //     homeTeam: "Porto",
  //     awayTeam: "Benfica",
  //     matchDate: "2023-11-11T20:30:00",
  //     selection: "draw",
  //     odds: 3.1,
  //     outcome: "pending",
  //   },
  //   {
  //     homeTeam: "Barcelona",
  //     awayTeam: "Real Madrid",
  //     matchDate: "2023-11-05T20:00:00",
  //     selection: "draw",
  //     odds: 3.3,
  //     outcome: "lost",
  //   },
  //   {
  //     homeTeam: "PSG",
  //     awayTeam: "Marseille",
  //     matchDate: "2023-11-05T20:00:00",
  //     selection: "home",
  //     odds: 1.5,
  //     outcome: "won",
  //   },
  //   {
  //     homeTeam: "Barcelona",
  //     awayTeam: "Real Madrid",
  //     matchDate: "2023-11-05T20:00:00",
  //     selection: "draw",
  //     odds: 3.3,
  //     outcome: "lost",
  //   },
  //   {
  //     homeTeam: "PSG",
  //     awayTeam: "Marseille",
  //     matchDate: "2023-11-05T20:00:00",
  //     selection: "home",
  //     odds: 1.5,
  //     outcome: "won",
  //   },
  // ]);

  // const hasStarted = slip.some((game) => new Date(game.matchDate) < new Date());

  const { slips } = useBettingSlips();
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const showSlip = (i: number) => {
    if (i === activeTab) {
      setActiveTab(null);
      return;
    }

    setActiveTab(i);
  };

  if (!slips.length)
    return (
      <p className="text-center text-2xl font-medium">
        No betting slips available,{" "}
        <Link href={"/create-slip"} className="text-[var(--primary)]">
          Create Slip
        </Link>
      </p>
    );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Your Slips ( {slips.length} )</h1>

      <div className="flex flex-col gap-8">
        {slips.map(({ slip, id }, i) => (
          <div
            key={id}
            className="bg-[var(--primary-light)] rounded-2xl py-6 px-8 cursor-pointer flex flex-col gap-8"
            onClick={() => showSlip(i)}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-3xl flex gap-2">
                Betting Slip
                <span className="bg-white py-0.5 px-2.5 text-2xl rounded-[6px] text-black/50">
                  {id}
                </span>
              </h2>

              <GreaterThanIcon
                className={`${activeTab === i ? "rotate-270" : "rotate-90"}`}
              />
            </div>

            {activeTab === i && (
              <div className="flex flex-col gap-16">
                <div className="flex items-center justify-between gap-4">
                  <p className="flex gap-4">
                    <span>Total Games: {slip.length}</span>
                    <span>
                      Total Odds:{" "}
                      {slip
                        .reduce((acc, game) => acc + game.odds, 1)
                        .toFixed(2)}
                    </span>
                  </p>

                  <p className="self-end">Pool: 5 USDT</p>
                </div>

                <div className="flex flex-col gap-6">
                  {slip.map((game, i) => (
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
                          <p className="flex gap-2 text-2xl text-[var(--primary)]">
                            Edit <EditIcon className="cursor-pointer" />
                          </p>
                          <CancelXIcon className="cursor-pointer" />
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
              </div>
            )}
          </div>
        ))}

        {/* <div className="bg-[var(--primary-light)] rounded-2xl py-6 px-8 flex flex-col gap-16">
          <div className="w-full flex justify-between">
            <div className="flex justify-between flex-col">
              <h2 className="text-3xl flex gap-2">
                Betting Slip
                <span className="bg-white py-0.5 px-2.5 text-2xl rounded-[6px] text-black/50">
                  {slip.length}
                </span>
              </h2>
              <p className="flex gap-6">
                <span>Total Games: 12</span>
                <span>Total Odds: 30</span>
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80">
                Enter Pool
              </button>
              <p className="self-end">Pool: 5 USDT</p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {slip.map((game, i) => (
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
                    <p className="flex gap-2 text-2xl text-[var(--primary)]">
                      Edit <EditIcon className="cursor-pointer" />
                    </p>
                    <CancelXIcon className="cursor-pointer" />
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
            <button className="text-lg font-normal border-[2px] border-[var(--primary)] text-[var(--primary)] bg-white rounded-lg py-3.5 px-4 capitalize hover:bg-white/80">
              Add game
            </button>
            <button className="text-lg font-normal bg-[var(--primary)] rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80">
              Enter Pool
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
