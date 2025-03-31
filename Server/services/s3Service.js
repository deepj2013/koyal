import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

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
        throw error;
    }
};

export const uploadFileToS3 = async (file, email) => {
    if (!file) {
        throw new Error('No file provided');
    }

    const fileKey = `${email}/${file.originalname}`;

    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'private'
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        return {
            message: 'File uploaded successfully',
            fileKey: fileKey
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};