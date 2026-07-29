import {
  BadRequestException,
  Controller,
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
import { Roles } from "@/common/decorators/roles.decorator";
import { ProjectService } from "../service/project.service";
import { Express } from "express";

@Controller()
@ApiTags("Project Attachments")
@ApiBearerAuth()
export class ProjectAttachmentController {
  constructor(private readonly projectService: ProjectService) {}

  @Roles("ADMIN", "MANAGER")
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
  @Post("projects/:projectId/attachments")
  async uploadProjectAttachment(
    @Param("projectId") projectId: string,
    @UploadedFile() file?: Express.Multer.File,
    @CurrentUser() user?: { id: string },
  ): Promise<{ data: unknown }> {
    if (!file) throw new BadRequestException("File bắt buộc");
    return {
      data: await this.projectService.createAttachment(
        projectId,
        file,
        user!.id,
      ),
    };
  }

  @ApiResponse({
    status: 200,
    description: "Attachments retrieved successfully",
  })
  @Get("projects/:projectId/attachments")
  async listProjectAttachments(
    @Param("projectId") projectId: string,
  ): Promise<{ data: unknown[] }> {
    return { data: await this.projectService.findAttachments(projectId) };
  }
}
