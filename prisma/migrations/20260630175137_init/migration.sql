-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "targetCount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "dir" TEXT NOT NULL,
    "solutionFile" TEXT NOT NULL DEFAULT 'index.ts',
    "starterCode" TEXT NOT NULL,
    "judged" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Problem_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GeneratedTest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'generated',
    "testCode" TEXT NOT NULL,
    CONSTRAINT "GeneratedTest_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verdict" TEXT NOT NULL,
    "passed" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "failingTests" JSONB,
    "outcome" TEXT NOT NULL,
    "timeSpentMin" INTEGER,
    "confidence" INTEGER,
    "notes" TEXT,
    "nextReviewAt" DATETIME,
    "interval" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
