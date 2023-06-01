set dotenv-load

default:
	just --list


migration:
	supabase db --db-url $DATABASE_URL diff --file migration  --schema public,extensions,storage --use-migra

types:
	gen types typescript --db-url $DATABASE_URL > lib/database.ts