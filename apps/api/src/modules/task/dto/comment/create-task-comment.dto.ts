import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

@Exclude()
export class TaskCommentStaffDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;

  @ApiProperty({ example: "https://example.com/avatar.png" })
  @Expose()
  avatarUrl!: string;
}

export class CreateTaskCommentDto {
  @ApiProperty({ example: "Comment content" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  content!: string;
}

@Exclude()
export class CreateTaskCommentResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Comment content" })
  @Expose()
  content!: string;

  @ApiProperty({ example: "2026-07-29T12:34:56.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: TaskCommentStaffDto })
  @Expose()
  @Type(() => TaskCommentStaffDto)
  staff!: TaskCommentStaffDto;
}
