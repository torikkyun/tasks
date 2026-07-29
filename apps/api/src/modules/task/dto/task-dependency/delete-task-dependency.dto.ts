import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DeleteTaskDependencyResponseDto {
  @ApiProperty({ example: "Dependency deleted successfully" })
  @Expose()
  message!: string;
}
