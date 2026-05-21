import React, { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AtSign,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type PasswordStrength = "empty" | "weak" | "medium" | "strong";

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return "empty";
  if (password.length < 8) return "weak";

  let classes = 0;
  if (/[a-z]/.test(password)) classes++;
  if (/[A-Z]/.test(password)) classes++;
  if (/[0-9]/.test(password)) classes++;
  if (/[^A-Za-z0-9]/.test(password)) classes++;

  if (classes >= 3) return "strong";
  if (classes >= 2) return "medium";
  return "weak";
}

const LABEL =
  "ml-0.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#5c2a2a]/70 sm:text-[12px]";

const INPUT_BASE =
  "min-w-0 h-11 min-h-[44px] rounded-xl border border-transparent bg-[#F8F4F1] pl-10 pr-2.5 text-sm font-body leading-tight text-[#1a1010] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-offset-0 transition-all duration-300 ease-out placeholder:text-[#7E1E1E]/42 hover:border-[#7E1E1E]/15 hover:bg-[#FFFCFA]/78 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_2px_12px_rgba(62,24,24,0.055)] hover:placeholder:text-[#7E1E1E]/58 focus-visible:border-[#7E1E1E]/22 focus-visible:bg-[#FFFCFA]/90 focus-visible:shadow-[inset_0_1px_0_rgba(255,255,255,0.88),0_0_0_1px_rgba(126,30,30,0.07),0_2px_14px_rgba(62,24,24,0.07)] focus-visible:placeholder:text-[#7E1E1E]/52 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7E1E1E]/16 focus-visible:ring-offset-0 sm:h-[50px] sm:min-h-0 sm:rounded-2xl sm:pl-11 sm:pr-3 sm:text-[15px]";

const ICON_LEFT =
  "pointer-events-none absolute left-3 top-1/2 z-[2] h-4 w-4 -translate-y-1/2 text-[#7E1E1E]/30 transition-colors duration-300 group-hover:text-[#7E1E1E]/42 group-focus-within:text-[#7E1E1E]/55 sm:left-3.5 sm:h-[18px] sm:w-[18px]";

