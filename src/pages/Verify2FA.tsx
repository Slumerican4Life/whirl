
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";

const Verify2FAPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCode, setBackupCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<string>("");
  const [isLoadingMethod, setIsLoadingMethod] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/enhanced-login");
      return;
    }

    const fetchTwoFactorMethod = async () => {
      try {
        const { data, error } = await supabase
          .from('user_2fa_settings')
          .select('method')
          .eq('user_id', user.id)
          .eq('enabled', true)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setTwoFactorMethod(data.method);
          // Send verification code
          await sendVerificationCode(data.method);
        } else {
          // No 2FA enabled, redirect to profile
          navigate("/profile");
        }
      } catch (error: any) {
        console.error("Error fetching 2FA method:", error);
        toast.error("Error loading two-factor authentication settings");
        navigate("/profile");
      } finally {
        setIsLoadingMethod(false);
      }
    };

    fetchTwoFactorMethod();
  }, [user, navigate]);

  const sendVerificationCode = async (method: string) => {
    try {
      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code (in a real app, you'd send via SMS/email)
      const { error } = await supabase
        .from('user_phone_verification')
        .upsert({
          user_id: user?.id,
          phone_number: user?.phone || '',
          verification_code: code,
          verified: false,
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes
        });

      if (error) throw error;

      if (method === 'sms') {
        toast.success("Verification code sent to your phone");
      } else {
        toast.success("Verification code sent to your email");
      }
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast.error("Error sending verification code");
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode && !backupCode) {
      toast.error("Please enter a verification code or backup code");
      return;
    }

    setIsLoading(true);
    try {
      if (useBackupCode) {
        // Verify backup code
        const { data: settings, error } = await supabase
          .from('user_2fa_settings')
          .select('backup_codes')
          .eq('user_id', user?.id)
          .single();

        if (error) throw error;

        if (settings?.backup_codes?.includes(backupCode)) {
          // Remove used backup code
          const updatedCodes = settings.backup_codes.filter(code => code !== backupCode);
          await supabase
            .from('user_2fa_settings')
            .update({ backup_codes: updatedCodes })
            .eq('user_id', user?.id);

          toast.success("Backup code verified successfully!");
          navigate("/profile");
        } else {
          toast.error("Invalid backup code");
        }
      } else {
        // Verify regular code
        const { data, error } = await supabase
          .from('user_phone_verification')
          .select('*')
          .eq('user_id', user?.id)
          .eq('verification_code', verificationCode)
          .gte('expires_at', new Date().toISOString())
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Mark as verified
          await supabase
            .from('user_phone_verification')
            .update({ verified: true })
            .eq('id', data.id);

          toast.success("Two-factor authentication verified!");
          navigate("/profile");
        } else {
          toast.error("Invalid or expired verification code");
        }
      }
    } catch (error: any) {
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingMethod) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 swirl-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 swirl-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            {useBackupCode 
              ? "Enter one of your backup codes"
              : `Enter the verification code sent to your ${twoFactorMethod === 'sms' ? 'phone' : 'email'}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            {!useBackupCode ? (
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="flex items-center gap-2">
                  {twoFactorMethod === 'sms' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  Verification Code
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="backup-code">Backup Code</Label>
                <Input
                  id="backup-code"
                  type="text"
                  placeholder="Enter backup code"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value)}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="text-sm text-whirl-purple hover:underline"
            >
              {useBackupCode ? "Use verification code instead" : "Use backup code instead"}
            </Button>
          </div>
          
          <div className="mt-2 text-center">
            <Button
              variant="ghost"
              onClick={() => sendVerificationCode(twoFactorMethod)}
              className="text-sm text-muted-foreground hover:underline"
            >
              Resend code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Verify2FAPage;
