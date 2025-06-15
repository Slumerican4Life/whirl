
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Coins, Zap } from 'lucide-react';
import { useTokens } from '@/hooks/useTokens';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VotingControlsProps {
  battleId: string;
  videoId: string;
}

const VotingControls: React.FC<VotingControlsProps> = ({ battleId, videoId }) => {
  const [voteAmount, setVoteAmount] = useState(1);
  const [isVoting, setIsVoting] = useState(false);
  const { balance, spendTokens } = useTokens();
  const { user } = useAuth();

  const handleVote = async () => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (balance < voteAmount) {
      toast.error('Insufficient token balance');
      return;
    }

    setIsVoting(true);
    
    try {
      const success = await spendTokens(videoId, voteAmount);
      if (success) {
        setVoteAmount(1); // Reset to default
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to cast vote');
    } finally {
      setIsVoting(false);
    }
  };

  const presetAmounts = [1, 5, 10, 25];

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Cast Your Vote</h3>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
          <Coins className="h-4 w-4 text-yellow-400" />
          <span>Balance: {balance} tokens</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Preset vote amounts */}
        <div className="grid grid-cols-4 gap-2">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              variant={voteAmount === amount ? "default" : "outline"}
              className={`text-sm ${
                voteAmount === amount 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'border-gray-600 hover:border-red-500'
              }`}
              onClick={() => setVoteAmount(amount)}
              disabled={balance < amount}
            >
              <Coins className="h-3 w-3 mr-1" />
              {amount}
            </Button>
          ))}
        </div>

        {/* Custom amount input */}
        <div className="flex gap-2">
          <Input
            type="number"
            min="1"
            max={balance}
            value={voteAmount}
            onChange={(e) => setVoteAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-gray-700 border-gray-600 text-white"
            placeholder="Custom amount"
          />
          <Badge variant="secondary" className="flex items-center whitespace-nowrap">
            <Zap className="h-3 w-3 mr-1" />
            {voteAmount}x Power
          </Badge>
        </div>

        {/* Vote button */}
        <Button
          onClick={handleVote}
          disabled={isVoting || balance < voteAmount || !user}
          className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold py-3"
        >
          {isVoting ? (
            'Casting Vote...'
          ) : (
            <>
              <Heart className="h-4 w-4 mr-2" />
              Vote with {voteAmount} Token{voteAmount !== 1 ? 's' : ''}
            </>
          )}
        </Button>

        {balance < 5 && (
          <p className="text-center text-sm text-yellow-400">
            💡 Low on tokens? <a href="/profile?tab=tokens" className="underline hover:text-yellow-300">Buy more tokens</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default VotingControls;
