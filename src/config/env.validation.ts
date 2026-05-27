import { plainToInstance, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

enum AppEnvironment {
  Local = 'local',
  Staging = 'staging',
  Production = 'production',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(AppEnvironment)
  APP_ENV: AppEnvironment = AppEnvironment.Local;

  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @Type(() => Number)
  PORT = 3000;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  @Type(() => Number)
  DB_PORT = 3306;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_DATABASE: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION = '1d';

  @IsString()
  @IsOptional()
  PAYMENT_WEBHOOK_TOKEN?: string;

  @IsString()
  @IsOptional()
  ABACETE_PAY_WEBHOOK_TOKEN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  if (!validatedConfig.PAYMENT_WEBHOOK_TOKEN && !validatedConfig.ABACETE_PAY_WEBHOOK_TOKEN) {
    throw new Error('Either PAYMENT_WEBHOOK_TOKEN or ABACETE_PAY_WEBHOOK_TOKEN must be configured.');
  }
  if (errors.length > 0) {
    throw new Error(`Invalid environment variables: ${errors.toString()}`);
  }
  return validatedConfig;
}
