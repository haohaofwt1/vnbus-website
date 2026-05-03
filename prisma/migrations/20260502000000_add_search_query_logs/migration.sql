CREATE TABLE "SearchQueryLog" (
  "id" TEXT NOT NULL,
  "fromSlug" TEXT,
  "toSlug" TEXT,
  "vehicleSlug" TEXT,
  "smart" TEXT,
  "departureDate" TIMESTAMP(3),
  "passengerCount" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "SearchQueryLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SearchQueryLog_fromSlug_toSlug_idx" ON "SearchQueryLog"("fromSlug", "toSlug");
CREATE INDEX "SearchQueryLog_vehicleSlug_idx" ON "SearchQueryLog"("vehicleSlug");
CREATE INDEX "SearchQueryLog_smart_idx" ON "SearchQueryLog"("smart");
CREATE INDEX "SearchQueryLog_createdAt_idx" ON "SearchQueryLog"("createdAt");
