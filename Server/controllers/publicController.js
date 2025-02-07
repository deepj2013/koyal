import { addToWaitingListService, getWaitingListService } from "../services/publicServices.js";

export const createWaitingListController = async (req, res) => {
  try {
    const newEntry = await addToWaitingListService(req.body);
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllWaitingListController = async (req, res) => {
  try {
    const list = await getWaitingListService();
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};