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
      if (err.message === "Failed to fetch") {
        setError("Connection failed. Is the server running? (Check CORS or server status)");
      } else {
        setError(err.message || "Invalid credentials");
      }
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
      if (err.message === "Failed to fetch") {
        setError("Connection failed. Is the server running?");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateMobile = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="max-w-[450px] p-0 overflow-hidden bg-white border-none rounded-2xl shadow-2xl">
        <div className="relative h-2 w-full bg-gradient-to-r from-[#8B4513] via-[#D2691E] to-[#8B4513]" />
        
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#8B4513]/5 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-display font-bold text-[#8B4513] italic">C</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-[#4A2511] tracking-tight">Welcome Back</h2>
            <p className="text-sm text-[#8B4513]/60 mt-1">Experience the art of precision</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#F9F7F5] p-1 rounded-xl mb-8">
              <TabsTrigger 
                value="login" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8B4513] data-[state=active]:shadow-sm transition-all py-2.5"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup" 
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#8B4513] data-[state=active]:shadow-sm transition-all py-2.5"
              >
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="loginMobile" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Mobile Number</Label>
                  <Input
                    id="loginMobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile"
                    required
                    value={loginData.mobileNumber}
                    onChange={(e) => setLoginData({...loginData, mobileNumber: validateMobile(e.target.value)})}
                    className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2 relative">
                  <div className="flex justify-between items-center px-1">
                    <Label htmlFor="loginPassword" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70">Password</Label>
                    <button type="button" className="text-[10px] text-[#8B4513]/50 hover:text-[#8B4513] font-medium transition-colors">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B4513]/30 hover:text-[#8B4513] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-[#8B4513] hover:bg-[#6D360F] text-white font-bold rounded-xl shadow-lg shadow-[#8B4513]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleSignupSubmit} className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-2">
                  <Label htmlFor="signupName" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Full Name</Label>
                  <Input
                    id="signupName"
                    placeholder="Sunil Jangid"
                    required
                    value={signupData.name}
                    onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                    className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupMobile" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Mobile Number</Label>
                  <Input
                    id="signupMobile"
                    type="tel"
                    placeholder="10-digit mobile"
                    required
                    value={signupData.mobileNumber}
                    onChange={(e) => setSignupData({...signupData, mobileNumber: validateMobile(e.target.value)})}
                    className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Email (Optional)</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="sunil@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Password</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Min 6 chars"
                      required
                      minLength={6}
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-[#8B4513]/70 ml-1">Confirm</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat"
                      required
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      className="h-12 bg-[#F9F7F5] border-transparent focus:border-[#8B4513]/30 focus:bg-white transition-all rounded-xl"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full h-14 bg-[#8B4513] hover:bg-[#6D360F] text-white font-bold rounded-xl shadow-lg shadow-[#8B4513]/20 transition-all active:scale-[0.98] mt-4"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-[10px] text-[#8B4513]/40 mt-8 uppercase tracking-[0.2em]">
            Precision Crafted by Aryans Art
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
