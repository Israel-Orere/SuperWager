"use server";

import axios from "axios";
import { buildMatchesUrl, buildOddsUrl } from "./utils";

// Helper function for waiting
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchMatches(
  season_id: string
): Promise<SportEventSchedule> {
  // Set higher timeout and retry logic
  const instance = axios.create({
    timeout: 30000, // 30 seconds
  });
  
  // Try up to 3 times with exponential backoff
  let attempt = 0;
  const maxAttempts = 3;
  
  while (attempt < maxAttempts) {
    try {
      const res = await instance.get(buildMatchesUrl(season_id), {
        headers: {
          accept: "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_SPORTRADAR_API_KEY,
        },
      });
      return res.data;
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) throw error;
      
      // Wait longer between each retry (exponential backoff)
      await sleep(1000 * Math.pow(2, attempt));
    }
  }
  
  throw new Error("Failed to fetch matches after multiple attempts");
}

export async function fetchOdds(tournament_id: string): Promise<SportOddsData> {
  const res = await axios.get(buildOddsUrl(tournament_id), {
    headers: {
      accept: "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_SPORTRADAR_API_KEY,
    },
  });

  return res.data;
}
