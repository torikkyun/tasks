import { registerAs } from "@nestjs/config";
import { IsNotEmpty, IsString } from "class-validator";
import validateEnv from "./env.validation";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;
}

export default registerAs("database", () => {
  const validatedEnv = validateEnv(process.env, EnvironmentVariables);

  return {
    url: validatedEnv.DATABASE_URL,
  };
});
