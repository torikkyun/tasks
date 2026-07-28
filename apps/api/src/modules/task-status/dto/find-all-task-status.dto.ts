import { ApiProperty } from "@nestjs/swagger";
import { TaskStatusDto } from "./task-status.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllTaskStatusResponseDto {
  @ApiProperty({ type: [TaskStatusDto] })
  @Expose()
  @Type(() => TaskStatusDto)
  taskStatuses!: TaskStatusDto[];
}
