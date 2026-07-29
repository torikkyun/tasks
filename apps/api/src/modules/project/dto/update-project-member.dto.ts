import { IsDateString, IsOptional, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { MemberDto } from "./project-member.dto";

export class UpdateProjectMemberDto {
  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ example: "123e4567-e89b-12d3-a456-426614174000" })
  memberRoleId?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: "2026-07-28" })
  joinedAt?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({ example: "2026-08-28", nullable: true })
  leftAt?: string | null;
}

@Exclude()
export class UpdateProjectMemberResponseDto {
  @ApiProperty({ type: MemberDto })
  @Expose()
  @Type(() => MemberDto)
  member!: MemberDto;
}
