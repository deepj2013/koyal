import { staticExcelFileUrl } from "../../../components/layouts/collections/staticData";

export const downloadSampleExcelFile = async ({ taskId, groupId, token }) => {
  const fallbackUrl = staticExcelFileUrl;

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  try {
    const fallbackResponse = await fetch(fallbackUrl);
    const fallbackBlob = await fallbackResponse.blob();
    downloadBlob(fallbackBlob, "sample.xlsx");
  } catch (fallbackError) {
    console.error("Fallback download also failed:", fallbackError);
  }
};
