CREATE TABLE "public"."eotai_images"(
	"id" uuid NOT NULL,
	"created_at" timestamp without time zone NOT NULL DEFAULT now(),
	"prompt" text NOT NULL,
	"url" text
);

ALTER TABLE "public"."eotai_images" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX eotai_images_pkey ON public.eotai_images USING btree(id);

ALTER TABLE "public"."eotai_images"
	ADD CONSTRAINT "eotai_images_pkey" PRIMARY KEY USING INDEX "eotai_images_pkey";

CREATE POLICY "Enable read access for all users" ON "public"."eotai_images" AS permissive
	FOR SELECT TO public
		USING (TRUE);

