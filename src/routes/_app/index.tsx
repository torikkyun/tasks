import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  initialTasks,
  TaskList,
  type Task,
} from "@/routes/_app/-components/task-list";
import { Timeline } from "@/routes/_app/-components/timeline";

export const Route = createFileRoute("/_app/")({ component: Home });

function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(title: string) {
    setTasks((current) => [
      ...current,
      {
        title,
        project: "FlowSpace App",
        duration: "30p",
        color: "bg-accent-yellow",
        completed: false,
      },
    ]);
  }

  function toggleTask(index: number) {
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(480px,1fr)_minmax(420px,0.86fr)] overflow-hidden">
      <div className="min-h-0 overflow-y-auto">
        <TaskList tasks={tasks} onToggle={toggleTask} onAdd={addTask} />
      </div>
      <div className="min-h-0 overflow-y-auto">
        <Timeline />
      </div>
    </div>
  );
}
