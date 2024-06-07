CREATE TABLE IF NOT EXISTS "onboarding_forms" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"form_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
