import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { AttachmentDto } from "../dto/attachment/attachment.dto";

interface AttachmentUploadFile {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
}

@Injectable()
export class TaskAttachmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private toAttachmentDto(attachment: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: bigint | null;
    mimeType: string | null;
    createdAt: Date;
    uploadedBy: { id: string; name: string } | null;
  }): AttachmentDto {
    return {
      id: attachment.id,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileSize:
        attachment.fileSize === null ? null : Number(attachment.fileSize),
      mimeType: attachment.mimeType,
      createdAt: attachment.createdAt,
      uploadedBy: attachment.uploadedBy!,
    };
  }

  async createTaskAttachment(
    taskId: string,
    file: AttachmentUploadFile,
    userId: string,
  ): Promise<AttachmentDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const uploadPath = this.configService.get<string>("app.uploadPath");
    if (!uploadPath)
      throw new BadRequestException("Upload path not configured");

    const attachmentDir = join(uploadPath, "attachments");
    await mkdir(attachmentDir, { recursive: true });

    const safeName = `${randomUUID()}-${file.originalname}`.replace(
      /[^a-zA-Z0-9._-]/g,
      "_",
    );
    await writeFile(join(attachmentDir, safeName), file.buffer);

    const attachment = await this.prisma.attachment.create({
      data: {
        fileName: file.originalname,
        fileUrl: `/uploads/attachments/${safeName}`,
        fileSize: BigInt(file.size),
        mimeType: file.mimetype,
        uploadedBy: { connect: { id: userId } },
        task: { connect: { id: taskId } },
      },
      include: { uploadedBy: true },
    });

    return this.toAttachmentDto(attachment);
  }

  async findTaskAttachments(taskId: string): Promise<AttachmentDto[]> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, deletedAt: null },
      select: { id: true },
    });
    if (!task) throw new NotFoundException("Task not found");

    const attachments = await this.prisma.attachment.findMany({
      where: { taskId },
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: true },
    });
    return attachments.map((attachment) => this.toAttachmentDto(attachment));
  }

  async removeAttachment(
    id: string,
    user: { id: string; role: { code: string } },
  ): Promise<{ message: string }> {
    const attachment = await this.prisma.attachment.findFirst({
      where: { id },
      select: { id: true, fileUrl: true, uploadedById: true },
    });
    if (!attachment) throw new NotFoundException("Attachment not found");
    if (attachment.uploadedById !== user.id && user.role.code !== "ADMIN") {
      throw new BadRequestException("Không có quyền xóa");
    }

    const uploadPath = this.configService.get<string>("app.uploadPath");
    if (uploadPath) {
      await unlink(
        join(uploadPath, attachment.fileUrl.replace("/uploads/", "")),
      ).catch(() => undefined);
    }

    await this.prisma.attachment.delete({ where: { id } });
    return { message: "Attachment deleted successfully" };
  }
}
