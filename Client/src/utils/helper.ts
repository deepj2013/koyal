import { uploadFileToS3 } from "../aws/s3-service";

export const convertJsonToFile = (data: any, fileName: string) => {
  try {
    // Convert data to a JSON Blob
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a File object
    const file = new File([blob], fileName, { type: "application/json" });
    return file;
  } catch (err) {
    console.error("failed to convert:", err);
    throw err;
  }
};

export const uploadJsonAsFileToS3 = async (data, fileName) => {
  try {
    const file = convertJsonToFile(data, fileName);
    const url = await uploadFileToS3(file, localStorage.getItem("currentUser"));
    console.log(fileName, url);

    return url;
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};
