import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from "./aws-config";

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;
const REGION_NAME = import.meta.env.VITE_AWS_REGION;

/**
 * Creates a virtual folder in an Amazon S3 bucket.
 *
 * This function ensures that the specified folder path exists in S3 by checking if it already exists.
 * If the folder does not exist, it creates an empty object with a key ending in `/` to simulate a folder structure.
 *
 * @param {string} folderPath - The path of the folder to be created.
 *                               Example: "my-folder" or "parent-folder/child-folder"
 * @returns {Promise<string>} - A message indicating whether the folder was created or already exists.
 * @throws {Error} - Throws an error if the request to S3 fails.
 */
export const createFolderInS3 = async (folderPath) => {
  const folderKey = folderPath.endsWith("/") ? folderPath : `${folderPath}/`; // Ensure it ends with "/"

  const checkParams = {
    Bucket: BUCKET_NAME,
    Prefix: folderKey, // SearchfolderKey for objects with this prefix
    MaxKeys: 1, // Limit to 1 result for performance
  };

  try {
    const checkCommand = new ListObjectsV2Command(checkParams);
    const response = await s3.send(checkCommand);

    if (response.Contents && response.Contents.length > 0) {
      console.log(`Folder "${folderPath}" already exists.`);
      return "Folder already exists";
    }

    const createParams = {
      Bucket: BUCKET_NAME,
      Key: folderKey,
      Body: "",
      ContentType: "application/x-directory",
    };

    const createCommand = new PutObjectCommand(createParams);
    await s3.send(createCommand);

    const encodedFileKey = encodeURIComponent(folderPath);
    const folderUrl = `https://s3.${REGION_NAME}.amazonaws.com/${BUCKET_NAME}/${encodedFileKey}`;
    console.log("Folder uploaded successfully:", folderUrl);
    return folderUrl;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const uploadFileToS3 = async (file: File, folderName: string) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const fileKey = `${folderName}/${file.name}`;

  try {
    const fileBuffer = await file.arrayBuffer();

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    const encodedFileKey = encodeURIComponent(fileKey);

    // Return the uploaded file URL
    const fileUrl = `https://s3.${REGION_NAME}.amazonaws.com/${BUCKET_NAME}/${encodedFileKey}`;
    console.log("File uploaded successfully:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const replaceS3File = async (fileKey: string, newJsonData: any) => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: JSON.stringify(newJsonData, null, 2),
      ContentType: "application/json",
    });

    await s3.send(command);
    console.log("File replaced successfully in S3!");
  } catch (error) {
    console.error("Error replacing file:", error);
  }
};
