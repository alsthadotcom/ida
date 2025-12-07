import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lightbulb, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`, // Need a page to handle the update
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: "Reset link sent!",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md" />
            <Lightbulb className="relative w-6 h-6 text-primary" />
          </div>
          <span className="font-outfit font-bold text-2xl text-foreground">ida</span>
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-outfit font-bold text-foreground mb-2">
          Reset your password
        </h1>
        <p className="text-muted-foreground mb-8">
          {sent
            ? "We've sent you an email with reset instructions."
            : "Enter your email and we'll send you a reset link."
          }
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-muted/50 border-border/50"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <div className="glass-card p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>
              Try Again
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
