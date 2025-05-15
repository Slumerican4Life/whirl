
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Coins } from "lucide-react";

interface TokenPackage {
  name: string;
  tokens: number;
  priceId: string; // Replace with actual Stripe Price IDs
  priceDisplay: string;
}

// IMPORTANT: Replace these with your actual Stripe Price IDs
const tokenPackages: TokenPackage[] = [
  { name: "10 Tokens", tokens: 10, priceId: "price_YOUR_1_DOLLAR_PRICE_ID", priceDisplay: "$1.00" },
  { name: "60 Tokens", tokens: 60, priceId: "price_YOUR_5_DOLLAR_PRICE_ID", priceDisplay: "$5.00" },
  { name: "150 Tokens", tokens: 150, priceId: "price_YOUR_10_DOLLAR_PRICE_ID", priceDisplay: "$10.00" },
];

const TokenPurchaseOptions = () => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handlePurchase = async (priceId: string) => {
    setLoadingPriceId(priceId);
    try {
      const { data, error } = await supabase.functions.invoke('create-token-checkout-session', {
        body: { priceId, quantity: 1 },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve checkout session URL.");
      }
    } catch (e: any) {
      console.error("Purchase error:", e);
      toast.error(e.message || "Failed to initiate purchase.");
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Buy Tokens</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokenPackages.map((pkg) => (
          <div key={pkg.priceId} className="p-4 border rounded-lg flex flex-col items-center bg-background/50">
            <Coins className="w-10 h-10 text-whirl-orange mb-2" />
            <h3 className="text-xl font-semibold">{pkg.tokens} Tokens</h3>
            <p className="text-muted-foreground mb-4">{pkg.priceDisplay}</p>
            <Button
              onClick={() => handlePurchase(pkg.priceId)}
              disabled={loadingPriceId === pkg.priceId}
              className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
            >
              {loadingPriceId === pkg.priceId ? "Processing..." : `Buy for ${pkg.priceDisplay}`}
            </Button>
          </div>
        ))}
      </div>
       <p className="text-xs text-muted-foreground mt-4 text-center">
        Make sure your Stripe Price IDs are correctly set in <code>src/components/TokenPurchaseOptions.tsx</code> and <code>supabase/functions/fulfill-token-purchase/index.ts</code>.
      </p>
    </div>
  );
};

export default TokenPurchaseOptions;
