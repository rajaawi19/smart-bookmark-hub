import { useState } from "react";
import { ExternalLink, Trash2, Pencil, Check, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface BookmarkCardProps {
  bookmark: Tables<"bookmarks">;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { title?: string; url?: string; tags?: string[] }) => Promise<void>;
  onTagClick?: (tag: string) => void;
}

export function BookmarkCard({ bookmark, onDelete, onUpdate, onTagClick }: BookmarkCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title);
  const [editUrl, setEditUrl] = useState(bookmark.url);
  const [editTags, setEditTags] = useState<string[]>(bookmark.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const hostname = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

  const startEdit = () => {
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
    setEditTags(bookmark.tags ?? []);
    setTagInput("");
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const saveEdit = async () => {
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();
    if (!trimmedTitle) { toast.error("Title is required"); return; }
    try {
      new URL(trimmedUrl);
    } catch {
      toast.error("Please enter a valid URL"); return;
    }
    await onUpdate(bookmark.id, { title: trimmedTitle, url: trimmedUrl, tags: editTags });
    setEditing(false);
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !editTags.includes(tag)) setEditTags((p) => [...p, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setEditTags((p) => p.filter((t) => t !== tag));

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
  };

  if (editing) {
    return (
      <motion.div
        layout
        className="p-4 rounded-xl bg-card border-2 border-primary/30 space-y-3 shadow-lg shadow-primary/5"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="flex-1 bg-background border-border h-10 rounded-lg"
            maxLength={200}
            autoFocus
          />
          <Input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 bg-background border-border h-10 rounded-lg"
            maxLength={2048}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add tag + Enter"
            className="w-40 bg-background border-border h-8 text-sm rounded-lg"
            maxLength={50}
          />
          {editTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
              {tag}
              <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={cancelEdit} className="rounded-lg">
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={saveEdit} className="rounded-lg">
            <Check className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </motion.div>
    );
  }

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
        }}
      />
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
      <div className="flex gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={startEdit}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-lg"
          aria-label="Edit bookmark"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(bookmark.id)}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-lg"
          aria-label="Delete bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
