import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AwsConfig {
  @IsString()
  @IsNotEmpty()
  readonly accessKeyId!: string;

  // The optional AWS endpoint (should only used locally)
  @IsString()
  @IsOptional()
  readonly endpoint?: string;

  @IsString()
  @IsNotEmpty()
  readonly region!: string;

  @IsString()
  @IsNotEmpty()
  readonly secretAccessKey!: string;

  // The name of the AWS S3 bucket where uploaded `documents` are stored
  @IsString()
  @IsNotEmpty()
  readonly s3BucketName!: string;
}
