export const buildOddsUrl = (league_key: LeagueKey, date: string) => {
  const baseUrl = `https://api.the-odds-api.com/v4/sports/${league_key}/odds`;

  const params = {
    apiKey: process.env.NEXT_PUBLIC_ODDS_API_KEY as string,
    regions: "uk",
    markets: "h2h,spreads",
    dateFormat: "iso",
    oddsFormat: "decimal",
    commenceTimeFrom: new Date(date).toISOString().split("T")[0] + "T00:00:00Z",
    commenceTimeTo:
      new Date(new Date(date).setDate(new Date(date).getDate() + 1))
        .toISOString()
        .split("T")[0] + "T00:00:00Z",
    // new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    //   .toISOString()
    //   .split(".")[0] + "Z",
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
  `https://api.the-odds-api.com/v4/sports/${league_key}/scores?apiKey=${process.env.NEXT_PUBLIC_ODDS_API_KEY}&daysFrom=${days}&dateFormat=iso`;

const getDateLabel = (date: Date, index: number) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleString("en-US", { month: "short", day: "numeric" });
};

export const daysArray = Array.from({ length: 5 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return {
    label: getDateLabel(date, i),
    date: date.toISOString().split("T")[0] + "T00:00:00Z",
  };
});
