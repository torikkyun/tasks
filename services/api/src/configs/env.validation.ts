import { plainToInstance, ClassConstructor } from "class-transformer";
import { validateSync } from "class-validator";

export default function validateEnv<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToInstance(envVariablesClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .join("\n");

    throw new Error(messages);
  }

  return validatedConfig;
}
