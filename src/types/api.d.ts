export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: TaskStatus;
  is_starred: number; // sqlite lưu 0/1
  position: number;
  parent_task_id: string | null;
  list_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  deadline?: string; // ISO string
  list_id?: string;
  parent_task_id?: string;
}
