-- CreateTable
CREATE TABLE "public"."ApplicationError" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "level" TEXT NOT NULL DEFAULT 'error',
    "method" TEXT,
    "route" TEXT,
    "statusCode" INTEGER,
    "correlationId" TEXT,
    "userId" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PerformanceMetric" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTime" DOUBLE PRECISION NOT NULL,
    "correlationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PerformanceMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AlertEvent" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "threshold" DOUBLE PRECISION,
    "actualValue" DOUBLE PRECISION,
    "correlationId" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationError_createdAt_idx" ON "public"."ApplicationError"("createdAt");

-- CreateIndex
CREATE INDEX "ApplicationError_correlationId_idx" ON "public"."ApplicationError"("correlationId");

-- CreateIndex
CREATE INDEX "ApplicationError_statusCode_idx" ON "public"."ApplicationError"("statusCode");

-- CreateIndex
CREATE INDEX "ApplicationError_level_idx" ON "public"."ApplicationError"("level");

-- CreateIndex
CREATE INDEX "PerformanceMetric_createdAt_idx" ON "public"."PerformanceMetric"("createdAt");

-- CreateIndex
CREATE INDEX "PerformanceMetric_route_idx" ON "public"."PerformanceMetric"("route");

-- CreateIndex
CREATE INDEX "PerformanceMetric_statusCode_idx" ON "public"."PerformanceMetric"("statusCode");

-- CreateIndex
CREATE INDEX "AlertEvent_createdAt_idx" ON "public"."AlertEvent"("createdAt");

-- CreateIndex
CREATE INDEX "AlertEvent_severity_idx" ON "public"."AlertEvent"("severity");

-- CreateIndex
CREATE INDEX "AlertEvent_resolved_idx" ON "public"."AlertEvent"("resolved");
