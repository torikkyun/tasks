import { getDb } from "@/lib/db";
import type { Task, CreateTaskInput } from "@/types/api";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const scope = input.list_id ?? null;
  const minRow = await db.select<{ min_pos: number | null }[]>(
    `SELECT MIN(position) as min_pos FROM tasks
     WHERE list_id IS ? AND parent_task_id IS NULL`,
    [scope],
  );
  const position = (minRow[0]?.min_pos ?? 0) - 1;

  await db.execute(
    `INSERT INTO tasks
      (id, title, description, deadline, status, is_starred, position, parent_task_id, list_id, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'TODO', 0, ?, ?, ?, ?, ?)`,
    [
      id,
      input.title,
      input.description ?? null,
      input.deadline ?? null,
      position,
      input.parent_task_id ?? null,
      input.list_id ?? null,
      now,
      now,
    ],
  );

  const rows = await db.select<Task[]>(`SELECT * FROM tasks WHERE id = ?`, [
    id,
  ]);
  return rows[0];
}
