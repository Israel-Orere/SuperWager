import LeaderboardTable from "@/components/leaderboard-table";
import { MiniMatchesTable } from "@/components/matches-table";

export default function Home() {
  return (
    <div className="space-y-20">
      <LeaderboardTable />
      <MiniMatchesTable />
    </div>
  );
}
