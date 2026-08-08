import { useState } from "react";
import { Check, CirclePlus, Clock3, MoreHorizontal, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Task = {
  title: string;
  project: string;
  duration: string;
  color: string;
  completed: boolean;
};

export const initialTasks: Task[] = [
  {
    title: "Thiết kế wireframe màn hình Timeline",
    project: "FlowSpace App",
    duration: "1h30p",
    color: "bg-accent-red",
    completed: false,
  },
  {
    title: "Review PR module Note-to-Task",
    project: "FlowSpace App",
    duration: "45p",
    color: "bg-accent-yellow",
    completed: false,
  },
  {
    title: "Đọc 20 trang 'Atomic Habits'",
    project: "Đọc sách 2026",
    duration: "30p",
    color: "bg-accent-blue-info",
    completed: false,
  },
  {
    title: "Chạy bộ 5km cuối ngày",
    project: "Sức khỏe",
    duration: "40p",
    color: "bg-accent-green",
    completed: true,
  },
  {
    title: "Viết báo cáo tuần cho team",
    project: "FlowSpace App",
    duration: "1h",
    color: "bg-accent-red",
    completed: false,
  },
  {
    title: "Chuẩn bị slide họp 1:1",
    project: "FlowSpace App",
    duration: "30p",
    color: "bg-accent-yellow",
    completed: false,
  },
  {
    title: "Trả lời email tồn đọng",
    project: "FlowSpace App",
    duration: "25p",
    color: "bg-mute-soft",
    completed: true,
  },
  {
    title: "Lên ý tưởng content tuần này",
    project: "Sức khỏe",
    duration: "20p",
    color: "bg-mute-soft",
    completed: true,
  },
  {
    title: "Nghiên cứu thư viện Graph View",
    project: "FlowSpace App",
    duration: "1h15p",
    color: "bg-accent-yellow",
    completed: false,
  },
];

export function TaskList({
  tasks,
  onToggle,
  onAdd,
}: {
  tasks: Task[];
  onToggle: (index: number) => void;
  onAdd: (title: string) => void;
}) {
  const [newTask, setNewTask] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  const completedCount = tasks.filter((task) => task.completed).length;

  const addTask = () => {
    const title = newTask.trim();

    if (!title) return;

    onAdd(title);
    setNewTask("");
  };

  const filters = ["Tất cả", "FlowSpace App", "Đọc sách 2026", "Sức khỏe"];

  const filteredTasks =
    activeFilter === "Tất cả"
      ? tasks
      : tasks.filter((task) => task.project === activeFilter);

  return (
    <section className="mx-auto w-full max-w-4xl px-8 pb-16">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-mute">
            Today
          </p>

          <div className="flex items-baseline gap-3">
            <h2 className="text-[28px] font-semibold tracking-[-0.045em] text-ink">
              Task List
            </h2>

            <span className="text-[13px] text-mute">
              {tasks.length} tasks
              <span className="mx-1.5 text-hairline">·</span>
              {completedCount} xong
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 rounded-lg px-2.5 text-xs text-body-mid hover:bg-muted hover:text-ink"
        >
          <MoreHorizontal className="size-4" />
          Tùy chọn
        </Button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-1 border-b border-hairline pb-2">
        {filters.map((filter) => {
          const active = activeFilter === filter;

          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={[
                "relative rounded-md px-3 py-1.5 text-[12px] transition-colors",
                active
                  ? "font-medium text-ink"
                  : "text-body-mid hover:text-ink",
              ].join(" ")}
            >
              {filter}

              {active && (
                <span className="absolute inset-x-2 -bottom-2.25 h-px bg-ink" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick add */}
      <div className="group relative mb-8">
        <CirclePlus className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mute transition-colors group-focus-within:text-ink" />

        <Input
          value={newTask}
          onChange={(event) => setNewTask(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") addTask();
          }}
          placeholder="Thêm task nhanh..."
          className="h-11 rounded-lg border border-dashed border-input bg-transparent pl-10 pr-20 text-[13px] shadow-none placeholder:text-mute focus-visible:border-ink focus-visible:ring-0"
        />

        {newTask ? (
          <button
            onClick={() => setNewTask("")}
            aria-label="Xóa nội dung"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mute transition-colors hover:text-ink"
          >
            <X className="size-3.75" />
          </button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-hairline bg-muted px-1.5 py-0.5 font-mono text-[10px] text-mute">
            ⌘⇧A
          </kbd>
        )}
      </div>

      {/* Tasks */}
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Tasks
          </span>

          <span className="text-[11px] text-mute">{filteredTasks.length}</span>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {filteredTasks.map((task, index) => (
            <TaskRow
              key={`${task.title}-${index}`}
              task={task}
              onToggle={() => onToggle(index)}
            />
          ))}
        </div>
      </div>

      {/* Rollover */}
      <button className="mt-8 flex w-full items-center justify-between rounded-lg bg-muted px-4 py-3 text-left transition-colors hover:bg-[#eeeeee]">
        <div className="flex items-center gap-3">
          <Clock3 className="size-3.75 text-mute" />

          <span className="text-[12px] font-medium text-body">
            Rollover từ hôm qua
          </span>
        </div>

        <Badge
          variant="secondary"
          className="h-5 rounded-full px-2 text-[10px] font-medium"
        >
          2
        </Badge>
      </button>
    </section>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  return (
    <div
      className={[
        "group flex min-h-17 items-center gap-3 px-2 py-3",
        "transition-colors hover:bg-[#fafafa]",
        task.completed ? "text-mute-soft" : "",
      ].join(" ")}
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={
          task.completed ? "Đánh dấu chưa xong" : "Đánh dấu hoàn thành"
        }
        className={[
          "grid size-4 shrink-0 place-items-center rounded-full border transition-all",
          task.completed
            ? "border-accent-green bg-accent-green text-white"
            : "border-[#bcbcbc] bg-white hover:border-ink",
        ].join(" ")}
      >
        {task.completed && <Check className="size-2.5" strokeWidth={3} />}
      </button>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <p
          className={[
            "truncate text-[13px] leading-5 tracking-[-0.01em]",
            task.completed
              ? "text-mute-soft line-through"
              : "font-medium text-ink",
          ].join(" ")}
        >
          {task.title}
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span
            className={["size-1.5 shrink-0 rounded-full", task.color].join(" ")}
          />

          <span className="truncate text-[11px] text-mute">{task.project}</span>
        </div>
      </div>

      {/* Duration */}
      <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-mute">
        <Clock3 className="size-3.25" strokeWidth={1.7} />
        {task.duration}
      </div>

      {/* Hover action */}
      <button
        aria-label="Thêm tùy chọn"
        className="grid size-7 shrink-0 place-items-center rounded-md text-mute opacity-0 transition-all hover:bg-muted hover:text-ink group-hover:opacity-100"
      >
        <MoreHorizontal className="size-3.75" />
      </button>
    </div>
  );
}
