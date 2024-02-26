CREATE TABLE IF NOT EXISTS "formbase_email_verification_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(8) NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "formbase_email_verification_codes_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_form_datas" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"form_id" varchar(15) NOT NULL,
	"data" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_forms" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"return_url" varchar(255),
	"send_email_for_new_submissions" boolean DEFAULT true NOT NULL,
	"keys" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_password_reset_tokens" (
	"id" varchar(40) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_posts" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(10) DEFAULT 'draft' NOT NULL,
	"tags" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formbase_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"github_id" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"hashed_password" varchar(255),
	"avatar" varchar(255),
	"stripe_subscription_id" varchar(191),
	"stripe_price_id" varchar(191),
	"stripe_customer_id" varchar(191),
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
CREATE INDEX IF NOT EXISTS "posts_user_idx" ON "formbase_posts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "post_created_at_idx" ON "formbase_posts" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_idx" ON "formbase_sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_idx" ON "formbase_users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "github_idx" ON "formbase_users" ("github_id");