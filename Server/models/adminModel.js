import mongoose from "mongoose";

// Admin Schema Starts From Here
const AdminSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        dropDups: true
    },
    password: String,
}, { timestamps: true });

const Admin = mongoose.model('admins', AdminSchema)

export default Admin