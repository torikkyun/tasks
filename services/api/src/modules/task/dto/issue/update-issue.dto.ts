import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

export class UpdateIssueDto {
  @ApiPropertyOptional({ example: "Issue title" })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  title?: string;

  @ApiPropertyOptional({ example: "Issue description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string | null;

  @ApiPropertyOptional({ example: "2026-07-30", nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string | null;

  @ApiPropertyOptional({
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @ApiPropertyOptional({ example: "2026-07-29T12:00:00.000Z", nullable: true })
  @IsOptional()
  @IsDateString()
  resolvedAt?: string | null;
}

@Exclude()
export class UpdateIssueResponseDto {
  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiPropertyOptional({ example: "Issue title" })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  resolvedAt!: Date | null;

  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  @Type(() => Object)
  assignee!: { id: string; name: string };
}
