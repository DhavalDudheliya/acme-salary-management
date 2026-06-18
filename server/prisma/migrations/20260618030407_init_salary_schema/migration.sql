-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "employees" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'active',
    "hire_date" DATE NOT NULL,
    "current_salary_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salary_records" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" CHAR(3) NOT NULL,
    "effective_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fx_rates" (
    "currency" CHAR(3) NOT NULL,
    "rate_to_base" DECIMAL(18,8) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "fx_rates_pkey" PRIMARY KEY ("currency")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_current_salary_id_key" ON "employees"("current_salary_id");

-- CreateIndex
CREATE INDEX "employees_status_country_idx" ON "employees"("status", "country");

-- CreateIndex
CREATE INDEX "employees_status_department_idx" ON "employees"("status", "department");

-- CreateIndex
CREATE INDEX "employees_last_name_first_name_idx" ON "employees"("last_name", "first_name");

-- CreateIndex
CREATE INDEX "employees_email_idx" ON "employees"("email");

-- CreateIndex
CREATE INDEX "salary_records_employee_id_effective_date_idx" ON "salary_records"("employee_id", "effective_date");

-- CreateIndex
CREATE INDEX "salary_records_created_at_idx" ON "salary_records"("created_at");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_current_salary_id_fkey" FOREIGN KEY ("current_salary_id") REFERENCES "salary_records"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_records" ADD CONSTRAINT "salary_records_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
