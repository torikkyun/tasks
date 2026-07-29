import { parseArgs } from "node:util";
import * as bcrypt from "bcrypt";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });
const prisma = new PrismaClient({ adapter });

async function seedDevelopment() {
  const adminRole = await prisma.role.upsert({
    where: { code: "ADMIN" },
    update: {},
    create: { name: "Quản trị viên", code: "ADMIN" },
  });
  await prisma.role.upsert({
    where: { code: "MANAGER" },
    update: {},
    create: { name: "Quản lý", code: "MANAGER" },
  });
  await prisma.role.upsert({
    where: { code: "USER" },
    update: {},
    create: { name: "Người dùng", code: "USER" },
  });

  const itDepartment = await prisma.department.upsert({
    where: { code: "IT" },
    update: {},
    create: { name: "Phòng IT", code: "IT" },
  });

  const passwordHash = await bcrypt.hash("thisisapassword123", 10);

  await prisma.staff.upsert({
    where: { email: "nduc42176@gmail.com" },
    update: {},
    create: {
      name: "Trần Đình Phúc Đức",
      email: "nduc42176@gmail.com",
      phone: "0123456789",
      avatarUrl: `https://api.dicebear.com/10.x/identicon/svg?seed=${encodeURIComponent("nduc42176@gmail.com")}&background=%23ffffff`,
      passwordHash: passwordHash,
      roleId: adminRole.id,
      departmentId: itDepartment.id,
    },
  });

  const projectStatuses = [
    { name: "Lên kế hoạch", code: "PLANNING" },
    { name: "Đang thực hiện", code: "IN_PROGRESS" },
    { name: "Tạm dừng", code: "ON_HOLD" },
    { name: "Hoàn thành", code: "COMPLETED" },
    { name: "Đã hủy", code: "CANCELLED" },
  ];
  for (const s of projectStatuses) {
    await prisma.projectStatus.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  const taskStatuses = [
    { name: "Cần làm", code: "TODO" },
    { name: "Đang làm", code: "IN_PROGRESS" },
    { name: "Chờ review", code: "IN_REVIEW" },
    { name: "Hoàn thành", code: "DONE" },
    { name: "Đã hủy", code: "CANCELLED" },
  ];
  for (const s of taskStatuses) {
    await prisma.taskStatus.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
  }

  const taskPriorities = [
    { name: "Thấp", code: "LOW" },
    { name: "Trung bình", code: "MEDIUM" },
    { name: "Cao", code: "HIGH" },
    { name: "Khẩn cấp", code: "URGENT" },
  ];
  for (const p of taskPriorities) {
    await prisma.taskPriority.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  const phaseStatuses = [
    { name: "Chưa bắt đầu", code: "NOT_STARTED" },
    { name: "Đang thực hiện", code: "IN_PROGRESS" },
    { name: "Hoàn thành", code: "COMPLETED" },
  ];
  for (const p of phaseStatuses) {
    await prisma.phaseStatus.upsert({
      where: { code: p.code },
      update: {},
      create: p,
    });
  }

  const milestoneStatuses = [
    { name: "Chưa đạt", code: "PENDING" },
    { name: "Đã đạt", code: "ACHIEVED" },
    { name: "Trễ hạn", code: "MISSED" },
  ];
  for (const m of milestoneStatuses) {
    await prisma.milestoneStatus.upsert({
      where: { code: m.code },
      update: {},
      create: m,
    });
  }

  const memberRoles = [
    { name: "Trưởng dự án", code: "PROJECT_LEAD" },
    { name: "Thành viên", code: "MEMBER" },
    { name: "Quan sát viên", code: "VIEWER" },
  ];
  for (const r of memberRoles) {
    await prisma.memberRole.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
  }

  console.log("Seed data created for development environment.");
}

async function main() {
  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: { type: "string" as const },
    },
  });

  switch (environment) {
    case "development": {
      await seedDevelopment();
      break;
    }
    case "staging":
      break;
    default:
      break;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
