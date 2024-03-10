CREATE TABLE IF NOT EXISTS "formbase_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "formbase_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_form_datas" (
	"id" text PRIMARY KEY NOT NULL,
	"form_id" text NOT NULL,
	"data" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_forms" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"return_url" text,
	"send_email_for_new_submissions" boolean DEFAULT true NOT NULL,
	"keys" text[] NOT NULL,
	"enable_submissions" boolean DEFAULT true NOT NULL,
	"enable_retention" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_users" (
	"id" text PRIMARY KEY NOT NULL,
	"github_id" integer,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" text,
	"avatar" text,
	"stripe_subscription_id" text,
	"stripe_price_id" text,
	"stripe_customer_id" text,
	"stripe_current_period_end" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "formbase_users_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "formbase_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_verif_user_idx" ON "formbase_email_verification_codes" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_verif_idx" ON "formbase_email_verification_codes" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "form_idx" ON "formbase_form_datas" ("form_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "form_data_created_at_idx" ON "formbase_form_datas" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "form_user_idx" ON "formbase_forms" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "form_created_at_idx" ON "formbase_forms" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_user_idx" ON "formbase_password_reset_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "formbase_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "formbase_users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "github_idx" ON "formbase_users" ("github_id");