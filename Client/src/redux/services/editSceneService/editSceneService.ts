import axios from "axios";
import { config } from "../../../config/config";
import { ApiRoutes } from "../../environment/apiRoutes";

export const getProcessedImage = async (index, callId, getImage) => {
  try {
    const response = await axios.get(
      `${config.baseUrl}/${ApiRoutes.GetFluxPrompts}/${callId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    getImage(index, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching flux prompts:", error);
    return null;
  }
};

export const processImage = async (data) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}/${ApiRoutes.ProcessFluxPrompts}`,
      data,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    getProcessedImage(
      data.prompt_indices,
      response?.data?.call_id,
      data?.getImage
    );

    return {
      itemNumber: data.prompt_indices,
      response: response.data,
    };
  } catch (error) {
    console.error("Error processing flux prompts:", error);
    return null;
  }
};
