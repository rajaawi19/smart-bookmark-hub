import { ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

interface BookmarkCardProps {
  bookmark: Tables<"bookmarks">;
  onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-primary font-bold text-lg shrink-0 font-[var(--font-display)]">
        {bookmark.title.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{bookmark.title}</h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 truncate transition-colors"
        >
          {hostname}
          <ExternalLink className="w-3 h-3 shrink-0" />
        </a>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(bookmark.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
        aria-label="Delete bookmark"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
