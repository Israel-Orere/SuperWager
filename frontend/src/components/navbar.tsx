// "use client";

// import { CircleX, Menu } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";
// import { useAuthModal } from "@/context/AuthModalContext";

// export default function Navbar() {
//   const [showNav, setShowNav] = useState(false);
//   const { openModal, user } = useAuthModal();

//   return (
//     <header className="w-full max-w-screen-2xl mx-auto px-[5%] flex items-center justify-center">
//       <div className="py-4 w-full flex items-center justify-between gap-4 max-w-screen-3xl overflow-x-hidden z-50">
//         <div className="flex-shrink-0">
//           <Link href={"/"}>
//             <h1 className="text-xl font-bold text-[var(--primary)] inknut-antiqua">
//               Superwager
//             </h1>
//           </Link>
//         </div>
//         <nav className="hidden xl:flex gap-6 items-center justify-center">
//           {[
//             { label: "Sports", href: "/sports" },
//             { label: "Leaderboard", href: "/leaderboard" },
//             { label: "Player Support", href: "/player-support" },
//             { label: "Contact", href: "/contact" },
//             { label: "Language", href: "/language" },
//             { label: "Bet History", href: "/bet-history" },
//             { label: "Create Slip", href: "/create-slip" },
//           ].map((item, i) => (
//             <Link
//               href={item.href}
//               key={i}
//               className="font-medium text-base cursor-pointer text-black hover:text-[var(--primary)]"
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//         {!user && (
//           <div className="hidden xl:flex items-center gap-4">
//             <button
//               onClick={openModal}
//               className="bg-white border-[var(--primary)] border-[2px] rounded-[4px] text-[var(--primary)] p-2.5 px-4 font-medium text-base transition-all cursor-pointer hover:bg-white/80"
//             >
//               Log in
//             </button>
//           </div>
//         )}

//         <span
//           className="xl:hidden cursor-pointer"
//           onClick={() => setShowNav((prev) => !prev)}
//         >
//           <Menu className="size-8 md:size-12 text-[var(--primary)]" />
//         </span>

//         <div
//           className={`${
//             showNav ? "translate-x-0" : "translate-x-[100%]"
//           } xl:hidden transition-transform duration-500 transform fixed inset-0 z-40 flex flex-col gap-4 items-center w-full bg-white`}
//         >
//           <span
//             className="cursor-pointer self-end pr-[5%] pt-4"
//             onClick={() => setShowNav((prev) => !prev)}
//           >
//             <CircleX className="size-8 md:size-10 text-[var(--primary)]" />
//           </span>
//           <nav className="flex flex-col w-full items-center justify-center border-t border-t-[var(--primary)]/20">
//             {[
//               { label: "Sports", href: "/sports" },
//               { label: "Leaderboard", href: "/leaderboard" },
//               { label: "Player Support", href: "/player-support" },
//               { label: "Contact", href: "/contact" },
//               { label: "Language", href: "/language" },
//               { label: "Bet History", href: "/bet-history" },
//               { label: "Create Slip", href: "/create-slip" },
//             ].map((item, i) => (
//               <Link
//                 href={item.href}
//                 key={i}
//                 className="font-medium text-base cursor-pointer text-black hover:text-[var(--primary)]"
//               >
//                 {item.label}
//               </Link>
//             ))}
//           </nav>
//           {!user && (
//             <div className="flex xl:hidden flex-col items-center gap-4">
//               <button
//                 onClick={openModal}
//                 className="bg-transparent rounded-[4px] border text-[var(--primary)] border-[var(--primary)] p-2.5 px-4 font-medium cursor-pointer text-sm transition-all"
//               >
//                 Login
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { usePrivy } from '@privy-io/react-auth';
// import { Menu, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { UserCircleIcon, ArrowRightOnRectangleIcon, WalletIcon, PlusIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// export default function NavUser() {
//   const { authenticated, user, logout, ready, getEmbeddedWallets } = usePrivy();
//   const [walletAddress, setWalletAddress] = useState<string | null>(null);
//   const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  
//   // Mock wallet balance
//   const mockBalance = "1,234.56";

