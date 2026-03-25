ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "User"
SET "permissions" = array_remove(ARRAY[
  CASE WHEN position('BLOG' IN upper("assignedSections")) > 0 THEN 'BLOG' END,
  CASE WHEN position('NEWS' IN upper("assignedSections")) > 0 THEN 'NEWS' END,
  CASE WHEN position('PROJECTS' IN upper("assignedSections")) > 0 THEN 'PROJECTS' END,
  CASE WHEN position('SITE' IN upper("assignedSections")) > 0 THEN 'SITE' END
], NULL)
WHERE cardinality("permissions") = 0
  AND "role" IN ('ADMIN', 'EDITOR');

UPDATE "User"
SET "permissions" = ARRAY['BLOG','NEWS','PROJECTS','SITE','USERS','CONTACTS','INTERESTS']
WHERE cardinality("permissions") = 0
  AND "role" = 'ADMIN';
