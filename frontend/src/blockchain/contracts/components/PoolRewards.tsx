import { useState, useEffect } from 'react';
import { usePoolContract } from '../hooks/UsePoolContract';
import { toast } from 'sonner';

interface PoolRewardsProps {
  hasWon: string; // 'won' | 'lost' | 'pending'
  onClose: () => void;
}

export default function PoolRewards({ hasWon, onClose }: PoolRewardsProps) {
  const { 
    isUserWinner, 
    areWinnersSelected, 
    getPoolBalance 
  } = usePoolContract();
  
  const [loading, setLoading] = useState(true);
  const [isWinner, setIsWinner] = useState(false);
  const [winnersAnnounced, setWinnersAnnounced] = useState(false);
  const [prizeAmount, setPrizeAmount] = useState("0");
  
  useEffect(() => {
    const checkWinnerStatus = async () => {
      try {
        // Check if winners have been selected
        const winnersSelected = await areWinnersSelected();
        setWinnersAnnounced(winnersSelected);
        
        // If winners are selected, check if current user is a winner
        if (winnersSelected) {
          const winner = await isUserWinner();
          setIsWinner(winner);
          
          // Get pool balance to estimate prize
          const poolBalance = await getPoolBalance();
          // This is an estimation - actual distribution depends on contract logic
          const estimatedPrize = parseFloat(poolBalance) * 0.8 / 3; // Assuming 3 winners and 20% fee
          setPrizeAmount(estimatedPrize.toFixed(3));
        }
      } catch (error) {
        console.error("Error checking winner status:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkWinnerStatus();
  }, [areWinnersSelected, isUserWinner, getPoolBalance]);
  
  // Determine what to display based on game state
  const getDisplayContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <p className="text-xl mb-4">Checking results...</p>
          <div className="w-8 h-8 border-4 border-t-[var(--primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      );
    }
    
    if (hasWon === 'pending') {
      return (
        <div className="text-center">
          <p className="text-xl mb-4">The pool is still active.</p>
          <p>Results will be announced when the pool ends.</p>
        </div>
      );
    }
    
    if (hasWon === 'won' || isWinner) {
      return (
        <div className="text-center">
          <h3 className="text-3xl font-bold text-green-500 mb-4">Congratulations!</h3>
          <p className="text-xl mb-6">You've won approximately {prizeAmount} STT!</p>
          <p className="text-md mb-4">Prizes will be distributed automatically to winners.</p>
        </div>
      );
    }
    
    return (
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-4">Better luck next time</h3>
        <p className="text-md mb-6">You didn't win in this round.</p>
        <p>Join more pools to increase your chances!</p>
      </div>
    );
  };
  
  return (
    <div className="min-w-[300px]">
      {getDisplayContent()}
      
      <button
        onClick={onClose}
        className="mt-8 text-lg font-normal bg-[var(--primary)] rounded-lg px-5 py-3 text-white capitalize hover:bg-[var(--primary)]/80 mx-auto block"
      >
        Close
      </button>
    </div>
  );
}