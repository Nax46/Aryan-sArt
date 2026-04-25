import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [loginData, setLoginData] = useState({ mobileNumber: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    mobileNumber: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(loginData.mobileNumber, loginData.password);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await signup(
        signupData.name, 
        signupData.mobileNumber, 
        signupData.password, 
        signupData.email || undefined
      );
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const validateMobile = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="max-w-[450px] p-6 bg-[#FFF8F0] border-2 border-[#8B4513]/20 rounded-xl overflow-hidden">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-display font-bold text-[#8B4513] italic">Canvas</h2>
          <p className="text-xs tracking-widest text-[#8B4513]/60 uppercase">by Aryans Art</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#8B4513]/10 mb-6">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white">Login</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginMobile" className="text-[#8B4513]">Mobile Number</Label>
                <Input
                  id="loginMobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile"
                  required
                  value={loginData.mobileNumber}
                  onChange={(e) => setLoginData({...loginData, mobileNumber: validateMobile(e.target.value)})}
                  className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513]"
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="loginPassword" className="text-[#8B4513]">Password</Label>
                <div className="relative">
                  <Input
                    id="loginPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B4513]/40 hover:text-[#8B4513]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-medium py-6 rounded-lg shadow-md transition-all active:scale-[0.98]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Login
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-2">
                <Label htmlFor="signupName" className="text-[#8B4513]">Full Name</Label>
                <Input
                  id="signupName"
                  placeholder="John Doe"
                  required
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                  className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupMobile" className="text-[#8B4513]">Mobile Number</Label>
                <Input
                  id="signupMobile"
                  type="tel"
                  placeholder="10-digit mobile"
                  required
                  value={signupData.mobileNumber}
                  onChange={(e) => setSignupData({...signupData, mobileNumber: validateMobile(e.target.value)})}
                  className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="text-[#8B4513]">Email (Optional)</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513]"
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="signupPassword" className="text-[#8B4513]">Password</Label>
                <div className="relative">
                  <Input
                    id="signupPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513] pr-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#8B4513]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  className="bg-white border-[#8B4513]/20 focus-visible:ring-[#8B4513]"
                />
              </div>

              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#8B4513] hover:bg-[#8B4513]/90 text-white font-medium py-6 rounded-lg shadow-md transition-all active:scale-[0.98] mt-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
