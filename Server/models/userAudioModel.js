import mongoose from 'mongoose';

const userAudioSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'users',
        index: true
    },
    groupId: {
        type: String,
        required: true,
        index: true
    },
    audioUrl: {
        type: String,
        required: true
    },
    audioPath: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
},
    { timestamps: true }
);

userAudioSchema.index({ createdAt: -1 });
const userAudio = mongoose.model('userAudio', userAudioSchema);

export default userAudio;
