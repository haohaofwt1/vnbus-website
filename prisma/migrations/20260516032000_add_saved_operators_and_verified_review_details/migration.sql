-- Add customer saved-operator bookmarks.
CREATE TABLE "SavedOperator" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedOperator_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SavedOperator_userId_operatorId_key" ON "SavedOperator"("userId", "operatorId");
CREATE INDEX "SavedOperator_operatorId_idx" ON "SavedOperator"("operatorId");
CREATE INDEX "SavedOperator_userId_idx" ON "SavedOperator"("userId");

ALTER TABLE "SavedOperator"
ADD CONSTRAINT "SavedOperator_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SavedOperator"
ADD CONSTRAINT "SavedOperator_operatorId_fkey"
FOREIGN KEY ("operatorId") REFERENCES "Operator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add optional verified-review detail fields. All columns are nullable to keep the migration safe.
ALTER TABLE "Review"
ADD COLUMN "punctualityRating" INTEGER,
ADD COLUMN "vehicleQualityRating" INTEGER,
ADD COLUMN "cleanlinessRating" INTEGER,
ADD COLUMN "serviceRating" INTEGER,
ADD COLUMN "pickupDropoffRating" INTEGER,
ADD COLUMN "supportRating" INTEGER,
ADD COLUMN "operatorReply" TEXT,
ADD COLUMN "operatorRepliedAt" TIMESTAMP(3);
