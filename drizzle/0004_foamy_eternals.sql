ALTER TABLE "transaction" ALTER COLUMN "category_uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "budget_uuid" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_budget_uuid_budget_uuid_fk" FOREIGN KEY ("budget_uuid") REFERENCES "budget"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
