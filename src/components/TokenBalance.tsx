
import React from 'react';
import { Coins, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTokens } from '@/hooks/useTokens';
import { Link } from 'react-router-dom';

interface TokenBalanceProps {
  showPurchaseButton?: boolean;
  className?: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ 
  showPurchaseButton = true, 
  className = "" 
}) => {
  const { balance, loading } = useTokens();

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-700 rounded-full w-8 h-8"></div>
        <div className="animate-pulse bg-gray-700 rounded w-16 h-4"></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        <Coins className="h-5 w-5 text-yellow-400" />
        <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-400 border-yellow-400/30">
          {balance}
        </Badge>
      </div>
      
      {showPurchaseButton && balance < 5 && (
        <Link to="/profile?tab=tokens">
          <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
            <Plus className="h-3 w-3 mr-1" />
            Buy
          </Button>
        </Link>
      )}
    </div>
  );
};

export default TokenBalance;
