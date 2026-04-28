-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "tags" SET DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "mainInfo" TEXT DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#FFFFFF',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "photo" TEXT DEFAULT '',
    "occupation" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "age" TEXT DEFAULT '',
    "birthday" TEXT DEFAULT '',
    "likes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dislikes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "family" TEXT,
    "pets" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
