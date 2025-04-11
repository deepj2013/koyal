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

export const dataURLtoFile = (dataUrl, filename) => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const formatToUTC = (isoString) => {
  const date = new Date(isoString);
  return date.toUTCString();
};

export const getRandomActions = () => {
  const actions = [
    "TURN HEAD LEFT",
    "TILT HEAD UP",
    "TILT HEAD DOWN",
    "TURN HEAD RIGHT",
    "OPEN YOUR MOUTH",
    "SMILE WITH TEETH",
    "SQUINT YOUR EYES",
  ];

  const shuffledActions = actions.sort(() => Math.random() - 0.5);
  const selectedActions = shuffledActions.slice(0, 5);

  return [...selectedActions, "STANDUP (ENSURE HEAD IN THE FRAME)"];
};

export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Starts polling an API endpoint immediately and continues at a set interval until a condition is met.
 * @param {any} payload - The payload to pass to the fetch function (e.g., an ID or request params).
 * @param {(payload: any) => Promise<T>} fetchFn - An async function that makes the API call and returns a response.
 *        This function must return an object with `data` containing a `statusCode` field.
 * @param {(response: T) => void} onSuccess - Callback function executed once the status code is 200.
 *        Receives the full response object.
 * @param {number} [intervalMs=5000] - Polling interval in milliseconds. Default is 5000 ms (5 seconds).
 *
 * @returns {() => void} A cleanup function that can be used to manually clear the polling interval.
 */
export const startApiPolling = (
  payload,
  fetchFn,
  onSuccess,
  intervalMs = 10 * 1000
): (() => void) => {
  let interval: ReturnType<typeof setInterval>;

  const poll = async () => {
    try {
      const response = await fetchFn(payload);
      const status = response?.data?.statusCode;

      if (status === 200) {
        onSuccess(response?.data);
        clearInterval(interval);
      }
    } catch (err) {
      console.error("Polling error:", err);
    }
  };

  poll();

  interval = setInterval(poll, intervalMs);

  return () => clearInterval(interval);
};
