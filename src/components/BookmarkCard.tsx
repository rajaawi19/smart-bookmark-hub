import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";

interface BookmarkCardProps {
  bookmark: Tables<"bookmarks">;
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

export function BookmarkCard({ bookmark, onDelete, onTagClick }: BookmarkCardProps) {
  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="group flex items-start gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
    >
      <img
        src={faviconUrl}
        alt=""
        className="w-10 h-10 rounded-lg bg-muted p-1.5 shrink-0 mt-0.5 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
      <div className="hidden items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary font-bold text-lg shrink-0 font-[var(--font-display)] mt-0.5">
        {bookmark.title.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <h3 className="font-semibold text-foreground truncate leading-snug">{bookmark.title}</h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 truncate transition-colors"
        >
          {hostname}
          <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {bookmark.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs px-2 py-0.5"
                onClick={() => onTagClick?.(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(bookmark.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0 rounded-lg"
        aria-label="Delete bookmark"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
