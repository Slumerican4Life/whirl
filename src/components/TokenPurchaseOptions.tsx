
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Coins, Zap, Star, Shield } from "lucide-react";

interface TokenPackage {
  name: string;
  tokens: number;
  priceId: string;
  priceDisplay: string;
  popular?: boolean;
  bonus?: string;
}

const tokenPackages: TokenPackage[] = [
  { 
    name: "Starter Pack", 
    tokens: 10, 
    priceId: "price_1ROxiBEEqiDDPmsdDTesTTtq", 
    priceDisplay: "$0.99",
    bonus: "Perfect to start"
  },
  { 
    name: "Power Pack", 
    tokens: 60, 
    priceId: "price_1ROxs9EEqiDDPmsdZuQxtkY9", 
    priceDisplay: "$4.99", 
    popular: true,
    bonus: "+5 bonus tokens"
  },
  { 
    name: "Champion Pack", 
    tokens: 150, 
    priceId: "price_1ROxvXEEqiDDPmsdi64iXrwK", 
    priceDisplay: "$10.00",
    bonus: "+15 bonus tokens"
  },
];

const TokenPurchaseOptions = () => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handlePurchase = async (pkg: TokenPackage) => {
    setLoadingPriceId(pkg.priceId);
    try {
      const productMetadata = {
        product_type: "tokens",
        price_id: pkg.priceId,
      };

      const { data, error } = await supabase.functions.invoke('create-token-checkout-session', {
        body: { 
          priceId: pkg.priceId, 
          quantity: 1,
          product_metadata: productMetadata
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error.message || data.error);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve checkout session URL.");
      }
    } catch (e: any) {
      console.error("Purchase error:", e);
      toast.error(e.message || "Failed to initiate purchase.");
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-whirl-purple/20 via-whirl-pink/20 to-whirl-orange/20 rounded-3xl"></div>
      
      {/* Content */}
      <div className="relative glass-dark p-8 rounded-3xl shadow-2xl border border-white/10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Buy Tokens</h2>
          </div>
          <p className="text-gray-300 text-lg">Choose your battle arsenal</p>
        </div>

        {/* Token Packages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {tokenPackages.map((pkg) => (
            <div 
              key={pkg.priceId} 
              className={`relative modern-card p-6 rounded-2xl text-center transition-all duration-300 ${
                pkg.popular ? 'ring-2 ring-whirl-purple' : ''
              }`}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-whirl-purple to-whirl-pink px-4 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    POPULAR
                  </div>
                </div>
              )}

              {/* Package icon */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                pkg.popular 
                  ? 'bg-gradient-to-br from-whirl-purple to-whirl-pink' 
                  : 'bg-gradient-to-br from-whirl-orange to-whirl-red'
              }`}>
                <Coins className="w-8 h-8 text-white" />
              </div>

              {/* Package details */}
              <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
              <div className="text-3xl font-black text-whirl-purple mb-2">{pkg.tokens}</div>
              <div className="text-sm text-gray-400 mb-4">Tokens</div>
              
              {/* Bonus */}
              {pkg.bonus && (
                <div className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full mb-4 inline-block">
                  {pkg.bonus}
                </div>
              )}

              {/* Price */}
              <div className="text-2xl font-bold text-white mb-6">{pkg.priceDisplay}</div>

              {/* Purchase button */}
              <Button
                onClick={() => handlePurchase(pkg)}
                disabled={loadingPriceId === pkg.priceId}
                className={`w-full font-bold py-3 rounded-xl transition-all hover:scale-105 ${
                  pkg.popular 
                    ? 'bg-gradient-to-r from-whirl-purple to-whirl-pink hover:from-whirl-pink hover:to-whirl-purple' 
                    : 'bg-gradient-to-r from-whirl-orange to-whirl-red hover:from-whirl-red hover:to-whirl-orange'
                } text-white shadow-lg`}
              >
                {loadingPriceId === pkg.priceId ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Buy for {pkg.priceDisplay}
                  </div>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold">Secure & Instant</span>
          </div>
          <p className="text-sm text-gray-400 text-center leading-relaxed">
            Tokens allow you to participate in battles, boost videos, and unlock special features. 
            All purchases are secure and tokens are delivered instantly to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPurchaseOptions;
