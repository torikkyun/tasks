import { Prisma } from "@/generated/prisma/client";

const SOFT_DELETE_MODELS = ["Staff"] as const;

type SoftDeleteModel = (typeof SOFT_DELETE_MODELS)[number];

function isSoftDeleteModel(
  model: string | undefined,
): model is SoftDeleteModel {
  return SOFT_DELETE_MODELS.includes(model as SoftDeleteModel);
}

export const softDeleteExtension = Prisma.defineExtension({
  name: "soft-delete-filter",
  query: {
    $allModels: {
      async findMany({ model, args, query }) {
        if (isSoftDeleteModel(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findFirst({ model, args, query }) {
        if (isSoftDeleteModel(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
      async findUnique({ model, args, query }) {
        if (isSoftDeleteModel(model)) {
          // findUnique không nhận thêm field ngoài unique key, chuyển sang findFirst
          return (query as any)({
            ...args,
            where: { ...args.where, deletedAt: null },
          });
        }
        // if (isSoftDeleteModel(model)) {
        //   args.where = { ...args.where, deletedAt: null };
        // }
        return query(args);
      },
      async count({ model, args, query }) {
        if (isSoftDeleteModel(model)) {
          args.where = { ...args.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});
