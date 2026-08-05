import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";

@Exclude()
export class AttachmentUserDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "Nguyen Van A" })
  @Expose()
  name!: string;
}

@Exclude()
export class AttachmentDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  @Expose()
  id!: string;

  @ApiProperty({ example: "document.pdf" })
  @Expose()
  fileName!: string;

  @ApiProperty({ example: "/uploads/attachments/document.pdf" })
  @Expose()
  fileUrl!: string;

  @ApiProperty({ nullable: true, example: 1024 })
  @Expose()
  fileSize!: number | null;

  @ApiProperty({ nullable: true, example: "application/pdf" })
  @Expose()
  mimeType!: string | null;

  @ApiProperty({ example: "2026-07-29T12:00:00.000Z" })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: AttachmentUserDto })
  @Expose()
  @Type(() => AttachmentUserDto)
  uploadedBy!: AttachmentUserDto;
}
