import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { usePoolContract } from '../hooks/usePoolContract';
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
    loading: contractLoading 
  } = usePoolContract();
  
  const [minDeposit, setMinDeposit] = useState<string>("0.1");
  const [poolBalance, setPoolBalance] = useState<string>("0");
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [alreadyEntered, setAlreadyEntered] = useState(false);
  const [walletBalance, setWalletBalance] = useState<string>("0");
  const [hasEnoughBalance, setHasEnoughBalance] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (authenticated && wallets?.length > 0) {
        try {
          // Get the minimum deposit
          const minDepositAmount = await getMinDeposit();
          setMinDeposit(minDepositAmount);
          
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
            const minDepositWei = ethers.utils.parseEther(minDepositAmount);
            setHasEnoughBalance(balance.gte(minDepositWei));
          }
        } catch (error) {
          console.error("Error fetching pool data:", error);
        }
      }
    };
    
    fetchData();
  }, [authenticated, wallets]);
  
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
      await enterPool(minDeposit);
      toast.success("Successfully entered the pool!");
      onSuccess();
    } catch (error) {
      console.error("Failed to enter pool:", error);
      onError("Failed to enter pool: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="flex w-full flex-col gap-6 mb-4">
        <div className="flex justify-between items-center gap-10">
          <p className="text-3xl">Enter Pool</p>
          <div className="rounded-[10px] gap-5 px-6 py-4 bg-[var(--primary-light)] flex items-center justify-center">
            <p className="text-2xl">{minDeposit} STT</p>
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