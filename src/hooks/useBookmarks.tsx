import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Bookmark = Tables<"bookmarks">;

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load bookmarks");
    } else {
      setBookmarks(data ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Realtime subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks", filter: `user_id=eq.${userId}` },
        () => {
          fetchBookmarks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchBookmarks]);

  const addBookmark = async (title: string, url: string, tags: string[] = []) => {
    if (!userId) return;
    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: userId,
      tags,
    });
    if (error) {
      toast.error("Failed to add bookmark");
    } else {
      toast.success("Bookmark added");
    }
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete bookmark");
    } else {
      toast.success("Bookmark deleted");
    }
  };

  return { bookmarks, loading, addBookmark, deleteBookmark };
}
