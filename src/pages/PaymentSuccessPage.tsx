
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ tokensAdded: number; newBalance: number } | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found in URL.');
      setLoading(false);
      return;
    }

    const fulfillPurchase = async () => {
      try {
        const { data: responseData, error: responseError } = await supabase.functions.invoke('fulfill-token-purchase', {
          body: { sessionId },
        });

        if (responseError) {
          throw new Error(responseError.message || 'Failed to fulfill purchase.');
        }
        
        if (responseData.error) {
          throw new Error(responseData.error);
        }

        setData({ tokensAdded: responseData.tokensAdded, newBalance: responseData.newBalance });
        toast.success(`Successfully purchased ${responseData.tokensAdded} tokens! Your new balance is ${responseData.newBalance}.`);
      } catch (e: any) {
        console.error('Fulfillment error:', e);
        setError(e.message || 'An unexpected error occurred.');
        toast.error(e.message || 'Failed to update token balance.');
      } finally {
        setLoading(false);
      }
    };

    fulfillPurchase();
  }, [location]);

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16 swirl-bg flex flex-col items-center justify-center">
      <NavBar />
      <main className="container mx-auto px-4 py-6 text-center">
        {loading && (
          <>
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-lg">Processing your payment...</p>
          </>
        )}
        {!loading && error && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-red-500">Payment Error</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link to="/profile">
              <Button className="bg-whirl-purple hover:bg-whirl-deep-purple">
                Go to Profile
              </Button>
            </Link>
          </>
        )}
        {!loading && !error && data && (
          <>
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4 text-green-500">Payment Successful!</h1>
            <p className="text-lg mb-2">
              You've successfully purchased <span className="font-bold">{data.tokensAdded}</span> tokens.
            </p>
            <p className="text-lg mb-6">
              Your new token balance is <span className="font-bold">{data.newBalance}</span>.
            </p>
            <Link to="/profile">
              <Button className="bg-whirl-purple hover:bg-whirl-deep-purple">
                Go to Profile
              </Button>
            </Link>
          </>
        )}
      </main>
    </div>
  );
};

export default PaymentSuccessPage;
