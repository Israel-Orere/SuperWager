import LeaderboardTable from "@/components/leaderboard-table";
import MatchesTable from "@/components/matches-table";

export default function Home() {
  return (
    <div className="space-y-20">
      <LeaderboardTable />
      <MatchesTable />
    </div>
  );
}
