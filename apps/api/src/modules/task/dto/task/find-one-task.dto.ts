import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { TaskDetailDto } from "./task.dto";

@Exclude()
export class FindOneProjectTaskResponseDto {
  @ApiProperty({ type: TaskDetailDto })
  @Expose()
  @Type(() => TaskDetailDto)
  task!: TaskDetailDto;
}