//   // Fetch wallet address when authenticated
//   useEffect(() => {
//     async function fetchWalletInfo() {
//       if (authenticated && user) {
//         try {
//           const wallets = await getEmbeddedWallets();
//           if (wallets && wallets.length > 0) {
//             const wallet = wallets[0];
//             setWalletAddress(wallet.address);
//           }
//         } catch (error) {
//           console.error("Error getting wallet:", error);
//         }
//       }
//     }
    
//     if (ready && authenticated) {
//       fetchWalletInfo();
//     }
//   }, [ready, authenticated, user, getEmbeddedWallets]);

//   // Handler functions for wallet actions
//   const handleFund = () => {
//     console.log('Fund wallet clicked');
//     setIsWalletMenuOpen(false);
//     // Implement funding functionality here
//   };

//   const handleWithdraw = () => {
//     console.log('Withdraw clicked');
//     setIsWalletMenuOpen(false);
//     // Implement withdrawal functionality here
//   };

//   // Show loading state while privy is initializing
//   if (!ready) {
//     return <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>;
//   }

//   // Show nothing if not authenticated (login button would be elsewhere)
//   if (!authenticated) {
//     return null;
//   }

//   // User is authenticated, show profile menu
//   return (
//     <Menu as="div" className="relative">
//       <Menu.Button className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
//         {user?.avatar?.url ? (
//           <img 
//             src={user.avatar.url} 
//             alt="Profile" 
//             className="h-8 w-8 rounded-full"
//           />
//         ) : (
//           <UserCircleIcon className="h-7 w-7 text-gray-700 dark:text-gray-300" />
//         )}
//       </Menu.Button>

//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
//           {/* User profile section */}
//           <div className="px-4 py-3">
//             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//               {user?.email?.address?.split('@')[0] || 'User'}
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               {user?.email?.address || ''}
//             </p>
//           </div>

//           {/* Wallet info section */}
//           <div className="px-4 py-3">
//             <div className="mb-1">
//               <div className="flex items-center justify-between">
//                 <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Wallet Address</p>
                
//                 {/* Wallet dropdown menu */}
//                 <div className="relative">
//                   <button 
//                     onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
//                     className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                   >
//                     <WalletIcon className="h-4 w-4" />
//                   </button>
                  
//                   {isWalletMenuOpen && (
//                     <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
//                       <button
//                         onClick={handleFund}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         <PlusIcon className="mr-2 h-4 w-4" />
//                         Fund Wallet
//                       </button>
//                       <button
//                         onClick={handleWithdraw}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
//                         Withdraw
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
//                 {walletAddress || 'No wallet connected'}
//               </p>
//             </div>
            
//             <div>
//               <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Balance</p>
//               <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
//                 {mockBalance} MATIC
//               </p>
//             </div>
//           </div>

//           {/* Actions section */}
//           <div className="py-1">
//             <Menu.Item>
//               {({ active }) => (
//                 <button
//                   onClick={() => logout()}
//                   className={`${
//                     active ? 'bg-gray-100 dark:bg-gray-700' : ''
//                   } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
//                 >
//                   <ArrowRightOnRectangleIcon
//                     className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
//                     aria-hidden="true"
//                   />
//                   Sign out
//                 </button>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }


'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import NavUser from '@/components/nav/NavUser';

export default function Navbar() {
  const { ready } = usePrivy();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-100 dark:border-gray-800 py-4 px-5">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          SuperWager
        </Link>
        
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        
        {/* Navigation links and user profile */}
        <nav className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } md:flex flex-col md:flex-row absolute md:static left-0 right-0 top-16 md:top-auto bg-white dark:bg-gray-900 md:bg-transparent p-4 md:p-0 shadow-md md:shadow-none items-center gap-6`}>
          <Link href="/matches" className="hover:text-red-600 transition-colors">
            Matches
          </Link>
          <Link href="/leaderboard" className="hover:text-red-600 transition-colors">
            Leaderboard
          </Link>
          
          {/* NavUser component handles authentication state */}
          {ready && <NavUser />}
        </nav>
      </div>
    </header>
  );
}