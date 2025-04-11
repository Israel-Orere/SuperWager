import Aside from "@/components/aside";
import LeaderboardTable from "@/components/leaderboard-table";
import MatchesTable from "@/components/matches-table";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="w-full min-h-screen p-[5%] space-y-20">
        <LeaderboardTable />
        <div className="flex gap-16">
          <MatchesTable />

          <Aside />
        </div>
      </div>
    </div>
  );
}
