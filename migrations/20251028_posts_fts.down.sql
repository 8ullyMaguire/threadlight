DROP INDEX IF EXISTS posts_search_tsv_idx;
ALTER TABLE posts DROP COLUMN IF EXISTS search_tsv;
