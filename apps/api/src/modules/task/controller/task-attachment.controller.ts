import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { TaskAttachmentService } from "../service/task-attachment.service";
import { Express } from "express";

@Controller()
@ApiTags("Task Attachments")
@ApiBearerAuth()
export class TaskAttachmentController {
  constructor(private readonly taskAttachmentService: TaskAttachmentService) {}

  @ApiResponse({ status: 201, description: "Attachment uploaded successfully" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["file"],
      properties: { file: { type: "string", format: "binary" } },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  @Post("tasks/:taskId/attachments")
  async uploadTaskAttachment(
    @Param("taskId") taskId: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { id: string },
  ): Promise<{ data: unknown }> {
    if (!file) throw new BadRequestException("File bắt buộc");
    return {
      data: await this.taskAttachmentService.createTaskAttachment(
        taskId,
        file,
        user!.id,
      ),
    };
  }

  @ApiResponse({
    status: 200,
    description: "Attachments retrieved successfully",
  })
  @Get("tasks/:taskId/attachments")
  async listTaskAttachments(
    @Param("taskId") taskId: string,
  ): Promise<{ data: unknown[] }> {
    return {
      data: await this.taskAttachmentService.findTaskAttachments(taskId),
    };
  }

  @ApiResponse({ status: 200, description: "Attachment deleted successfully" })
  @Delete("attachments/:id")
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: { id: string; role: { code: string } },
  ): Promise<{ data: { message: string } }> {
    return {
      data: await this.taskAttachmentService.removeAttachment(id, user),
    };
  }
}
