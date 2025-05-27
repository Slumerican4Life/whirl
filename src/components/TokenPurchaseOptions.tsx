
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { Coins } from "lucide-react";

interface TokenPackage {
  name: string;
  tokens: number;
  priceId: string;
  priceDisplay: string;
}

const tokenPackages: TokenPackage[] = [
  { name: "10 Tokens", tokens: 10, priceId: "price_1ROxiBEEqiDDPmsdDTesTTtq", priceDisplay: "$0.99" },
  { name: "60 Tokens", tokens: 60, priceId: "price_1ROxs9EEqiDDPmsdZuQxtkY9", priceDisplay: "$4.99" },
  { name: "150 Tokens", tokens: 150, priceId: "price_1ROxvXEEqiDDPmsdi64iXrwK", priceDisplay: "$10.00" },
];

const TokenPurchaseOptions = () => {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handlePurchase = async (pkg: TokenPackage) => {
    setLoadingPriceId(pkg.priceId);
    try {
      // Prepare metadata for the webhook
      const productMetadata = {
        product_type: "tokens",
        price_id: pkg.priceId, // Webhook can use this to find token amount
        // For other product types, more specific metadata would be added here
        // e.g., target_user_id for tips, item_id for avatar items, etc.
      };

      const { data, error } = await supabase.functions.invoke('create-token-checkout-session', {
        body: { 
          priceId: pkg.priceId, 
          quantity: 1,
          product_metadata: productMetadata // Pass metadata here
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error.message || data.error); // Access error message
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Could not retrieve checkout session URL.");
      }
    } catch (e: any) {
      console.error("Purchase error:", e);
      toast.error(e.message || "Failed to initiate purchase.");
    } finally {
      setLoadingPriceId(null); // Ensure loading state is reset in all cases
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
              onClick={() => handlePurchase(pkg)}
              disabled={loadingPriceId === pkg.priceId}
              className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
            >
              {loadingPriceId === pkg.priceId ? "Processing..." : `Buy for ${pkg.priceDisplay}`}
            </Button>
          </div>
        ))}
      </div>
       <p className="text-xs text-muted-foreground mt-4 text-center">
        Tokens allow you to participate in battles, boost videos, and unlock special features.
      </p>
    </div>
  );
};

export default TokenPurchaseOptions;

