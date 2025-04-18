import sampleExcel from "public/assets/sample/demoTemplate.xlsx";

export const downloadSampleExcelFile = () => {
  const fileUrl = "/assets/sample/demoTemplate.xlsx"; // Relative path to public folder

  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", "sample.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
};