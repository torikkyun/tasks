import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class UpdateTaskCommentDto {
  @ApiProperty({ example: "Updated comment content" })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  content!: string;
}

@Exclude()
export class UpdateTaskCommentResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Updated comment content" })
  @Expose()
  content!: string;

  @ApiProperty({ example: "2026-07-29T12:34:56.000Z" })
  @Expose()
  updatedAt!: Date;
}
