import { useState, useMemo } from "react";
import { Bookmark, LogOut, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  // Filter bookmarks
  const filtered = useMemo(() => {
    return bookmarks.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q || b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q);
      const matchesTag = !activeTag || b.tags?.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [bookmarks, search, activeTag]);

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

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
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <AddBookmarkForm onAdd={addBookmark} />

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks by title or URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "secondary"}
                className="cursor-pointer transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
            {activeTag && (
              <button
                onClick={() => setActiveTag(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear filter
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <Bookmark className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">
              {bookmarks.length === 0
                ? "No bookmarks yet. Add your first one above!"
                : "No bookmarks match your search."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <BookmarkCard key={b.id} bookmark={b} onDelete={deleteBookmark} onTagClick={handleTagClick} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
