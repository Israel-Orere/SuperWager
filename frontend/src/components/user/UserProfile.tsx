'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button'; // Fixed import path


export default function UserProfile() {
  const { user, isAuthenticated, logout, getEmbeddedWallet, createWallet } = useAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  useEffect(() => {
    async function fetchWalletInfo() {
      if (isAuthenticated && user) {
        const wallet = await getEmbeddedWallet();
        if (wallet && 'address' in wallet) {
          setWalletAddress(wallet.address as string);
        }
      }
    }

    fetchWalletInfo();
  }, [isAuthenticated, user, getEmbeddedWallet]);

  const handleCreateWallet = async () => {
    setIsCreatingWallet(true);
    try {
      await createWallet();
      // Refresh wallet information
      const wallet = await getEmbeddedWallet();
      if (wallet && 'address' in wallet) {
        setWalletAddress(wallet.address as string);
      }
    } catch (error) {
      console.error("Failed to create wallet:", error);
    } finally {
      setIsCreatingWallet(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Please login to view your profile</div>;
  }

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <p className="text-gray-500 dark:text-gray-300">{user?.email?.address}</p>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Wallet</h3>
        
        {walletAddress ? (
          <div>
            <p className="text-sm mb-1">Your wallet address:</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
              {walletAddress}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm mb-3">No embedded wallet found.</p>
            <Button 
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              variant="secondary"
            >
              {isCreatingWallet ? 'Creating...' : 'Create Wallet'}
            </Button>
          </div>
        )}
      </div>

      <Button onClick={logout} variant="destructive" className="mt-6">
        Sign Out
      </Button>
    </div>
  );
}