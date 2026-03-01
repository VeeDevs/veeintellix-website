import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Lock, Mail, ArrowLeft, UserPlus } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const { signIn, signUp, isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Navigate to dashboard once admin status is confirmed
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignupMode && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (isSignupMode) {
        await signUp(email, password);
        toast.success("Account created. Please verify your email, then sign in.");
        setIsSignupMode(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        await signIn(email, password);
        toast.success("Logged in successfully — verifying admin access...");
      }
    } catch (err: any) {
      toast.error(err.message || (isSignupMode ? "Signup failed" : "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to site
        </button>

        <div className="glass rounded-xl p-8 border border-border">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Lock className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold">{isSignupMode ? "Admin Sign Up" : "Admin Login"}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignupMode ? "Create your admin account to request access" : "Sign in to manage quotes"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="admin@veeintellix.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {isSignupMode && (
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Confirm Password</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition-colors"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium text-primary-foreground transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              {loading ? (isSignupMode ? "Creating account..." : "Signing in...") : (isSignupMode ? "Create Account" : "Sign In")}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignupMode((prev) => !prev);
                setPassword("");
                setConfirmPassword("");
              }}
              className="w-full py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
            >
              {isSignupMode ? "Already have an account? Sign In" : "No account yet? Create one"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
