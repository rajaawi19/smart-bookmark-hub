import { useState } from "react";
import { Plus, X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AddBookmarkFormProps {
  onAdd: (title: string, url: string, tags: string[]) => Promise<void>;
}

function isValidUrl(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      toast.error("Title is required");
      return;
    }
    if (!isValidUrl(trimmedUrl)) {
      toast.error("Please enter a valid URL (including https://)");
      return;
    }

    setSubmitting(true);
    await onAdd(trimmedTitle, trimmedUrl, tags);
    setTitle("");
    setUrl("");
    setTags([]);
    setShowTags(false);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-5 rounded-2xl bg-card border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-background border-border h-11 rounded-xl"
          maxLength={200}
        />
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-background border-border h-11 rounded-xl"
          maxLength={2048}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowTags(!showTags)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Tag className="w-3.5 h-3.5" />
          {showTags ? "Hide tags" : "Add tags"}
          {tags.length > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-1.5 py-0.5 rounded-full">
              {tags.length}
            </span>
          )}
        </button>
        <Button type="submit" disabled={submitting} className="shrink-0 rounded-xl h-10 px-5 shadow-sm">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Bookmark
        </Button>
      </div>

      <AnimatePresence>
        {showTags && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Input
                placeholder="Type a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-52 bg-background border-border h-8 text-sm rounded-lg"
                maxLength={50}
              />
              <AnimatePresence>
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs cursor-default">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer hover:text-destructive transition-colors" onClick={() => removeTag(tag)} />
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
