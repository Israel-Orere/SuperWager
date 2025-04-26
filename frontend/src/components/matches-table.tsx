"use client";

import FootballPitchIcon from "@/assets/svgs/football-pitch";
import GreaterThanIcon from "@/assets/svgs/greater-than";
import { BettingSlip, useBettingSlips } from "@/context/useBettingSlips";
import { useMatches } from "@/context/useMatchesContext";
import { leagues } from "@/utils/constant";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Loader from "./loader";

export default function MatchesTable() {
  const router = useRouter();

  const { isError, isLoading, league, matches, prev, next, scores } =
    useMatches();

  const {
    addSlip,
    removeSlip,
    slips,
    hasPoolStarted,
    setPoolId,
    hasEnteredPool,
  } = useBettingSlips();

  const addToSlip = (match: BettingSlip) => {
    if (hasPoolStarted && hasEnteredPool) {
      toast.error("You cannot make changes to the pool");
      return;
    }

    if (
      slips.some(
        (s) => s.homeTeam === match.homeTeam && s.awayTeam === match.awayTeam
      )
    ) {
      toast.error("Match already in slip");
      return;
    }

    addSlip(match);
  };

  const removeFromSlip = (slip: Partial<BettingSlip>) => {
    if (hasPoolStarted) {
      toast.error("You cannot make changes to the pool");
      return;
    }

    removeSlip(slip as BettingSlip);
  };

  const createSlip = () => {
    if (!slips.length) {
      toast.error("No matches in slip");
      return;
    }

    setPoolId(Date.now().toString());

    toast.success("Slip successfully created");

    router.push("/betting-slips");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <h2 className="text-4xl">Football</h2>

        <button
          onClick={createSlip}
          className="text-lg font-normal bg-[var(--primary)] rounded-lg py-3 px-4 text-white capitalize hover:bg-[var(--primary)]/80"
        >
          Create Slip
        </button>
      </div>
      <div className="flex items-center justify-center gap-8">
        <span
          className="cursor-pointer p-1 rounded-full hover:bg-[var(--primary-light)]"
          onClick={prev}
        >
          <ArrowLeft className="size-6 stroke-[var(--primary)]" />
        </span>
        <p className="text-xl font-semibold">{leagues[league].title}</p>
        <span
          className="cursor-pointer p-1 rounded-full hover:bg-[var(--primary-light)]"
          onClick={next}
        >
          <ArrowRight className="size-6 stroke-[var(--primary)]" />
        </span>
      </div>
      {/* <div className="flex w-full">
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
          onClick={() => handleTabClick("live")}
        >
          <p
            className={`text-xl ${
              activeTab === "live" ? "text-[var(--primary)]" : ""
            }`}
          >
            Live Matches{" "}
            <span className="text-[#33ff40]">
              
            </span>
          </p>
          {activeTab === "live" && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--primary)] transition-transform duration-300 transform translate-y-0" />
          )}
        </div>
        <div
          className="flex-1 flex items-center justify-center relative p-4 cursor-pointer hover:bg-[var(--primary-light)]"
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
      </div> */}
      {isLoading && (
        <div className="w-full p-8 flex items-center justify-center">
          <Loader />
        </div>
      )}

      {isError && (
        <div className="w-full p-8 flex items-center justify-center">
          <p className="text-xl font-medium text-red-600">
            Error fetching the table data
          </p>
        </div>
      )}

      <div>
        {matches.map((match, i) => (
          <div
            key={match.id}
            className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center justify-center">
                <p className="flex flex-col items-center justify-center gap-1 w-20">
                  {new Date(match.commence_time) < new Date() ? (
                    <span className="size-2 rounded-full bg-[#32ff40]" />
                  ) : (
                    <>
                      <span>
                        {new Date(match.commence_time).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </span>
                      <span>
                        {`${new Date(match.commence_time)
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${new Date(match.commence_time)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`}
                      </span>
                    </>
                  )}
                </p>
              </div>
              <div className="text-xl flex flex-col gap-2 justify-center">
                <span>{match.home_team}</span>
                <span>{match.away_team}</span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-xl flex flex-col gap-2 items-center justify-center">
                <span>
                  {scores[i].scores?.find(
                    (item) => item.name === match.home_team
                  )?.score || "-"}
                </span>
                <span>
                  {scores[i].scores?.find(
                    (item) => item.name === match.away_team
                  )?.score || "-"}
                </span>
              </div>
              <span>
                <FootballPitchIcon />
              </span>
              <div className="flex items-center gap-4 [&>div>p:nth-child(2)]:cursor-pointer">
                <div className="flex items-center flex-col gap-1 justify-center">
                  <p className="text-sm">1</p>
                  <p
                    className={`${
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "home"
                      )
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-light)]"
                    } p-2.5 rounded-sm`}
                    onClick={() => {
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "home"
                      )
                        ? removeFromSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            selection: "home",
                          })
                        : addToSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            matchDate: new Date(match.commence_time).toString(),
                            odds: match.bookmakers[0].markets[0].outcomes.find(
                              (outcome) => outcome.name === match.home_team
                            )?.price as number,
                            outcome: "pending",
                            selection: "home",
                          });
                    }}
                  >
                    {match.bookmakers[0].markets[0].outcomes
                      .find((outcome) => outcome.name === match.home_team)
                      ?.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center flex-col gap-1 justify-center">
                  <p className="text-sm">X</p>
                  <p
                    className={`${
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "draw"
                      )
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-light)]"
                    } p-2.5 rounded-sm`}
                    onClick={() => {
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "draw"
                      )
                        ? removeFromSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            selection: "draw",
                          })
                        : addToSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            matchDate: new Date(match.commence_time).toString(),
                            odds: match.bookmakers[0].markets[0].outcomes.find(
                              (outcome) => outcome.name === "Draw"
                            )?.price as number,
                            outcome: "pending",
                            selection: "draw",
                          });
                    }}
                  >
                    {match.bookmakers[0].markets[0].outcomes
                      .find((outcome) => outcome.name === "Draw")
                      ?.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center flex-col gap-1 justify-center">
                  <p className="text-sm">2</p>
                  <p
                    className={`${
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "away"
                      )
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--primary-light)]"
                    } p-2.5 rounded-sm`}
                    onClick={() => {
                      slips.find(
                        (item) =>
                          item.homeTeam === match.home_team &&
                          item.awayTeam === match.away_team &&
                          item.selection === "away"
                      )
                        ? removeFromSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            selection: "away",
                          })
                        : addToSlip({
                            awayTeam: match.away_team,
                            homeTeam: match.home_team,
                            matchDate: new Date(match.commence_time).toString(),
                            odds: match.bookmakers[0].markets[0].outcomes.find(
                              (outcome) => outcome.name === match.away_team
                            )?.price as number,
                            outcome: "pending",
                            selection: "away",
                          });
                    }}
                  >
                    {match.bookmakers[0].markets[0].outcomes
                      .find((outcome) => outcome.name === match.away_team)
                      ?.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="cursor-pointer">
                <GreaterThanIcon />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* <div>
        {activeTab === "live"
          ? matches.liveMatches.map((match) => (
              <div
                key={match.id}
                className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center text-[#32ff40]">
                    <span className="text-base">{match.minute}&apos;</span>
                    <span className="text-sm">
                      {match.minute < 46 ? "1st" : "2nd"}
                    </span>
                  </div>
                  <div className="text-xl flex flex-col gap-2 justify-center">
                    <span>{match.home_team}</span>
                    <span>{match.away_team}</span>
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
                        {match.bookmakers.find((odds) => odds.key === 'betway')?.markets[0].outcomes[0].price.toFixed(2)}
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
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))
          : matches.upcomingMatches.map((match) => (
              <div
                key={match.id}
                className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <p>
                      {`${new Date(match.startTime)
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${new Date(match.startTime)
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`}
                    </p>
                  </div>
                  <div className="text-xl flex flex-col gap-2 justify-center">
                    <span>{match.home_team}</span>
                    <span>{match.away_team}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-xl flex flex-col gap-2 items-center justify-center">
                    <span>-</span>
                    <span>-</span>
                  </div>
                  <span>
                    <FootballPitchIcon />
                  </span>
                  <div className="flex items-center gap-4 [&>div>p:nth-child(2)]:cursor-pointer">
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">1</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "home"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "home"
                          )
                            ? removeFromSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                selection: "home",
                              })
                            : addToSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.bookmakers.find((odds) => odds.key === 'betway')?.markets[0].outcomes[0].price,
                                outcome: "pending",
                                selection: "home",
                              });
                        }}
                      >
                        {match.bookmakers.find((odds) => odds.key === 'betway')?.markets[0].outcomes[0].price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">X</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "draw"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "draw"
                          )
                            ? removeFromSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                selection: "draw",
                              })
                            : addToSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.odds.draw,
                                outcome: "pending",
                                selection: "draw",
                              });
                        }}
                      >
                        {match.odds.draw.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center flex-col gap-1 justify-center">
                      <p className="text-sm">2</p>
                      <p
                        className={`${
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "away"
                          )
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--primary-light)]"
                        } p-2.5 rounded-sm`}
                        onClick={() => {
                          slips.find(
                            (item) =>
                              item.homeTeam === match.home_team &&
                              item.awayTeam === match.away_team &&
                              item.selection === "away"
                          )
                            ? removeFromSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                selection: "away",
                              })
                            : addToSlip({
                                awayTeam: match.away_team,
                                homeTeam: match.home_team,
                                matchDate: new Date(match.startTime).toString(),
                                odds: match.odds.away,
                                outcome: "pending",
                                selection: "away",
                              });
                        }}
                      >
                        {match.odds.away.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="cursor-pointer">
                    <GreaterThanIcon />
                  </span>
                </div>
              </div>
            ))}
      </div> */}
      {/* <div className="flex items-center justify-center mt-6">
        <button
          onClick={createSlip}
          className="text-lg font-normal bg-[var(--primary)] rounded-lg py-3 px-4 text-white capitalize hover:bg-[var(--primary)]/80"
        >
          Create Slip
        </button>
      </div> */}
    </div>
  );
}

