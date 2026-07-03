-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attempt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "problemId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verdict" TEXT NOT NULL,
    "passed" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "failingTests" JSONB,
    "outcome" TEXT NOT NULL,
    "code" TEXT NOT NULL DEFAULT '',
    "language" TEXT NOT NULL DEFAULT 'typescript',
    "timeSpentMin" INTEGER,
    "confidence" INTEGER,
    "notes" TEXT,
    "nextReviewAt" DATETIME,
    "interval" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Attempt_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attempt" ("confidence", "createdAt", "failingTests", "id", "interval", "nextReviewAt", "notes", "outcome", "passed", "problemId", "timeSpentMin", "total", "verdict") SELECT "confidence", "createdAt", "failingTests", "id", "interval", "nextReviewAt", "notes", "outcome", "passed", "problemId", "timeSpentMin", "total", "verdict" FROM "Attempt";
DROP TABLE "Attempt";
ALTER TABLE "new_Attempt" RENAME TO "Attempt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
