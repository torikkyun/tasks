import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { TaskListItemDto } from "../../../shared/dto/task.dto";

@Exclude()
export class FindAllProjectTasksResponseDto {
  @ApiProperty({ type: [TaskListItemDto] })
  @Expose()
  @Type(() => TaskListItemDto)
  tasks!: TaskListItemDto[];
}
