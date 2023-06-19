ALTER TABLE "public"."eotai_images"
	ADD COLUMN "age" double precision;

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "color_dominant" integer[];

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "color_names" text[];

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "color_palette" integer[][];

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "emotion" json;

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "gender" text;

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "gender_score" double precision;

ALTER TABLE "public"."eotai_images"
	ADD COLUMN "gesture" json;

