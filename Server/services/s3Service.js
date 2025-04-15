import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import APIError, { HttpStatusCode } from '../exception/errorHandler.js';

dotenv.config();

// creating the s3 client for uploading files in s3 bucket
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// for creating the user folder in s3 for uploading files
export const createUserFolder = async (email) => {
  const folderKey = `${email}/`;

  try {
    // Check if folder exists
    const checkParams = {
      Bucket: BUCKET_NAME,
      Prefix: folderKey,
      MaxKeys: 1
    };

    const checkCommand = new ListObjectsV2Command(checkParams);
    const response = await s3.send(checkCommand);

    if (response.Contents && response.Contents.length > 0) {
      return {
        message: 'Folder already exists',
        folderPath: folderKey
      };
    }

    // Create folder
    const createParams = {
      Bucket: BUCKET_NAME,
      Key: folderKey,
      Body: '',
      ContentType: 'application/x-directory'
    };

    const createCommand = new PutObjectCommand(createParams);
    await s3.send(createCommand);

    return {
      message: 'Folder created successfully',
      folderPath: folderKey
    };
  } catch (error) {
    console.error('Error in S3 operation:', error);
    throw new APIError(
      'Something went wrong while creating folder',
      HttpStatusCode.NOT_FOUND,
      true,
      "not able to create folder"
    );
  }
};

// for uploading bulk songs in s3 for a user
export const uploadSongsToS3 = async (files, email) => {
  try {
    const uploadedFiles = await Promise.all(files.map(async (file) => {
      const fileKey = `${email}/collections/${file.originalname}`;
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
      }));
      const encodedKey = encodeURIComponent(fileKey).replace(/%2F/g, '/');
      const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${BUCKET_NAME}/${encodedKey}`;

      return {
        fileName: file.originalname,
        url: fileUrl
      };
    }));

    return {
      success: true,
      code: 200,
      message: 'All songs uploaded successfully',
      files: uploadedFiles
    };

  } catch (error) {
    throw new APIError(
      'Something went wrong while uploading songs',
      HttpStatusCode.INTERNAL_SERVER,
      true,
      "please try again later",
    )
  }
};

// for uploading single song in s3 for a user
export const uploadSingleSongToS3 = async (file, email) => {
  try {
    const fileKey = `${email}/${file.originalname}`;

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }));

    const encodedKey = encodeURIComponent(fileKey).replace(/%2F/g, '/');
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${BUCKET_NAME}/${encodedKey}`;

    return {
      success: true,
      code: 200,
      message: 'Song uploaded successfully',
      file: {
        fileName: file.originalname,
        url: fileUrl
      }
    };
  } catch (error) {
    throw new APIError(
      'Something went wrong while uploading song',
      HttpStatusCode.INTERNAL_SERVER,
      true,
      'Please try again later'
    );
  }
};

export const uploadJSONFileToS3 = async (jsonData, fileName, email) => {
  if (!jsonData) {
    throw new Error("No JSON data provided");
  }

  const fileKey = `${email}/${fileName}`;

  try {
    const fileBuffer = Buffer.from(JSON.stringify(jsonData));

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: 'application/json',
      ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    const encodedFileKey = encodeURIComponent(fileKey);

    // Return the uploaded file URL
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${BUCKET_NAME}/${encodedFileKey}`;
    console.log("File uploaded successfully:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};