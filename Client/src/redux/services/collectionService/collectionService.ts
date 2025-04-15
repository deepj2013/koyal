import { config } from "../../../config/config";

export const downloadSampleExcelFile = async ({ taskId, groupId, token }) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/api/user/uploads/download-excel?taskId=${taskId}&groupId=${groupId}`,
      {
        method: "GET",
        headers: {
          "x-auth-token": token,
          Accept: "*/*",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading Excel file:", error);
  }
};
