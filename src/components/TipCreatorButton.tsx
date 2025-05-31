
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { TIP_OPTIONS } from "@/lib/stripe-prices";

interface TipCreatorButtonProps {
  creatorId: string;
  creatorName: string;
  className?: string;
}

const TipCreatorButton = ({ creatorId, creatorName, className }: TipCreatorButtonProps) => {
  const { user } = useRequireAuth();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTip = async (priceId: string, amount: string) => {
    if (!user) {
      toast.error("Please log in to tip creators");
      return;
    }

    if (user.id === creatorId) {
      toast.error("You can't tip yourself!");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-token-checkout-session', {
        body: {
          priceId,
          metadata: {
            user_id: user.id,
            recipient_id: creatorId,
            type: 'tip'
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
      console.error("Error creating tip checkout:", error);
      toast.error("Failed to process tip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`flex items-center gap-2 ${className}`}
        >
          <Heart className="w-4 h-4" />
          Tip Creator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tip {creatorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Show your appreciation for {creatorName}'s content! 90% goes directly to the creator.
          </p>
          <div className="grid grid-cols-1 gap-3">
            {TIP_OPTIONS.map((option) => (
              <Button
                key={option.priceId}
                onClick={() => handleTip(option.priceId, option.amount)}
                disabled={loading}
                variant="outline"
                className="flex items-center justify-between p-4 h-auto"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{option.description}</div>
                    <div className="text-sm text-muted-foreground">{option.amount}</div>
                  </div>
                </div>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              </Button>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground">
            Secure payment powered by Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TipCreatorButton;
