import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (error) {
      // Error is handled in context via toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-white border-0 gap-0 shadow-xl rounded-sm font-body">
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Left Panel - Theme Colors */}
          <div className="bg-primary w-full md:w-[40%] p-8 flex flex-col justify-between text-primary-foreground hidden md:flex">
            <div>
              <h2 className="text-3xl font-display font-semibold mb-4">
                {isLogin ? "Login" : "Looks like you're new here!"}
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-snug font-body">
                {isLogin
                  ? "Get access to your Orders, Wishlist and Recommendations"
                  : "Sign up with your mobile number or email to get started"}
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <div className="w-32 h-32 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                <span className="text-6xl font-display italic text-primary-foreground/50">C</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-full md:w-[60%] p-8 flex flex-col justify-between bg-white relative">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {!isLogin && (
                  <div className="relative border-b border-gray-300 focus-within:border-primary">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-0 py-2 bg-transparent text-sm text-foreground focus:outline-none peer placeholder-transparent"
                      placeholder="Full Name"
                      id="fullNameInput"
                    />
                    <label htmlFor="fullNameInput" className="absolute left-0 -top-3 text-xs text-muted-foreground peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary">
                      Full Name
                    </label>
                  </div>
                )}
                
                <div className="relative border-b border-gray-300 focus-within:border-primary">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-0 py-2 bg-transparent text-sm text-foreground focus:outline-none peer placeholder-transparent"
                    placeholder="Enter Email/Mobile number"
                    id="emailInput"
                  />
                  <label htmlFor="emailInput" className="absolute left-0 -top-3 text-xs text-muted-foreground peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary">
                    Enter Email/Mobile number
                  </label>
                </div>

                <div className="relative border-b border-gray-300 focus-within:border-primary">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-2 bg-transparent text-sm text-foreground focus:outline-none peer placeholder-transparent"
                    placeholder="Enter Password"
                    id="passwordInput"
                  />
                  <label htmlFor="passwordInput" className="absolute left-0 -top-3 text-xs text-muted-foreground peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-primary">
                    Enter Password
                  </label>
                </div>

                <div className="text-xs text-muted-foreground pt-2">
                  By continuing, you agree to Canvas's <a href="#" className="text-primary hover:underline">Terms of Use</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-secondary text-secondary-foreground text-[15px] font-medium rounded-sm shadow-sm hover:bg-secondary/90 transition-colors disabled:opacity-70 mt-2 font-display"
                >
                  {loading ? "Please wait..." : isLogin ? "Login" : "Continue"}
                </button>
              </form>
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setName("");
                }}
                className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
              >
                {isLogin ? "New to Canvas? Create an account" : "Existing User? Log in"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
