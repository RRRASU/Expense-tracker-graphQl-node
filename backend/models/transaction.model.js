import  mongoose  from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["saving","expense", "investement", "other"],
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
}, { timestamps: true });

const Transaction =   mongoose.model("Transaction", transactionSchema);
export default Transaction;