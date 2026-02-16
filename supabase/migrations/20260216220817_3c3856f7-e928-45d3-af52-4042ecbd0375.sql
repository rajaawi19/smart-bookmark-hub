
-- Add tags column to bookmarks
ALTER TABLE public.bookmarks ADD COLUMN tags text[] DEFAULT '{}';
