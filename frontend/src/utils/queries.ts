"use server";

import axios from "axios";
import { buildMatchesUrl, buildOddsUrl } from "./utils";

export async function fetchMatches(
  season_id: string
): Promise<SportEventSchedule> {
  const res = await axios.get(buildMatchesUrl(season_id), {
    headers: {
      accept: "application/json",
      "x-api-key": process.env.SPORTRADAR_API_KEY,
    },
  });

  return res.data;
}

export async function fetchOdds(tournament_id: string): Promise<SportOddsData> {
  const res = await axios.get(buildOddsUrl(tournament_id), {
    headers: {
      accept: "application/json",
      "x-api-key": process.env.SPORTRADAR_API_KEY,
    },
  });

  return res.data;
}
