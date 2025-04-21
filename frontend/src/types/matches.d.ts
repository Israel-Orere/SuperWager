interface MatchesType {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  link: string | null;
  sid: string | null;
  markets: Market[];
}

interface Market {
  key: string;
  last_update: string;
  link: string | null;
  sid: string | null;
  outcomes: Outcome[];
}

interface Outcome {
  name: string;
  price: number;
  link: string | null;
  sid: string | null;
  bet_limit: number | null;
}
