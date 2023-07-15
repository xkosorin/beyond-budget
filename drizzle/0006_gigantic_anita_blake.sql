ALTER TABLE "budget" ALTER COLUMN "size" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "size" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "spent" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "spent" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "planned_transaction" ALTER COLUMN "amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "planned_transaction" ALTER COLUMN "amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DATA TYPE numeric(12, 2);--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "amount" SET DEFAULT '0';