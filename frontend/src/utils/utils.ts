export const buildOddsUrl = (league_key: LeagueKey) => {
  const baseUrl = `https://api.the-odds-api.com/v4/sports/${league_key}/odds`;

  const params = {
    apiKey: process.env.NEXT_PUBLIC_ODDS_API_KEY as string,
    regions: "uk",
    markets: "h2h,spreads",
    dateFormat: "iso",
    oddsFormat: "decimal",
    commenceTimeFrom: new Date().toISOString().split("T")[0] + "T00:00:00Z",
    commenceTimeTo:
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split(".")[0] + "Z",
    includeLinks: true,
    includeSids: true,
    includeBetLimits: true,
  };

  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${baseUrl}?${queryString}`;
};

export const buildScoresUrl = (league_key: LeagueKey, days: number = 1) =>
  `https://api.the-odds-api.com/v4/sports/${league_key}/scores?apiKey=${process.env.NEXT_PUBLIC_ODDS_API_KEY}&dateFormat=iso`;
