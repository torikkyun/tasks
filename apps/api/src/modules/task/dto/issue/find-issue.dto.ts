import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class IssueUserDto {
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

@Exclude()
export class IssueTaskDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Task name" })
  @Expose()
  name!: string;
}

@Exclude()
export class IssueDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Issue title" })
  @Expose()
  title!: string;

  @ApiProperty({ nullable: true })
  @Expose()
  description!: string | null;

  @ApiProperty({ nullable: true })
  @Expose()
  dueDate!: Date | null;

  @ApiProperty({ nullable: true })
  @Expose()
  resolvedAt!: Date | null;

  @ApiProperty({ example: "2026-07-29T12:00:00.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: IssueTaskDto })
  @Expose()
  @Type(() => IssueTaskDto)
  task!: IssueTaskDto;

  @ApiProperty({ type: IssueUserDto })
  @Expose()
  @Type(() => IssueUserDto)
  reportedBy!: IssueUserDto;

  @ApiProperty({ type: IssueUserDto })
  @Expose()
  @Type(() => IssueUserDto)
  assignee!: IssueUserDto;
}

@Exclude()
export class FindIssueResponseDto {
  @ApiProperty({ type: IssueDto })
  @Expose()
  @Type(() => IssueDto)
  issue!: IssueDto;
}
