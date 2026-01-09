CREATE TABLE `api_audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`api_key_id` text,
	`user_id` text NOT NULL,
	`method` text NOT NULL,
	`path` text NOT NULL,
	`status_code` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`request_body` text,
	`response_time_ms` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`api_key_id`) REFERENCES `api_keys`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `api_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`key_hash` text NOT NULL,
	`key_prefix` text NOT NULL,
	`expires_at` integer,
	`last_used_at` integer,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `audit_api_key_idx` ON `api_audit_logs` (`api_key_id`);--> statement-breakpoint
CREATE INDEX `audit_user_idx` ON `api_audit_logs` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_created_at_idx` ON `api_audit_logs` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_hash_unique` ON `api_keys` (`key_hash`);--> statement-breakpoint
CREATE INDEX `api_key_user_idx` ON `api_keys` (`user_id`);--> statement-breakpoint
CREATE INDEX `api_key_hash_idx` ON `api_keys` (`key_hash`);