set dotenv-load

default:
	just --list


migration:
	supabase db --db-url $DATABASE_URL diff --file migration  --schema public,extensions,storage --use-migra

types:
	gen types typescript --db-url $DATABASE_URL > lib/database.ts

backup_images:
	mkdir -p ./storage/stub/
	mkdir /tmp/sync_temp
	docker cp supabase_storage_eyes-of-ai:/var/lib/storage/ /tmp/sync_temp/
	rsync --archive --verbose --update /tmp/sync_temp/ ./storage/stub/
	rm -rf /tmp/sync_temp/

restore_images:
	docker cp ./storage/stub supabase_storage_eyes-of-ai:/var/lib/storage/


backup_db:
	mkdir -p backup
	pg_dump -d $DATABASE_URL --data-only --no-owner -t public.eotai_images -t storage.objects -f backup/backup.sql

restore_db:
	psql -d $DATABASE_URL -f backup/backup.sql

docker_build:
	echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
	echo $NEXT_PUBLIC_SUPABASE_URL
	docker build \
		--progress=plain \
		--no-cache \
		--build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
		--build-arg NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
		--build-arg NEXT_PUBLIC_HUMAN_MODELS_PATH=$NEXT_PUBLIC_HUMAN_MODELS_PATH \
		-t technologiestiftung:eyes-of-the-ai .

docker_run:
	docker run --env-file ./.env -p 3000:3000 technologiestiftung:eyes-of-the-ai