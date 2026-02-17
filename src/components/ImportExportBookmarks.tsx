import { useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Bookmark = Tables<"bookmarks">;

interface ImportExportProps {
  bookmarks: Bookmark[];
  onImport: (title: string, url: string, tags: string[]) => Promise<void>;
}

function bookmarksToJSON(bookmarks: Bookmark[]) {
  const data = bookmarks.map((b) => ({
    title: b.title,
    url: b.url,
    tags: b.tags ?? [],
    created_at: b.created_at,
  }));
  return JSON.stringify(data, null, 2);
}

function bookmarksToCSV(bookmarks: Bookmark[]) {
  const header = "title,url,tags,created_at";
  const rows = bookmarks.map((b) => {
    const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;
    return [
      escape(b.title),
      escape(b.url),
      escape((b.tags ?? []).join(";")),
      escape(b.created_at),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): { title: string; url: string; tags: string[] }[] {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];

  const results: { title: string; url: string; tags: string[] }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < lines[i].length; j++) {
      const ch = lines[i][j];
      if (inQuotes) {
        if (ch === '"' && lines[i][j + 1] === '"') {
          current += '"';
          j++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          fields.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    fields.push(current);

    const [title, url, tagsStr] = fields;
    if (title && url) {
      results.push({
        title: title.trim(),
        url: url.trim(),
        tags: tagsStr ? tagsStr.split(";").map((t) => t.trim()).filter(Boolean) : [],
      });
    }
  }
  return results;
}

export function ImportExportBookmarks({ bookmarks, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleExportJSON = () => {
    download(bookmarksToJSON(bookmarks), "bookmarks.json", "application/json");
    toast.success(`Exported ${bookmarks.length} bookmarks as JSON`);
  };

  const handleExportCSV = () => {
    download(bookmarksToCSV(bookmarks), "bookmarks.csv", "text/csv");
    toast.success(`Exported ${bookmarks.length} bookmarks as CSV`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      let items: { title: string; url: string; tags: string[] }[] = [];

      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        const arr = Array.isArray(parsed) ? parsed : [];
        items = arr
          .filter((item: any) => item.title && item.url)
          .map((item: any) => ({
            title: String(item.title),
            url: String(item.url),
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          }));
      } else if (file.name.endsWith(".csv")) {
        items = parseCSV(text);
      } else {
        toast.error("Please upload a .json or .csv file");
        return;
      }

      if (items.length === 0) {
        toast.error("No valid bookmarks found in file");
        return;
      }

      let imported = 0;
      for (const item of items) {
        await onImport(item.title, item.url, item.tags);
        imported++;
      }
      toast.success(`Imported ${imported} bookmark${imported !== 1 ? "s" : ""}`);
    } catch {
      toast.error("Failed to parse file");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-xl h-9 gap-1.5 text-xs" disabled={importing}>
            {importing ? (
              <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {importing ? "Importing…" : "Import / Export"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuItem onClick={handleExportJSON} className="gap-2 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportCSV} className="gap-2 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            Import from file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
