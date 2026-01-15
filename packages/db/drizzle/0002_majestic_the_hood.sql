ALTER TABLE `form_datas` ADD `is_spam` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `form_datas` ADD `spam_reason` text;--> statement-breakpoint
ALTER TABLE `form_datas` ADD `manual_override` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `forms` ADD `honeypot_field` text DEFAULT '_gotcha' NOT NULL;