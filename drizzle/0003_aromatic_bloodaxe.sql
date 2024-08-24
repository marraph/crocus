ALTER TABLE "absences" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "comment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "project_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "project_id" integer;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "task_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
