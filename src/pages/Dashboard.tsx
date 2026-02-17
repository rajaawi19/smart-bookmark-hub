import { useState, useMemo } from "react";
import { Bookmark, LogOut, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkCard } from "@/components/BookmarkCard";
import { ImportExportBookmarks } from "@/components/ImportExportBookmarks";
import { useBookmarks } from "@/hooks/useBookmarks";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardProps {
  userId: string;
  userEmail?: string;
  onSignOut: () => void;
}

export default function Dashboard({ userId, userEmail, onSignOut }: DashboardProps) {
  const { bookmarks, loading, addBookmark, updateBookmark, deleteBookmark } = useBookmarks(userId);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [bookmarks]);

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
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Bookmark className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              Smart Bookmarks
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userEmail && (
              <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[200px]">{userEmail}</span>
            )}
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={onSignOut} aria-label="Sign out" className="rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AddBookmarkForm onAdd={addBookmark} />
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks by title or URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border h-11 rounded-xl"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Tag filter */}
        <AnimatePresence>
          {allTags.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mr-1">Tags</span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={activeTag === tag ? "default" : "secondary"}
                  className="cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {activeTag && (
                <button
                  onClick={() => setActiveTag(null)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  ✕ Clear
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bookmark count */}
        {!loading && bookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
            </p>
            <ImportExportBookmarks bookmarks={bookmarks} onImport={addBookmark} />
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="text-center py-16 space-y-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground">
              {bookmarks.length === 0
                ? "No bookmarks yet. Add your first one above!"
                : "No bookmarks match your search."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((b) => (
                <BookmarkCard key={b.id} bookmark={b} onDelete={deleteBookmark} onUpdate={updateBookmark} onTagClick={handleTagClick} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
