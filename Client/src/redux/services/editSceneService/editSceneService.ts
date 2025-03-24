import { config } from "../../../config/config";
import { ApiRoutes } from "../../environment/apiRoutes";

export const processFluxPrompts = async (data) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/${ApiRoutes.ProcessFluxPrompts}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to process flux prompts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing flux prompts:", error);
    return null;
  }
};

export const getFluxPrompts = async (callId) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/${ApiRoutes.GetFluxPrompts}/${callId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch flux prompts");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching flux prompts:", error);
    return null;
  }
};
