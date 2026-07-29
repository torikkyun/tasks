import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsInt, IsOptional, IsUUID } from "class-validator";
import { TaskDependencyDto } from "../task/task.dto";

export class CreateTaskDependencyDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  predecessorTaskId!: string;

  @ApiProperty({ example: "FS", enum: ["FS", "SS", "FF", "SF"] })
  dependencyType!: "FS" | "SS" | "FF" | "SF";

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  lagDays?: number;
}

@Exclude()
export class CreateTaskDependencyResponseDto {
  @ApiProperty({ type: TaskDependencyDto })
  @Expose()
  @Type(() => TaskDependencyDto)
  dependency!: TaskDependencyDto;
}
