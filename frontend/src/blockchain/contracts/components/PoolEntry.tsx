import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { usePoolContract } from '../hooks/UsePoolContract';
import { toast } from 'sonner';

interface PoolEntryProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function PoolEntry({ onSuccess, onError }: PoolEntryProps) {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const { 
    getMinDeposit, 
    getPoolBalance, 
    enterPool, 
    hasUserEnteredPool,
    getPlayerCount,
    debugContractState,
    loading: contractLoading 
  } = usePoolContract();
  
  const [minDeposit, setMinDeposit] = useState<string>("0.01");
  const [poolBalance, setPoolBalance] = useState<string>("0");
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [alreadyEntered, setAlreadyEntered] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (authenticated && wallets?.length > 0) {
        try {
          if (contractLoading) {
            console.log("Contract still loading, waiting...");
            return;
          }
          
          console.log("Fetching contract data...");
          
          // Get the minimum deposit
          try {
            const minDepositAmount = await getMinDeposit();
            setMinDeposit(minDepositAmount);
            console.log("Min deposit:", minDepositAmount);
          } catch (e) {
            console.error("Failed to get min deposit:", e);
          }
          
          // Get current pool balance
          const currentBalance = await getPoolBalance();
          setPoolBalance(currentBalance);
          
          // Get player count
          const count = await getPlayerCount();
          setPlayerCount(count);
          
          // Check if user already entered
          const entered = await hasUserEnteredPool();
          setAlreadyEntered(entered);
          
          // Get wallet balance
          const embedded = wallets.find(wallet => wallet.walletClientType === 'privy');
          if (embedded) {
            const provider = await embedded.getEthereumProvider();
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const balance = await ethersProvider.getBalance(embedded.address);
            const formattedBalance = ethers.utils.formatEther(balance);
            setWalletBalance(formattedBalance);
            
            // Check if balance is sufficient
            const minDepositWei = ethers.utils.parseEther(minDeposit);
            setHasEnoughBalance(balance.gte(minDepositWei));
          }
        } catch (error) {
          console.error("Error fetching pool data:", error);
          setError(error instanceof Error ? error.message : 'Unknown error');
        }
      }
    };
    
    if (!contractLoading) {
      fetchData();
    }
  }, [authenticated, wallets, contractLoading]);
  
  const handleEnterPool = async () => {
    if (!authenticated) {
      await login();
      return;
    }
    
    if (alreadyEntered) {
      toast.info("You've already entered this pool");
      onSuccess();
      return;
    }
    
    if (!hasEnoughBalance) {
      onError(`Insufficient balance. You need at least ${minDeposit} STT to enter.`);
      return;
    }
    
    setLoading(true);
    try {
      // Debug contract state first
      await debugContractState();
      
      // Try with a slightly different value format to avoid precision issues
      // Option 1: Use a hardcoded string
      await enterPool("0.01");
      
      // If that fails, try Option 2: Use the exact wei value from the contract
      // Uncomment this if Option 1 fails
      // const minDepositValue = await getMinDeposit();
      // await enterPool(minDepositValue);
      
      toast.success("Successfully entered the pool!");
      onSuccess();
    } catch (error: unknown) {
      console.error("Failed to enter pool:", error);
      
      // Type guard to safely access error.message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown error';
      
      onError(`Failed to enter pool: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  if (contractLoading) {
    return (
      <div className="text-center p-4">
        <p className="mb-2">Loading contract...</p>
        <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex w-full flex-col gap-6 mb-4">
        <div className="flex justify-between items-center gap-10">
          <p className="text-3xl">Enter Pool</p>
          <div className="rounded-[10px] gap-5 px-6 py-4 bg-[var(--primary-light)] flex items-center justify-center">
            <p className="text-2xl">0.01 STT</p>  {/* Changed from 0.1 to 0.01 */}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-3xl">Wallet balance</p>
          <p className="text-2xl">{parseFloat(walletBalance).toFixed(3)} STT</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xl">Current pool balance</p>
          <p className="text-xl">{parseFloat(poolBalance).toFixed(3)} STT</p>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-xl">Players in pool</p>
          <p className="text-xl">{playerCount}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        {!hasEnoughBalance && (
          <p className="text-[var(--primary)] text-2xl flex gap-2 items-center cursor-pointer">
            Fund Wallet
          </p>
        )}
        
        <button
          onClick={handleEnterPool}
          disabled={loading || (!hasEnoughBalance && authenticated) || alreadyEntered}
          className={`text-lg font-normal ${loading || (!hasEnoughBalance && authenticated) || alreadyEntered ? 'bg-gray-400' : 'bg-[var(--primary)]'} rounded-lg px-3.5 py-4 text-white capitalize hover:bg-[var(--primary)]/80`}
        >
          {loading ? "Processing..." : 
           alreadyEntered ? "Already Entered" : 
           hasEnoughBalance ? "Enter Pool" : "Need More STT"}
        </button>
      </div>
    </div>
  );
}