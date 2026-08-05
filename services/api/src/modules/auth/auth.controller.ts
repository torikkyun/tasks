import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { Public } from "@/common/decorators/public.decorator";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 201,
    description: "Đăng nhập thành công",
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy nhân viên" })
  @ApiResponse({ status: 409, description: "Mật khẩu không hợp lệ" })
  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @ApiResponse({
    status: 201,
    description: "Đăng ký thành công",
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 409, description: "Nhân viên đã tồn tại" })
  @Public()
  @Post("register")
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    return await this.authService.register(dto);
  }

  @ApiResponse({
    status: 200,
    description: "Đổi mật khẩu thành công",
    schema: {
      example: { message: "Đổi mật khẩu thành công" },
    },
  })
  @ApiResponse({ status: 404, description: "Không tìm thấy nhân viên" })
  @ApiResponse({ status: 409, description: "Mật khẩu cũ không hợp lệ" })
  @ApiBearerAuth()
  @Post("change-password")
  async changePassword(
    @CurrentUser() user: { id: string; email: string },
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.authService.changePassword(user, dto);
  }
}
