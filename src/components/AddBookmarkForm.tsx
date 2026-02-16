import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddBookmarkFormProps {
  onAdd: (title: string, url: string) => Promise<void>;
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
  const [submitting, setSubmitting] = useState(false);

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
    await onAdd(trimmedTitle, trimmedUrl);
    setTitle("");
    setUrl("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <Input
        placeholder="Bookmark title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-card border-border"
        maxLength={200}
      />
      <Input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 bg-card border-border"
        maxLength={2048}
      />
      <Button type="submit" disabled={submitting} className="shrink-0">
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </form>
  );
}
