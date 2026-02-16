import { Bookmark, ArrowRight, Sparkles, Globe, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { motion } from "framer-motion";

const features = [
  { icon: Sparkles, label: "Smart tagging", desc: "Organize with custom tags" },
  { icon: Globe, label: "Real-time sync", desc: "Updates across all tabs" },
  { icon: Zap, label: "Instant search", desc: "Find anything in milliseconds" },
];

export default function Landing() {
  const handleGoogleSignIn = async () => {
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-3xl pointer-events-none" />

      <div className="max-w-lg w-full text-center space-y-10 relative z-10">
        <motion.div
          className="flex flex-col items-center gap-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="w-18 h-18 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 p-4">
            <Bookmark className="w-9 h-9 text-primary-foreground" />
          </div>
          <h1 className="text-5xl tracking-tight text-foreground leading-tight">
            Smart Bookmarks
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
            Save, organize, and access your favourite links from anywhere — beautifully.
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground shadow-sm"
            >
              <f.icon className="w-4 h-4 text-primary" />
              <div className="text-left">
                <span className="font-medium">{f.label}</span>
                <span className="text-muted-foreground ml-1.5 hidden sm:inline">· {f.desc}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            onClick={handleGoogleSignIn}
            size="lg"
            className="w-full text-base gap-3 h-13 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Button>
        </motion.div>

        <motion.p
          className="text-xs text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Your bookmarks are private and encrypted. No data shared with third parties.
        </motion.p>
      </div>
    </div>
  );
}
