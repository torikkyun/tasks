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
