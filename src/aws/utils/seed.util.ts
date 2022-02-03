/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  CreateBucketCommand,
  CreateBucketCommandOutput,
  ListBucketsCommand,
  ListBucketsCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';

export async function seed(): Promise<void> {
  try {
    const bucketName = process.env.AWS_S3_BUCKET_NAME!;

    // Create a new S3 client
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.AWS_ENDPOINT!,
      forcePathStyle: true,
      region: process.env.AWS_REGION!,
    });

    // Check if the bucket already exists
    const buckets = await getBuckets(s3Client);
    const bucketExists = buckets.Buckets?.some((b) => b.Name === bucketName);

    // Create the bucket if it does not exist (this check is required for HMR).
    if (!bucketExists) {
      await createBucket(s3Client, bucketName);
    }
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }
}

async function createBucket(
  s3Client: S3Client,
  bucketName: string,
): Promise<CreateBucketCommandOutput> {
  return s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
}

async function getBuckets(s3Client: S3Client): Promise<ListBucketsCommandOutput> {
  return s3Client.send(new ListBucketsCommand({}));
}

/* eslint-enable @typescript-eslint/naming-convention */
/* eslint-enable @typescript-eslint/no-non-null-assertion */
