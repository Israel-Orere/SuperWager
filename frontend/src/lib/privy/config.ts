// import { PrivyClientConfig } from '@privy-io/react-auth';

// export const privyConfig: PrivyClientConfig = {
//   // Replace with your Privy App ID from the Privy Dashboard
//   appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
  
//   // Configure login methods
//   loginMethods: ['email', 'wallet', 'google', 'twitter'],
  
//   // Set appearance (customize to match your design)
//   appearance: {
//     theme: 'dark',
//     accentColor: '#F22C3D',
//     logo: '/logo.png',
//   },

//   // Enable embedded wallets with the correct type
//   // embeddedWallets: {
//   //   // Use object instead of boolean
//   //   createOnLogin: {
//   //     requireUserConfirmation: false,  // Don't require confirmation when creating wallet
//   //   },
//   //   noPromptOnSignature: false, // Show a confirmation when signing
//   // },
//   embeddedWallets: {
//     createOnLogin: "users-without-wallets",
//     requireUserPasswordOnCreate: false,
//     showWalletUIs: true,
//   },



// };


// // "use client";
 
// // import { PrivyProvider } from "@privy-io/react-auth";
// // import { ReactNode } from "react";

// // export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
// //   return (
// //     <PrivyProvider
// //       appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
// //       config={{
// //         walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
// //         appearance: {
// //           accentColor: "#cdff00",
// //           theme: "#111111",
// //           showWalletLoginFirst: false,
// //           logo: "/imtx-privy-logo.png",
// //           walletList: ["wallet_connect"],
// //           walletChainType: "ethereum-only",
// //         },
// //         loginMethods: ["email", "wallet"],
// //         fundingMethodConfig: {
// //           moonpay: {
// //             useSandbox: true,
// //           },
// //         },
// //         embeddedWallets: {
// //           createOnLogin: "users-without-wallets",
// //           requireUserPasswordOnCreate: false,
// //           showWalletUIs: true,
// //         },
// //         mfa: {
// //           noPromptOnMfaRequired: false,
// //         },
// //       }}
// //     >
// //       {children}
// //     </PrivyProvider>
// //   );
// // }