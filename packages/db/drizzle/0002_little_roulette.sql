DROP TABLE "user";--> statement-breakpoint
DROP TABLE "session";--> statement-breakpoint
ALTER TABLE "oauth_account" DROP CONSTRAINT "oauth_account_user_id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
