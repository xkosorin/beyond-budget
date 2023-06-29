CREATE TABLE IF NOT EXISTS "budget" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"size" real DEFAULT 0 NOT NULL,
	"spent" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "label_to_transaction" (
	"label_id" uuid NOT NULL,
	"transaction_uuid" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "label_to_transaction" ADD CONSTRAINT "label_to_transaction_label_id_transaction_uuid" PRIMARY KEY("label_id","transaction_uuid");
--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "category_uuid" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label_to_transaction" ADD CONSTRAINT "label_to_transaction_label_id_label_uuid_fk" FOREIGN KEY ("label_id") REFERENCES "label"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "label_to_transaction" ADD CONSTRAINT "label_to_transaction_transaction_uuid_transaction_uuid_fk" FOREIGN KEY ("transaction_uuid") REFERENCES "transaction"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
