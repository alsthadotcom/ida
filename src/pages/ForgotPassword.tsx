import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("Password reset link sent! Check your email.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background font-sans overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-primary/[0.08] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '7s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/[0.08] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '9s' }} />
      </div>

      {/* Centered Layout */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-background/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-10 relative overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {!emailSent ? (
                <>
                  <div className="text-center space-y-3">
                    <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-2">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black font-outfit">Forgot Password?</h2>
                    <p className="text-muted-foreground">
                      No worries! Enter your email and we'll send you a reset link.
                    </p>
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-sm font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-6 py-4">
                  <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 mb-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black font-outfit">Check Your Email</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We've sent a password reset link to <span className="font-bold text-foreground">{email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click the link in the email to reset your password. If you don't see it, check your spam folder.
                    </p>
                  </div>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full h-12 border-border/50 hover:bg-secondary/20 hover:border-primary/30 transition-all"
                  >
                    Send Another Link
                  </Button>
                </div>
              )}

              <div className="text-center pt-4 border-t border-border/30">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
