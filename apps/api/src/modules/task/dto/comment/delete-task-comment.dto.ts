import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class DeleteTaskCommentResponseDto {
  @ApiProperty({ example: "Comment deleted successfully" })
  @Expose()
  message!: string;
}
