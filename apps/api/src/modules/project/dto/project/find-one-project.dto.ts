import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { ProjectDto } from "./project.dto";
import { ProjectMemberDto } from "../project-member/project-member.dto";

@Exclude()
export class ProjectDetailDto extends ProjectDto {
  @ApiProperty({ type: [ProjectMemberDto] })
  @Expose()
  @Type(() => ProjectMemberDto)
  members!: ProjectMemberDto[];
}

@Exclude()
export class FindOneProjectResponseDto {
  @ApiProperty({ type: ProjectDetailDto })
  @Expose()
  @Type(() => ProjectDetailDto)
  project!: ProjectDetailDto;
}
