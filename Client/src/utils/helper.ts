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
