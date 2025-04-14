import mongoose from "mongoose";

export const toObjectId = (value) => {
  if (!value) return null;

  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  throw new Error("Invalid ObjectId");
};

export const toStringId = (value) => {
  if (!value) return null;

  if (typeof value === "object" && value.toHexString) {
    return value.toHexString();
  }

  if (typeof value === "string") return value;

  throw new Error("Invalid ID format");
};

