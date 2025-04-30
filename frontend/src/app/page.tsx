import LeaderboardTable from "@/components/leaderboard-table";
import { MiniMatchesTable } from "@/components/matches-table";
import Image from "next/image";
import mascot from "@/assets/images/mascot.png";
import bg from "@/assets/images/background.jpg";

export default function Home() {
  return (
    <div className="space-y-20">
      <div className="relative w-full flex items-center h-[300px] pl-8 py-16">
        <>
          <Image
            src={bg}
            alt="background"
            className="absolute w-[90%] h-[280px] left-0 z-0"
          />
          <Image
            src={mascot}
            alt="mascot"
            className="absolute -top-[15%] w-[65%] right-0 z-10"
          />
        </>

        <div className="flex relative w-2/5 flex-col gap-8 h-full justify-between text-white">
          <div className="flex flex-col gap-6">
            <p className="text-[26px]/6">1. Connect Wallet</p>
            <p className="text-[26px]/6">
              Sign up using Privy and get your in-app wallet
            </p>
          </div>

          <div className="flex items-center gap-4 [&>*]:cursor-pointer">
            <span className="h-1 w-10 bg-[#0080FF]" />
            <span className="h-1 w-10 bg-white" />
            <span className="h-1 w-10 bg-white" />
            <span className="h-1 w-10 bg-white" />
          </div>
        </div>
      </div>
      <LeaderboardTable />
      <MiniMatchesTable />
    </div>
  );
}