const NOISE_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, authModalTab } = useAuth();
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  React.useEffect(() => {
    if (isAuthModalOpen) setAuthTab(authModalTab);
  }, [isAuthModalOpen, authModalTab]);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    username: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordStrength = useMemo(
    () => getPasswordStrength(signupData.password),
    [signupData.password],
  );

  const validateMobile = (value: string) => value.replace(/\D/g, "").slice(0, 10);
  const normalizeUsername = (value: string) =>
    value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);

  const validateLoginIdentifier = (raw: string): string | null => {
    const trimmed = raw.trim();
    if (!trimmed) return "Enter your email or mobile number";
    if (trimmed.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address";
      return null;
    }
    const digits = trimmed.replace(/\D/g, "");
    if (digits.length !== 10) return "Enter a valid 10-digit mobile number";
    return null;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const idErr = validateLoginIdentifier(loginData.identifier);
    if (idErr) {
      setError(idErr);
      return;
    }
    const trimmed = loginData.identifier.trim();
    const loginId = trimmed.includes("@") ? trimmed : validateMobile(trimmed);

    setIsLoading(true);
    try {
      await login(loginId, loginData.password, rememberMe);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      if (msg === "Failed to fetch") {
        setError("Connection failed. Is the server running? (Check CORS or server status)");
      } else {
        setError(msg || "Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions to continue");
      return;
    }

    if (signupData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (passwordStrength === "weak") {
      setError("Password is too weak — mix upper & lower case, numbers, or symbols");
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(signupData.username)) {
      setError("Username must be 3–20 characters (letters, numbers, underscore only)");
      return;
    }

    if (signupData.email.trim()) {
      const em = signupData.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        setError("Enter a valid email or leave it blank");
        return;
      }
    }

    setIsLoading(true);
    try {
      await signup(
        signupData.name.trim(),
        signupData.mobileNumber,
        signupData.password,
        signupData.email.trim() || undefined,
        signupData.username.trim(),
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed";
      if (msg === "Failed to fetch") {
        setError("Connection failed. Is the server running?");
      } else {
        setError(msg || "Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLabel =
    passwordStrength === "weak"
      ? "Weak"
      : passwordStrength === "medium"
        ? "Medium"
        : passwordStrength === "strong"
          ? "Strong"
          : "";

  const strengthColor =
    passwordStrength === "weak"
      ? "text-amber-700"
      : passwordStrength === "medium"
        ? "text-amber-600"
        : passwordStrength === "strong"
          ? "text-emerald-700"
          : "text-[#7E1E1E]/40";

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
      <DialogContent
        overlayClassName={cn(
          "z-50 bg-[radial-gradient(ellipse_90%_60%_at_50%_-20%,rgba(214,119,66,0.45),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(126,30,30,0.22),transparent),rgba(10,4,4,0.86)]",
          "backdrop-blur-md backdrop-saturate-150",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        )}
        className={cn(
          "flex max-h-[min(92dvh,880px)] w-[min(100%,calc(100vw-1.25rem))] max-w-[min(420px,calc(100vw-1.25rem))] flex-col gap-0 overflow-hidden border-none bg-white p-0 font-body shadow-2xl sm:max-w-[440px] md:max-w-[460px] lg:max-w-[472px] sm:rounded-[20px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: 0.045,
            backgroundImage: `url("${NOISE_DATA_URI}")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />

        <div className="pointer-events-none absolute -right-24 -top-28 z-0 h-72 w-72 rounded-full bg-[#D2691E]/25 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/3 z-0 h-56 w-56 animate-pulse rounded-full bg-[#7E1E1E]/18 blur-3xl [animation-duration:5s]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 z-0 h-40 w-40 animate-pulse rounded-full bg-[#D2691E]/15 blur-2xl [animation-duration:3.5s]" />

        <div className="relative z-10 h-1 w-full shrink-0 bg-gradient-to-r from-[#7E1E1E] via-[#D2691E] to-[#7E1E1E] sm:h-1.5" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-4 pt-5 sm:px-7 sm:pt-6">
            <div className="mb-5 flex flex-col items-center sm:mb-6">
            <div className="mb-2 transition-transform duration-300 hover:scale-[1.02] sm:mb-3">
              <img
                src="/ON_CANVAS_FULL_Logo-removebg-preview.png"
                alt="OnCanvas"
                className="h-[5.25rem] w-auto object-contain drop-shadow-sm sm:h-24 md:h-[6.75rem]"
              />
            </div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.28em] text-[#7E1E1E]/90 sm:text-[15px] sm:tracking-[0.32em]">
              OnCanvas
            </p>
            <p className="mt-1 font-body text-[11px] font-medium tracking-wide text-[#7E1E1E]/60 sm:mt-1.5 sm:text-xs sm:text-[13px]">
              Crafted with Precision
            </p>
            <div className="mt-4 flex flex-col items-center gap-1 text-center sm:mt-5 sm:gap-1.5">
              <h2 className="font-display text-2xl font-semibold leading-tight tracking-tight text-[#2c1212] sm:text-[1.6rem] md:text-[1.65rem]">
                Welcome Back
              </h2>
              <p className="max-w-[260px] font-body text-xs font-normal leading-snug text-[#7E1E1E]/65 sm:max-w-[280px] sm:text-sm">
                Experience the art of precision
              </p>
            </div>
            </div>
          </div>

          <Tabs
            value={authTab}
            onValueChange={(v) => {
              setAuthTab(v as "login" | "signup");
              setError("");
            }}
            className="flex min-h-0 w-full flex-1 flex-col"
          >
            <div className="shrink-0 px-4 sm:px-7">
            <div className="relative mb-4 grid h-12 grid-cols-2 gap-1 rounded-xl bg-[#E8E0DA]/85 p-1 shadow-[inset_0_1px_3px_rgba(62,18,18,0.08)] sm:mb-5 sm:h-[52px] sm:rounded-2xl sm:p-1.5">
              <div
                className={cn(
                  "absolute top-1 bottom-1 w-[calc(50%-8px)] rounded-lg bg-white shadow-[0_0_0_1px_rgba(126,30,30,0.06),0_6px_20px_rgba(62,18,18,0.09)] transition-all duration-300 ease-out sm:top-1.5 sm:bottom-1.5 sm:w-[calc(50%-10px)] sm:rounded-xl sm:shadow-[0_0_0_1px_rgba(126,30,30,0.06),0_8px_28px_rgba(62,18,18,0.1)]",
                  authTab === "login" ? "left-1 sm:left-1.5" : "left-[calc(50%+2px)] sm:left-[calc(50%+4px)]",
                )}
              />
              <TabsList className="relative z-10 col-span-2 grid h-full w-full grid-cols-2 gap-0 bg-transparent p-0">
                <TabsTrigger
                  value="login"
                  className={cn(
                    "relative z-10 h-full rounded-xl border-0 bg-transparent text-sm font-semibold text-[#5c2a2a]/55 shadow-none transition-all duration-300",
                    "hover:opacity-90 hover:text-[#7E1E1E]/85",
                    "data-[state=active]:text-[#7E1E1E] data-[state=active]:shadow-none",
                    "focus-visible:ring-2 focus-visible:ring-[#7E1E1E]/20",
                  )}
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className={cn(
                    "relative z-10 h-full rounded-xl border-0 bg-transparent text-sm font-semibold text-[#5c2a2a]/55 shadow-none transition-all duration-300",
                    "hover:opacity-90 hover:text-[#7E1E1E]/85",
                    "data-[state=active]:text-[#7E1E1E] data-[state=active]:shadow-none",
                    "focus-visible:ring-2 focus-visible:ring-[#7E1E1E]/20",
                  )}
                >
                  Register
                </TabsTrigger>
              </TabsList>
            </div>
            </div>

            <div className="auth-modal-form-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-4 pb-1 pt-1 sm:px-7 sm:pb-2 sm:pt-2">
            <TabsContent value="login" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="loginIdentifier" className={LABEL}>
                    Email or mobile
                  </Label>
                  <div className="group relative">
                    <AtSign
                      className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                      aria-hidden
                    />
                    <Input
                      id="loginIdentifier"
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      placeholder="you@email.com or 10-digit mobile"
                      required
                      value={loginData.identifier}
                      onChange={(e) =>
                        setLoginData({ ...loginData, identifier: e.target.value })
                      }
                      className={INPUT_BASE}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword" className={cn(LABEL, "px-0.5")}>
                    Password
                  </Label>
                  <div className="group relative">
                    <Lock
                      className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                      aria-hidden
                    />
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className={cn(INPUT_BASE, "pr-12")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7E1E1E]/35 transition-all duration-300 hover:bg-[#7E1E1E]/5 hover:text-[#7E1E1E]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-0.5 pt-1">
                    <div className="flex items-center gap-2.5">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(v) => setRememberMe(v === true)}
                        className="border-[#7E1E1E]/35 transition-colors data-[state=checked]:border-[#7E1E1E] data-[state=checked]:bg-[#7E1E1E]"
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="cursor-pointer text-sm font-medium leading-none text-[#3A1111]/85 transition-colors hover:text-[#2c1212]"
                      >
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 text-[11px] font-medium text-[#7E1E1E]/50 transition-all duration-300 hover:text-[#7E1E1E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex animate-in items-center gap-2 rounded-2xl border border-red-100 bg-red-50/95 p-3 text-sm text-red-600 fade-in slide-in-from-top-1">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "h-12 w-full rounded-xl bg-[#7E1E1E] font-semibold text-white shadow-lg shadow-[#7E1E1E]/25 sm:h-14 sm:rounded-2xl",
                    "transition-all duration-300 hover:scale-[1.01] hover:bg-[#5D1616] hover:shadow-[0_6px_24px_rgba(126,30,30,0.28)]",
                    "active:scale-[0.98]",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
              <form onSubmit={handleSignupSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid min-w-0 grid-cols-2 gap-x-2 gap-y-2.5 sm:gap-x-4 sm:gap-y-4">
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signupName" className={LABEL}>
                      Full name
                    </Label>
                    <div className="group relative">
                      <UserRound
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="signupName"
                        placeholder="Your full name"
                        required
                        value={signupData.name}
                        onChange={(e) =>
                          setSignupData({ ...signupData, name: e.target.value })
                        }
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signupMobile" className={LABEL}>
                      Mobile
                    </Label>
                    <div className="group relative">
                      <Smartphone
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="signupMobile"
                        type="tel"
                        inputMode="numeric"
                        placeholder="10-digit number"
                        required
                        value={signupData.mobileNumber}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            mobileNumber: validateMobile(e.target.value),
                          })
                        }
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signupEmail" className={LABEL}>
                      Email (optional)
                    </Label>
                    <div className="group relative">
                      <Mail
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="you@example.com"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({ ...signupData, email: e.target.value })
                        }
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signupUsername" className={LABEL}>
                      Username
                    </Label>
                    <div className="group relative">
                      <AtSign
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="signupUsername"
                        placeholder="unique_handle"
                        required
                        minLength={3}
                        maxLength={20}
                        value={signupData.username}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            username: normalizeUsername(e.target.value),
                          })
                        }
                        className={INPUT_BASE}
                      />
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="signupPassword" className={LABEL}>
                      Password
                    </Label>
                    <div className="group relative">
                      <Lock
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="signupPassword"
                        type={showSignupPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Min. 8 characters"
                        required
                        minLength={8}
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({ ...signupData, password: e.target.value })
                        }
                        className={cn(INPUT_BASE, "pr-12")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7E1E1E]/35 transition-all duration-300 hover:bg-[#7E1E1E]/5 hover:text-[#7E1E1E]"
                        aria-label={showSignupPassword ? "Hide password" : "Show password"}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="min-w-0 space-y-1.5 sm:space-y-2">
                    <Label htmlFor="confirmPassword" className={LABEL}>
                      Confirm password
                    </Label>
                    <div className="group relative">
                      <Lock
                        className={cn(ICON_LEFT, "group-focus-within:text-[#7E1E1E]/55")}
                        aria-hidden
                      />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat password"
                        required
                        minLength={8}
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className={cn(INPUT_BASE, "pr-12")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#7E1E1E]/35 transition-all duration-300 hover:bg-[#7E1E1E]/5 hover:text-[#7E1E1E]"
                        aria-label={
                          showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 rounded-xl border border-[#7E1E1E]/10 bg-[#FAF8F6] px-2.5 py-2 sm:space-y-2 sm:rounded-2xl sm:px-3 sm:py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#5c2a2a]/55 sm:text-[11px]">
                      Password strength
                    </span>
                    {passwordStrength !== "empty" && (
                      <span className={cn("text-xs font-semibold", strengthColor)}>
                        {strengthLabel}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    {(["weak", "medium", "strong"] as const).map((tier, i) => {
                      const activeIndex =
                        passwordStrength === "weak"
                          ? 0
                          : passwordStrength === "medium"
                            ? 1
                            : passwordStrength === "strong"
                              ? 2
                              : -1;
                      const filled = activeIndex >= i;
                      return (
                        <div
                          key={tier}
                          className={cn(
                            "h-1.5 flex-1 rounded-full transition-all duration-300",
                            !filled && "bg-[#7E1E1E]/10",
                            filled &&
                              tier === "weak" &&
                              "bg-gradient-to-r from-amber-500 to-amber-600",
                            filled &&
                              tier === "medium" &&
                              "bg-gradient-to-r from-amber-400 to-orange-500",
                            filled &&
                              tier === "strong" &&
                              "bg-gradient-to-r from-emerald-500 to-teal-600",
                          )}
                        />
                      );
                    })}
                  </div>
                  <p className="text-[10px] leading-relaxed text-[#5c2a2a]/55 sm:hidden">
                    8+ characters; add upper, lower, numbers, or symbols.
                  </p>
                  <p className="hidden text-[10px] leading-relaxed text-[#5c2a2a]/55 sm:block sm:text-[11px]">
                    Use at least 8 characters. Strong passwords include upper & lower case,
                    numbers, and symbols.
                  </p>
                </div>

                <label
                  htmlFor="acceptTerms"
                  className="flex cursor-pointer items-start gap-2.5 pt-0.5"
                >
                  <Checkbox
                    id="acceptTerms"
                    checked={acceptTerms}
                    onCheckedChange={(v) => setAcceptTerms(v === true)}
                    className="mt-0.5 border-[#7E1E1E]/35 transition-colors data-[state=checked]:border-[#7E1E1E] data-[state=checked]:bg-[#7E1E1E]"
                  />
                  <span className="text-left text-xs font-normal leading-snug text-[#3A1111]/80 sm:text-[13px]">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-[#7E1E1E] underline-offset-2 transition-colors hover:text-[#5D1616] hover:underline"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-[#7E1E1E] underline-offset-2 transition-colors hover:text-[#5D1616] hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50/95 p-3 text-sm text-red-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !acceptTerms}
                  className={cn(
                    "mt-0.5 h-12 w-full rounded-xl bg-[#7E1E1E] font-semibold text-white shadow-lg shadow-[#7E1E1E]/25 sm:mt-1 sm:h-14 sm:rounded-2xl",
                    "transition-all duration-300 hover:scale-[1.01] hover:bg-[#5D1616] hover:shadow-[0_6px_24px_rgba(126,30,30,0.28)]",
                    "active:scale-[0.98]",
                    "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none disabled:hover:scale-100 disabled:hover:shadow-none",
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </TabsContent>
            </div>
          </Tabs>

          <div className="shrink-0 px-4 pb-4 pt-2 sm:px-7 sm:pb-5 sm:pt-3">
          <p className="text-center font-body text-[10px] font-medium tracking-[0.12em] text-[#7E1E1E]/45 sm:text-[11px] sm:tracking-[0.14em]">
            Precision · Craftsmanship · Innovation
          </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
