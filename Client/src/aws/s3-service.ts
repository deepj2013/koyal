import { PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import s3 from "./aws-config";

const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;
const REGION_NAME = import.meta.env.VITE_AWS_REGION;

export const createFolderInS3 = async (folderName) => {
  const folderKey = `${folderName}/`; // Ensure it ends with '/'

  // **Step 1: Check if folder already exists**
  const checkParams = {
    Bucket: BUCKET_NAME,
    Prefix: folderKey, // SearchfolderKey for objects with this prefix
    MaxKeys: 1, // Limit to 1 result for performance
  };

  try {
    const checkCommand = new ListObjectsV2Command(checkParams);
    const response = await s3.send(checkCommand);

    if (response.Contents && response.Contents.length > 0) {
      console.log(`Folder "${folderName}" already exists.`);
      return "Folder already exists";
    }

    // **Step 2: Create folder if it doesn't exist**
    const createParams = {
      Bucket: BUCKET_NAME,
      Key: folderKey,
      Body: "",
      ContentType: "application/x-directory", // Optional for better folder recognition
    };

    const createCommand = new PutObjectCommand(createParams);
    await s3.send(createCommand);

    console.log(`Folder "${folderName}" created successfully.`);
    return "Folder created successfully";
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
    // Convert File to Blob
    const fileBuffer = await file.arrayBuffer(); 

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer, 
      ContentType: file.type, // ✅ Preserve file type
      ACL: "public-read", // (Optional) Make file publicly accessible
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
