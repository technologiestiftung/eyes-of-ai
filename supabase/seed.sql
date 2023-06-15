INSERT INTO storage.buckets(id, name)
	VALUES ('eotai_images', 'eotai_images');

UPDATE
	"storage".buckets
SET
	"public" = TRUE
WHERE
	buckets.id = 'eotai_images';

