DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('income', 'expense', 'either');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"image_url" text NOT NULL,
	"type" "type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "planned_transaction" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" real DEFAULT 0 NOT NULL,
	"is_expense" boolean DEFAULT true NOT NULL,
	"frequency" smallint DEFAULT 1 NOT NULL,
	"occurrences_this_month" smallint DEFAULT 0 NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"title" text NOT NULL,
	"category_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"amount" real DEFAULT 0 NOT NULL,
	"is_expense" boolean DEFAULT true NOT NULL,
	"title" text NOT NULL,
	"category_uuid" uuid NOT NULL,
	"planned_transaction_uuid" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_uuid_category_uuid_fk" FOREIGN KEY ("category_uuid") REFERENCES "category"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_planned_transaction_uuid_planned_transaction_uuid_fk" FOREIGN KEY ("planned_transaction_uuid") REFERENCES "planned_transaction"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
