import { Bookmark, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkCard } from "@/components/BookmarkCard";
import { useBookmarks } from "@/hooks/useBookmarks";

interface DashboardProps {
  userId: string;
  userEmail?: string;
  onSignOut: () => void;
}

export default function Dashboard({ userId, userEmail, onSignOut }: DashboardProps) {
  const { bookmarks, loading, addBookmark, deleteBookmark } = useBookmarks(userId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Smart Bookmarks
            </span>
          </div>
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:block">{userEmail}</span>
            )}
            <Button variant="ghost" size="icon" onClick={onSignOut} aria-label="Sign out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <AddBookmarkForm onAdd={addBookmark} />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No bookmarks yet. Add your first one above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((b) => (
              <BookmarkCard key={b.id} bookmark={b} onDelete={deleteBookmark} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
