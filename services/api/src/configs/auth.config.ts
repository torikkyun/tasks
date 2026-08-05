import { registerAs } from "@nestjs/config";
import validateEnv from "./env.validation";
import { IsNotEmpty, IsString } from "class-validator";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION!: string;
}

export default registerAs("auth", () => {
  const validatedEnv = validateEnv(process.env, EnvironmentVariables);

  return {
    jwtSecret: validatedEnv.JWT_SECRET,
    jwtExpiration: validatedEnv.JWT_EXPIRATION,
  };
});
