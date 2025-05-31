
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Phone, Mail, Copy, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface TwoFactorSettings {
  enabled: boolean;
  method: string;
  backup_codes: string[];
}

const TwoFactorSetup = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<TwoFactorSettings>({
    enabled: false,
    method: 'sms',
    backup_codes: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTwoFactorSettings();
    }
  }, [user]);

  const fetchTwoFactorSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          enabled: data.enabled || false,
          method: data.method || 'sms',
          backup_codes: data.backup_codes || []
        });
      }
    } catch (error: any) {
      console.error("Error fetching 2FA settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBackupCodes = () => {
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  };

  const enable2FA = async () => {
    if (!phoneNumber && settings.method === 'sms') {
      toast.error("Please enter your phone number");
      return;
    }

    setIsVerifying(true);
    try {
      const backupCodes = generateBackupCodes();
      
      // Store 2FA settings
      const { error } = await supabase
        .from('user_2fa_settings')
        .upsert({
          user_id: user?.id,
          enabled: true,
          method: settings.method,
          backup_codes: backupCodes
        });

      if (error) throw error;

      setSettings(prev => ({
        ...prev,
        enabled: true,
        backup_codes: backupCodes
      }));
      
      setShowBackupCodes(true);
      toast.success("Two-factor authentication enabled!");
    } catch (error: any) {
      toast.error(`Error enabling 2FA: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const disable2FA = async () => {
    try {
      const { error } = await supabase
        .from('user_2fa_settings')
        .update({ enabled: false })
        .eq('user_id', user?.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, enabled: false }));
      toast.success("Two-factor authentication disabled");
    } catch (error: any) {
      toast.error(`Error disabling 2FA: ${error.message}`);
    }
  };

  const copyBackupCodes = () => {
    const codesText = settings.backup_codes.join('\n');
    navigator.clipboard.writeText(codesText);
    setCopiedCodes(true);
    toast.success("Backup codes copied to clipboard!");
    setTimeout(() => setCopiedCodes(false), 3000);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (showBackupCodes) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Backup Codes Generated
          </CardTitle>
          <CardDescription>
            Save these backup codes in a safe place. You can use them to access your account if you lose your phone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 p-4 bg-gray-100 rounded-lg font-mono text-sm">
            {settings.backup_codes.map((code, index) => (
              <div key={index} className="p-2 bg-white rounded border">
                {code}
              </div>
            ))}
          </div>
          <Button
            onClick={copyBackupCodes}
            className="w-full"
            variant={copiedCodes ? "default" : "outline"}
          >
            {copiedCodes ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Backup Codes
              </>
            )}
          </Button>
          <Button
            onClick={() => setShowBackupCodes(false)}
            variant="ghost"
            className="w-full"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Two-Factor Authentication
          {settings.enabled && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Enabled
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="2fa-toggle">Enable Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Secure your account with an additional verification step
            </p>
          </div>
          <Switch
            id="2fa-toggle"
            checked={settings.enabled}
            onCheckedChange={(checked) => {
              if (checked) {
                enable2FA();
              } else {
                disable2FA();
              }
            }}
            disabled={isVerifying}
          />
        </div>

        {!settings.enabled && (
          <Tabs value={settings.method} onValueChange={(value) => setSettings(prev => ({ ...prev, method: value }))}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sms" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Verification codes will be sent to your registered email address: {user?.email}
              </p>
            </TabsContent>
          </Tabs>
        )}

        {settings.enabled && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Current Method:</p>
            <div className="flex items-center gap-2">
              {settings.method === 'sms' ? (
                <Phone className="w-4 h-4" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              <span className="text-sm capitalize">{settings.method}</span>
            </div>
            {settings.backup_codes.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBackupCodes(true)}
              >
                View Backup Codes
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