export function MiniMatchesTable() {
  const { isError, isLoading, league, matches, prev, next, scores } =
    useMatches();

  return (
    <Link href={"/create-slip"}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-4xl">Football</h2>
        </div>
        <div className="flex items-center justify-center gap-8">
          <span
            className="cursor-pointer p-1 rounded-full hover:bg-[var(--primary-light)]"
            onClick={prev}
          >
            <ArrowLeft className="size-6 stroke-[var(--primary)]" />
          </span>
          <p className="text-xl font-semibold">{leagues[league].title}</p>
          <span
            className="cursor-pointer p-1 rounded-full hover:bg-[var(--primary-light)]"
            onClick={next}
          >
            <ArrowRight className="size-6 stroke-[var(--primary)]" />
          </span>
        </div>

        {isLoading && (
          <div className="w-full p-8 flex items-center justify-center">
            <Loader />
          </div>
        )}

        {isError && (
          <div className="w-full p-8 flex items-center justify-center">
            <p className="text-xl font-medium text-red-600">
              Error fetching the table data
            </p>
          </div>
        )}

        <div>
          {matches.map((match, i) => (
            <div
              key={match.id}
              className="w-full px-8 py-6 border-b border-b-[var(--primary)]/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center justify-center">
                  <p className="flex flex-col items-center justify-center gap-1 w-20">
                    {new Date(match.commence_time) < new Date() ? (
                      <span className="size-2 rounded-full bg-[#32ff40]" />
                    ) : (
                      <>
                        <span>
                          {new Date(match.commence_time).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                            }
                          )}
                        </span>
                        <span>
                          {`${new Date(match.commence_time)
                            .getHours()
                            .toString()
                            .padStart(2, "0")}:${new Date(match.commence_time)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}`}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="text-xl flex flex-col gap-2 justify-center">
                  <span>{match.home_team}</span>
                  <span>{match.away_team}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-xl flex flex-col gap-2 items-center justify-center">
                  <span>
                    {scores[i].scores?.find(
                      (item) => item.name === match.home_team
                    )?.score || "-"}
                  </span>
                  <span>
                    {scores[i].scores?.find(
                      (item) => item.name === match.away_team
                    )?.score || "-"}
                  </span>
                </div>
                <span>
                  <FootballPitchIcon />
                </span>
                <div className="flex items-center gap-4 [&>div>p:nth-child(2)]:cursor-pointer">
                  <div className="flex items-center flex-col gap-1 justify-center">
                    <p className="text-sm">1</p>
                    <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                      {match.bookmakers[0].markets[0].outcomes
                        .find((outcome) => outcome.name === match.home_team)
                        ?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center flex-col gap-1 justify-center">
                    <p className="text-sm">X</p>
                    <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                      {match.bookmakers[0].markets[0].outcomes
                        .find((outcome) => outcome.name === "Draw")
                        ?.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center flex-col gap-1 justify-center">
                    <p className="text-sm">2</p>
                    <p className="bg-[var(--primary-light)] p-2.5 rounded-sm">
                      {match.bookmakers[0].markets[0].outcomes
                        .find((outcome) => outcome.name === match.away_team)
                        ?.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="cursor-pointer">
                  <GreaterThanIcon />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
