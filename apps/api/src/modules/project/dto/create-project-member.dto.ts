import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsUUID } from "class-validator";
import { ProjectMemberDto } from "./project.dto";
import { Exclude, Expose, Type } from "class-transformer";

export class CreateProjectMemberDto {
  @IsUUID()
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  memberId!: string;

  @IsUUID()
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  memberRoleId!: string;

  @IsDateString()
  @ApiProperty({ example: "2026-07-28" })
  joinedAt!: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  leftAt?: string;
}

@Exclude()
export class CreateProjectMemberResponseDto {
  @ApiProperty({ type: ProjectMemberDto })
  @Expose()
  @Type(() => ProjectMemberDto)
  member!: ProjectMemberDto;
}
