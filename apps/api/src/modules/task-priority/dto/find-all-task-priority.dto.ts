import { ApiProperty } from "@nestjs/swagger";
import { TaskPriorityDto } from "./task-priority.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllTaskPriorityResponseDto {
  @ApiProperty({ type: [TaskPriorityDto] })
  @Expose()
  @Type(() => TaskPriorityDto)
  taskPriorities!: TaskPriorityDto[];
}
