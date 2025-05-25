"use client";
 
import { PrivyProvider } from "@privy-io/react-auth";
import { ReactNode } from "react";
import { somniaChain } from "@/lib/privy/chains";

export function PrivyProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          accentColor: "#cdff00",
          theme: "#111111",
          showWalletLoginFirst: false,
          logo: "/imtx-privy-logo.png",
        },
        loginMethods: ["email"],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true,
          },
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
          showWalletUIs: true,
        },
        // Use the properly defined Somnia chain
        defaultChain: somniaChain,
        // Also add it to supported chains
        supportedChains: [somniaChain],
        mfa: {
          noPromptOnMfaRequired: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}