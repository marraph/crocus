ALTER TABLE "absences" DROP CONSTRAINT "absences_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "entries" DROP CONSTRAINT "entries_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "absences" DROP COLUMN IF EXISTS "updated_by";--> statement-breakpoint
ALTER TABLE "entries" DROP COLUMN IF EXISTS "updated_by";