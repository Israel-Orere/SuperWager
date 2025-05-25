import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import PoolContractABI from '../contracts/abi/PoolContract.json';
import { getContractAddress } from '../contracts/addresses';
import { somniaChain } from '@/lib/privy/chains';

export function usePoolContract() {
  const { authenticated, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initContract = async () => {
      if (!authenticated || !wallets || wallets.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        const embedded = wallets.find(wallet => wallet.walletClientType === 'privy');
        
        if (!embedded) {
          setError('No embedded wallet found');
          setLoading(false);
          return;
        }
        
        setEmbeddedWallet(embedded);
        
        const ethProvider = await embedded.getEthereumProvider();
        const ethersProvider = new ethers.providers.Web3Provider(ethProvider);
        setProvider(ethersProvider);
        
        const contractAddress = getContractAddress(somniaChain.id);
        
        // Create contract instance - readonly
        const poolContract = new ethers.Contract(
          contractAddress,
          PoolContractABI.abi,
          ethersProvider
        );
        
        setContract(poolContract);
        setError(null);
      } catch (err) {
        console.error('Error initializing pool contract:', err);
        setError('Failed to initialize contract. Please check your wallet connection.');
      } finally {
        setLoading(false);
      }
    };
    
    initContract();
  }, [authenticated, wallets]);
  
  // Get minimum deposit required to enter the pool
  const getMinDeposit = async (): Promise<string> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const minDeposit = await contract.MIN_DEPOSIT();
      return ethers.utils.formatEther(minDeposit);
    } catch (err) {
      console.error('Error getting minimum deposit:', err);
      throw new Error('Failed to get minimum deposit');
    }
  };
  
  // Get current pool balance
  const getPoolBalance = async (): Promise<string> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const balance = await contract.getPoolBalance();
      return ethers.utils.formatEther(balance);
    } catch (err) {
      console.error('Error getting pool balance:', err);
      throw new Error('Failed to get pool balance');
    }
  };
  
  // Enter the pool by sending STT
  const enterPool = async (amount?: string) => {
    if (!contract || !provider || !embeddedWallet) {
      throw new Error('Contract not initialized');
    }
    
    try {
      let value;
      
      // If amount is specified, use that, otherwise use the minimum deposit
      if (amount) {
        value = ethers.utils.parseEther(amount);
      } else {
        const minDeposit = await contract.MIN_DEPOSIT();
        value = minDeposit;
      }
      
      // Create transaction
      const tx = {
        to: contract.address,
        data: contract.interface.encodeFunctionData('enterPool', []),
        chainId: somniaChain.id,
        value: ethers.utils.hexlify(value),
      };
      
      // UI configuration
      const txConfig = {
        uiOptions: {
          header: "Enter Betting Pool",
          description: `Send ${ethers.utils.formatEther(value)} STT to enter the betting pool`,
          buttonText: "Enter Pool",
        }
      };
      
      // Send transaction
      const response = await sendTransaction(tx, txConfig);
      return response;
    } catch (err) {
      console.error('Error entering pool:', err);
      throw err;
    }
  };
  
  // Check if user has entered the pool
  const hasUserEnteredPool = async (): Promise<boolean> => {
    if (!contract || !embeddedWallet) return false;
    
    try {
      return await contract.hasEntered(embeddedWallet.address);
    } catch (err) {
      console.error('Error checking pool entry status:', err);
      return false;
    }
  };
  
  // Check if the pool is active
  const isPoolActive = async (): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.poolActive();
    } catch (err) {
      console.error('Error checking pool status:', err);
      return false;
    }
  };
  
  // Check if winners have been selected
  const areWinnersSelected = async (): Promise<boolean> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      return await contract.winnersSelected();
    } catch (err) {
      console.error('Error checking if winners selected:', err);
      return false;
    }
  };
  
  // Check if current user is a winner
  const isUserWinner = async (): Promise<boolean> => {
    if (!contract || !embeddedWallet) return false;
    
    try {
      const winnersSelected = await contract.winnersSelected();
      if (!winnersSelected) return false;
      
      const winnerCount = await contract.WINNER_COUNT();
      
      // Check if the user's address is in the winners array
      for (let i = 0; i < winnerCount; i++) {
        const winner = await contract.winners(i);
        if (winner.toLowerCase() === embeddedWallet.address.toLowerCase()) {
          return true;
        }
      }
      
      return false;
    } catch (err) {
      console.error('Error checking if user is winner:', err);
      return false;
    }
  };
  
  // Get player count
  const getPlayerCount = async (): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const count = await contract.getPlayerCount();
      return count.toNumber();
    } catch (err) {
      console.error('Error getting player count:', err);
      return 0;
    }
  };
  
  return { 
    contract,
    loading, 
    error,
    getMinDeposit,
    getPoolBalance,
    enterPool,
    hasUserEnteredPool,
    isPoolActive,
    areWinnersSelected,
    isUserWinner,
    getPlayerCount
  };
}