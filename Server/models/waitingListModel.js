import mongoose from "mongoose";

const WaitingListSchema = new mongoose.Schema({
  serialNumber: {type: Number, require:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("WaitingList", WaitingListSchema);