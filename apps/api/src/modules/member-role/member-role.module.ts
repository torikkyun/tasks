import { Module } from "@nestjs/common";
import { MemberRoleController } from "./member-role.controller";
import { MemberRoleService } from "./member-role.service";

@Module({
  controllers: [MemberRoleController],
  providers: [MemberRoleService],
})
export class MemberRoleModule {}
