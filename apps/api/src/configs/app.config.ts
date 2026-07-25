import { registerAs } from "@nestjs/config";
import validateEnv from "./env.validation";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
} from "class-validator";

export enum environment {
  development = "development",
  production = "production",
  test = "test",
  staging = "staging",
}

class EnvironmentVariables {
  @IsEnum(environment, {
    message: `NODE_ENV must be one of the following values: ${Object.values(environment).join(", ")}`,
  })
  @IsNotEmpty()
  NODE_ENV!: environment;

  @IsNumber()
  @Min(1000)
  @Max(65535)
  @IsNotEmpty()
  PORT!: number;

  @IsString()
  @IsNotEmpty()
  UPLOAD_PATH!: string;
}

export default registerAs("app", () => {
  const validatedEnv = validateEnv(process.env, EnvironmentVariables);

  return {
    nodeEnv: validatedEnv.NODE_ENV,
    port: validatedEnv.PORT,
    uploadPath: validatedEnv.UPLOAD_PATH,
  };
});
