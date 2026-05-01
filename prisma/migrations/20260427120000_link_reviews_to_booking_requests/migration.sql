ALTER TABLE "BookingRequest"
ADD COLUMN "reviewToken" TEXT,
ADD COLUMN "reviewInvitedAt" TIMESTAMP(3),
ADD COLUMN "reviewSubmittedAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "BookingRequest_reviewToken_key" ON "BookingRequest"("reviewToken");

ALTER TABLE "Review"
ADD COLUMN "bookingRequestId" TEXT;

CREATE UNIQUE INDEX "Review_bookingRequestId_key" ON "Review"("bookingRequestId");
CREATE INDEX "Review_bookingRequestId_idx" ON "Review"("bookingRequestId");

ALTER TABLE "Review"
ADD CONSTRAINT "Review_bookingRequestId_fkey"
FOREIGN KEY ("bookingRequestId") REFERENCES "BookingRequest"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
