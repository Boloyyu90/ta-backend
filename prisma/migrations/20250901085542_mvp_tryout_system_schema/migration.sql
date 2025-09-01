-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'PARTICIPANT');

-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('IN_PROGRESS', 'FINISHED', 'CANCELLED', 'TIMEOUT');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TIU', 'TKP', 'TWK');

-- CreateEnum
CREATE TYPE "ProctoringEventType" AS ENUM ('FACE_NOT_DETECTED', 'MULTIPLE_FACES');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'PARTICIPANT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_bank" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_answer" TEXT NOT NULL,
    "default_score" INTEGER NOT NULL DEFAULT 1,
    "question_type" "QuestionType" NOT NULL DEFAULT 'TIU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "duration_minutes" INTEGER,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_questions" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "order_number" INTEGER,
    "score_override" INTEGER,

    CONSTRAINT "exam_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_exams" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "total_score" INTEGER,
    "status" "ExamStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "user_exam_id" INTEGER NOT NULL,
    "exam_question_id" INTEGER NOT NULL,
    "selected_option" TEXT,
    "is_correct" BOOLEAN,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proctoring_events" (
    "id" SERIAL NOT NULL,
    "user_exam_id" INTEGER NOT NULL,
    "event_type" "ProctoringEventType" NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "proctoring_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "question_bank_question_type_idx" ON "question_bank"("question_type");

-- CreateIndex
CREATE INDEX "question_bank_created_at_idx" ON "question_bank"("created_at");

-- CreateIndex
CREATE INDEX "exams_created_by_idx" ON "exams"("created_by");

-- CreateIndex
CREATE INDEX "exams_start_time_idx" ON "exams"("start_time");

-- CreateIndex
CREATE INDEX "exam_questions_exam_id_idx" ON "exam_questions"("exam_id");

-- CreateIndex
CREATE INDEX "exam_questions_question_id_idx" ON "exam_questions"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_questions_exam_id_question_id_key" ON "exam_questions"("exam_id", "question_id");

-- CreateIndex
CREATE INDEX "user_exams_user_id_idx" ON "user_exams"("user_id");

-- CreateIndex
CREATE INDEX "user_exams_exam_id_idx" ON "user_exams"("exam_id");

-- CreateIndex
CREATE INDEX "user_exams_status_idx" ON "user_exams"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_exams_user_id_exam_id_key" ON "user_exams"("user_id", "exam_id");

-- CreateIndex
CREATE INDEX "answers_user_exam_id_idx" ON "answers"("user_exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "answers_user_exam_id_exam_question_id_key" ON "answers"("user_exam_id", "exam_question_id");

-- CreateIndex
CREATE INDEX "proctoring_events_user_exam_id_idx" ON "proctoring_events"("user_exam_id");

-- CreateIndex
CREATE INDEX "proctoring_events_event_type_idx" ON "proctoring_events"("event_type");

-- CreateIndex
CREATE INDEX "proctoring_events_event_time_idx" ON "proctoring_events"("event_time");

-- CreateIndex
CREATE INDEX "Token_user_id_idx" ON "Token"("user_id");

-- CreateIndex
CREATE INDEX "Token_type_idx" ON "Token"("type");

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "question_bank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exams" ADD CONSTRAINT "user_exams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_exams" ADD CONSTRAINT "user_exams_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_user_exam_id_fkey" FOREIGN KEY ("user_exam_id") REFERENCES "user_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_exam_question_id_fkey" FOREIGN KEY ("exam_question_id") REFERENCES "exam_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proctoring_events" ADD CONSTRAINT "proctoring_events_user_exam_id_fkey" FOREIGN KEY ("user_exam_id") REFERENCES "user_exams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
