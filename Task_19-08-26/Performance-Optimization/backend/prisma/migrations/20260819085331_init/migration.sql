-- CreateTable
CREATE TABLE "public"."PerformanceMetric" (
    "id" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "rating" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "device" TEXT,
    "connection" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PerformanceMetric_metric_idx" ON "public"."PerformanceMetric"("metric");

-- CreateIndex
CREATE INDEX "PerformanceMetric_createdAt_idx" ON "public"."PerformanceMetric"("createdAt");

-- CreateIndex
CREATE INDEX "PerformanceMetric_page_idx" ON "public"."PerformanceMetric"("page");
