import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from "class-validator";

export class CreateTaskIssueDto {
  @ApiProperty({ example: "Issue title" })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  title!: string;

  @ApiPropertyOptional({ example: "Issue description", nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({ example: "2026-07-30", nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @IsUUID()
  assigneeId!: string;
}

@Exclude()
export class TaskIssueReportedByDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;
}

@Exclude()
export class CreateTaskIssueResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Issue title" })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  description!: string | null;

  @ApiPropertyOptional({ nullable: true })
  @Expose()
  dueDate!: Date | null;

  @ApiProperty({ type: TaskIssueReportedByDto })
  @Expose()
  @Type(() => TaskIssueReportedByDto)
  reportedBy!: TaskIssueReportedByDto;

  @ApiProperty({ type: TaskIssueReportedByDto })
  @Expose()
  @Type(() => TaskIssueReportedByDto)
  assignee!: TaskIssueReportedByDto;
}
