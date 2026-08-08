import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/endpoints/task.api";
import type { CreateTaskInput } from "@/types/api";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
