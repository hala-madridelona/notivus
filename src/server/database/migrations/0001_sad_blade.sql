CREATE TABLE "otp" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"mobile" varchar(255) NOT NULL,
	"code" varchar(6) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mobile" varchar(255);