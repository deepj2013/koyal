import WaitingList from "../models/waitingListModel.js";

export const addToWaitingListService = async (data) => {
  try {
    const existingEntry = await WaitingList.findOne({ email: data.email });
    if (existingEntry) {
      return { 
        success: false, 
        message: `You are already in the waiting list and your position is #${existingEntry.serialNumber}`
      };
    }

    // Get the current count of documents to determine serial number
    const count = await WaitingList.countDocuments();
    const serial_number = count + 1; // Assign the next available serial number

    const newEntry = new WaitingList({ ...data, serialNumber: serial_number });
    await newEntry.save();

    return { success: true, data: newEntry };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getWaitingListService = async () => {
  try {
    return await WaitingList.find();
  } catch (error) {
    throw new Error(error.message);
  }
};
