
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";
import { CreditCard, ExternalLink } from "lucide-react";

interface StripeConnectButtonProps {
  isConnected?: boolean;
  onConnectionChange?: () => void;
}

const StripeConnectButton = ({ isConnected = false, onConnectionChange }: StripeConnectButtonProps) => {
  const { user } = useRequireAuth();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!user) {
      toast.error("Please log in to connect your Stripe account");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account-link', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      // Redirect to Stripe onboarding
      window.open(data.url, '_blank');
      
      toast.success("Redirecting to Stripe Connect onboarding...");
      
      // Optionally refresh connection status after a delay
      setTimeout(() => {
        onConnectionChange?.();
      }, 5000);
      
    } catch (error: any) {
      console.error("Error creating Stripe Connect link:", error);
      toast.error("Failed to start Stripe Connect onboarding");
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CreditCard className="w-4 h-4" />
        <span className="text-sm font-medium">Stripe Connected</span>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      disabled={loading}
      variant="outline"
      className="flex items-center gap-2"
    >
      {loading ? (
        "Connecting..."
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Connect Stripe Account
          <ExternalLink className="w-3 h-3" />
        </>
      )}
    </Button>
  );
};

export default StripeConnectButton;
