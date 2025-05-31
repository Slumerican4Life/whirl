
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const EnhancedLoginPage = () => {
  const [loginType, setLoginType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!email && loginType === "email") || (!phone && loginType === "phone") || !password) return;
    
    setIsLoading(true);
    try {
      if (loginType === "email") {
        await signIn(email, password);
      } else {
        // For phone login, we'll use email field but validate phone format
        await signIn(phone + "@phone.whirl", password);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      
      toast.success("Password reset email sent! Check your inbox.");
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 swirl-bg">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 swirl-bg">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
                disabled={isResetting}
              >
                {isResetting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm">
            <Button
              variant="ghost"
              onClick={() => setShowForgotPassword(false)}
              className="text-whirl-purple hover:underline"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 swirl-bg">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login to Whirl-Win</CardTitle>
          <CardDescription>
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={(value) => setLoginType(value as "email" | "phone")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <TabsContent value="email" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </TabsContent>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-whirl-purple hover:bg-whirl-deep-purple"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center text-sm">
          <Button
            variant="ghost"
            onClick={() => setShowForgotPassword(true)}
            className="text-whirl-purple hover:underline"
          >
            Forgot Password?
          </Button>
          <div>
            Don't have an account?{" "}
            <Link to="/signup" className="text-whirl-purple hover:underline">
              Sign up
            </Link>
          </div>
          <Link to="/" className="text-muted-foreground hover:underline">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EnhancedLoginPage;
