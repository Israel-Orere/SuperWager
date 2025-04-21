type LeagueTitle = "EPL" | "La Liga" | "Serie A" | "Bundesliga" | "Ligue 1";
type LeagueKey =
  | "soccer_epl"
  | "soccer_spain_la_liga"
  | "soccer_italy_serie_a"
  | "soccer_germany_bundesliga"
  | "soccer_france_ligue_one";

type League = {
  title: LeagueTitle;
  key: LeagueKey;
};
