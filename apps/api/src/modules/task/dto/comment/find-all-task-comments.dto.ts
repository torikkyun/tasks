import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { TaskCommentStaffDto } from "./create-task-comment.dto";

@Exclude()
export class TaskCommentDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Comment content" })
  @Expose()
  content!: string;

  @ApiProperty({ example: "2026-07-29T12:34:56.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-29T12:34:56.000Z" })
  @Expose()
  updatedAt!: Date;

  @ApiProperty({ type: TaskCommentStaffDto })
  @Expose()
  @Type(() => TaskCommentStaffDto)
  staff!: TaskCommentStaffDto;
}

@Exclude()
export class FindAllTaskCommentsResponseDto {
  @ApiProperty({ type: [TaskCommentDto] })
  @Expose()
  @Type(() => TaskCommentDto)
  comments!: TaskCommentDto[];
}

@Exclude()
export class TaskCommentsMetaDto {
  @ApiProperty({ example: 10 })
  @Expose()
  total!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  page!: number;

  @ApiProperty({ example: 20 })
  @Expose()
  limit!: number;

  @ApiProperty({ example: 1 })
  @Expose()
  totalPages!: number;
}
