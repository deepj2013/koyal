import axios from "axios";
import { ApiRoutes } from "../../environment/apiRoutes";

export const getProcessedImage = async (callId) => {
  try {
    const response = await axios.get(`${ApiRoutes.GetFluxPrompts}/${callId}`, {
      headers: {
        Accept: "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Error fetching flux prompts:", error);
    return null;
  }
};

export const processImage = async (data) => {
  try {
    const response = await axios.post(ApiRoutes.ProcessFluxPrompts, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const callId = response?.data?.call_id;

    if (callId) {
      pollUntilCompleteOrNotFound(callId, (resultData) => {
        data?.getImage(data.prompt_indices, resultData);
      });
    }
  } catch (error) {
    console.error("Error processing flux prompts:", error);
    return null;
  }
};

const pollUntilCompleteOrNotFound = async (callId, callback) => {
  const poll = async () => {
    try {
      const result = await getProcessedImage(callId);
      console.log("Polling status:", result?.status);

      if (result?.status === 200) {
        callback(result.data);
      } else if (result?.status === 404) {
        console.warn("Data not found. Stopping polling.");
        return;
      } else {
        setTimeout(poll, 10000);
      }
    } catch (error) {
      console.error("Polling error:", error);
      setTimeout(poll, 10000);
    }
  };

  poll();
};
