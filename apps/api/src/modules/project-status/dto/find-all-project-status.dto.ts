import { ApiProperty } from "@nestjs/swagger";
import { ProjectStatusDto } from "./project-status.dto";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllProjectStatusResponseDto {
  @ApiProperty({ type: [ProjectStatusDto] })
  @Expose()
  @Type(() => ProjectStatusDto)
  projectStatuses!: ProjectStatusDto[];
}
