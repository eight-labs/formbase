ALTER TABLE "formbase_email_verification_codes" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_email_verification_codes" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_email_verification_codes" ALTER COLUMN "code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_form_datas" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_form_datas" ALTER COLUMN "form_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_forms" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_forms" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_forms" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_forms" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_forms" ALTER COLUMN "return_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_password_reset_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_password_reset_tokens" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "title" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "excerpt" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_posts" ALTER COLUMN "tags" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "hashed_password" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "avatar" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "stripe_subscription_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "stripe_price_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "formbase_users" ALTER COLUMN "stripe_customer_id" SET DATA TYPE text;