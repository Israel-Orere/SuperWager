type MatchOutcome = "pending" | "won" | "lost";
type MatchSelection = "home" | "away" | "draw";

interface BettingSlip {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  selection: MatchSelection;
  odds: string;
  outcome: MatchOutcome;
  league_key: string;
}

interface SportEventSchedule {
  schedules: Schedule[];
}

interface Schedule {
  sport_event: {
    id: string;
    start_time: string;
    start_time_confirmed: boolean;
    competitors: { name: string }[];
  };
  sport_event_status: {
    status: string;
    match_status: string;
    home_score?: number;
    away_score?: number;
    clock?: { played: string };
  };
}

interface SportOddsData {
  sport_events: {
    id: string;
    competitors: { name: string }[];
    markets: OddsData[];
  }[];
}

interface OddsData {
  books: Book[];
}

interface Book {
  outcomes: Outcome[];
}

interface Outcome {
  type: "home" | "draw" | "away";
  odds: string;
}
