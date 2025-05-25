'use client';

import { usePrivy, User } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const {
    login,
    logout,
    authenticated,
    user,
    ready,
    createWallet,
    sendTransaction,
    signMessage,
  } = usePrivy();

  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getEmbeddedWallet = async () => {
    if (!authenticated || !user) return null;
    
    // Get user's embedded wallet if it exists
    const embeddedWallet = user.linkedAccounts.find(
      (account) => account.type === 'wallet' && account.walletClientType === 'embedded'
    );
    
    return embeddedWallet;
  };

  const getWalletProvider = async () => {
    if (!authenticated || !user) return null;
    
    try {
      // This is the modern approach in Privy to get a wallet provider
      const embeddedWallet = await getEmbeddedWallet();
      if (!embeddedWallet) return null;
      
      // Use the Privy SDK to get the provider for this specific wallet
      // Note: implementation may vary based on your Privy version
      return embeddedWallet;
    } catch (error) {
      console.error("Error getting wallet provider:", error);
      return null;
    }
  };

  return {
    isAuthenticated: authenticated,
    user: user as User | null,
    login,
    logout: handleLogout,
    isLoading: !ready,
    createWallet,
    sendTransaction,
    signMessage,
    getEmbeddedWallet,
    // Replace getEthereumProvider with our custom function
    getEthereumProvider: getWalletProvider,
  };
}