export const config = {
  bucketName: import.meta.env.VITE_S3_BUCKET_NAME,
  regionName: import.meta.env.VITE_AWS_REGION,
  awsAccessKey: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  awsSecretKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  baseUrl: 'https://koyal.ai/v1',
  waitingListPassword: import.meta.env.VITE_WAITING_LIST_PASSWORD,
};
