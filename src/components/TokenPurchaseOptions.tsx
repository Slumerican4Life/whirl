
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";
import { Coins, Loader2, Zap } from "lucide-react";
import { TOKEN_PACKAGES } from "@/lib/stripe-prices";

const TokenPurchaseOptions = () => {
  const { user } = useRequireAuth();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (priceId: string, tokens: number) => {
    if (!user) {
      toast.error("Please log in to purchase tokens");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-token-checkout-session', {
        body: {
          priceId,
          metadata: {
            user_id: user.id,
            type: 'tokens'
          }
        },
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe checkout
      window.location.href = data.url;
      
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-whirl-text-bright mb-2">Get More Tokens</h2>
        <p className="text-gray-300">
          Purchase tokens to vote in battles, boost your videos, and unlock avatar customizations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TOKEN_PACKAGES.map((pkg) => (
          <Card 
            key={pkg.priceId} 
            className={`relative bg-background/70 border-whirl-blue-dark hover:bg-background/90 transition-all ${
              pkg.popular ? 'ring-2 ring-whirl-purple' : ''
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-whirl-purple text-white">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-whirl-text-bright">
                <Coins className="w-5 h-5 text-whirl-orange" />
                {pkg.tokens} Tokens
              </CardTitle>
              <CardDescription className="text-2xl font-bold text-whirl-orange">
                {pkg.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handlePurchase(pkg.priceId, pkg.tokens)}
                disabled={loading}
                className="w-full bg-whirl-purple hover:bg-whirl-purple/80 text-white"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Purchase
                  </>
                )}
              </Button>
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-400">
                  {(pkg.tokens / (parseFloat(pkg.price.replace('$', '')) * 100) * 100).toFixed(1)} tokens per $
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-xs text-gray-400">
        <p>Secure payment powered by Stripe • Tokens are added instantly after purchase</p>
      </div>
    </div>
  );
};

export default TokenPurchaseOptions;
