import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    proilePicture: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    }
}, {timeStamps: true});

const User = mongoose.model('User', userSchema);
export default User;