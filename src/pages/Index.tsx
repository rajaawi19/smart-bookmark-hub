import { useAuth } from "@/hooks/useAuth";
import Landing from "./Landing";
import Dashboard from "./Dashboard";

const Index = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return <Dashboard userId={user.id} userEmail={user.email} onSignOut={signOut} />;
};

export default Index;
