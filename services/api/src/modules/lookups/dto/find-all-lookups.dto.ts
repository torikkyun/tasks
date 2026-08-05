import { DepartmentDto } from "@/modules/shared/dto/department.dto";
import { ProjectStatusDto } from "@/modules/shared/dto/project-status.dto";
import { RoleDto } from "@/modules/shared/dto/role.dto";
import { TaskStatusDto } from "@/modules/shared/dto/task-status.dto";
import { TaskPriorityDto } from "@/modules/shared/dto/task-priority.dto";
import { PhaseStatusDto } from "@/modules/shared/dto/phase-status.dto";
import { MilestoneStatusDto } from "@/modules/shared/dto/milestone-status.dto";
import { MemberRoleDto } from "@/modules/shared/dto/member-role.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class FindAllLookupsResponseDto {
  @ApiProperty({ type: [RoleDto] })
  @Expose()
  @Type(() => RoleDto)
  roles!: RoleDto[];

  @ApiProperty({ type: [DepartmentDto] })
  @Expose()
  @Type(() => DepartmentDto)
  departments!: DepartmentDto[];

  @ApiProperty({ type: [ProjectStatusDto] })
  @Expose()
  @Type(() => ProjectStatusDto)
  projectStatuses!: ProjectStatusDto[];

  @ApiProperty({ type: [TaskStatusDto] })
  @Expose()
  @Type(() => TaskStatusDto)
  taskStatuses!: TaskStatusDto[];

  @ApiProperty({ type: [TaskPriorityDto] })
  @Expose()
  @Type(() => TaskPriorityDto)
  taskPriorities!: TaskPriorityDto[];

  @ApiProperty({ type: [PhaseStatusDto] })
  @Expose()
  @Type(() => PhaseStatusDto)
  phaseStatuses!: PhaseStatusDto[];

  @ApiProperty({ type: [MilestoneStatusDto] })
  @Expose()
  @Type(() => MilestoneStatusDto)
  milestoneStatuses!: MilestoneStatusDto[];

  @ApiProperty({ type: [MemberRoleDto] })
  @Expose()
  @Type(() => MemberRoleDto)
  memberRoles!: MemberRoleDto[];
}
