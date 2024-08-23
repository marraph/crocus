ALTER TABLE "absences" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "absences" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "absences" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "absences" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "entries" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "organisations" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "topic_id" integer;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "created_at" timestamp;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "created_by" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "updated_by" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "absences" ADD CONSTRAINT "absences_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "absences" ADD CONSTRAINT "absences_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entries" ADD CONSTRAINT "entries_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisations" ADD CONSTRAINT "organisations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisations" ADD CONSTRAINT "organisations_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topics" ADD CONSTRAINT "topics_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topics" ADD CONSTRAINT "topics_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
