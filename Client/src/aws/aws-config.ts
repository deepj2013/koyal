import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/config";

const { regionName, awsAccessKey, awsSecretKey } = config;
const s3 = new S3Client({
  region: regionName,
  credentials: {
    accessKeyId: awsAccessKey,
    secretAccessKey: awsSecretKey,
  },
});

export default s3;
