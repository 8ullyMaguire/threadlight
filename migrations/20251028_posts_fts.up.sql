-- Full-text search over posts.
--
-- The six search endpoints were all `ILIKE '%q%'`: no index can serve a leading wildcard, so every
-- search was a sequential scan, and multi-word queries matched only as a literal substring ("quiet
-- room" found nothing unless those words were adjacent). A generated tsvector plus a GIN index fixes
-- both without a trigger to forget: the column is derived by Postgres on every write.
--
-- 'simple' rather than 'english' on purpose: post text is user prose with tags and punctuation, and
-- stemming quietly rewrites what people searched for ("running" should not stop matching "run" in
-- someone else's post). The winner referenced here was platform-core's search.rs query-language work;
-- only the FTS substrate is being taken, not its query syntax.

ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS search_tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;

CREATE INDEX IF NOT EXISTS posts_search_tsv_idx ON posts USING GIN (search_tsv);
