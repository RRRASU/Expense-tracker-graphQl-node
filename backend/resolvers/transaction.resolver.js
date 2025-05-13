import Transaction from "../models/transaction.model.js";
const transactionResolver = {
    Query: {
        transactions: async(_, __, context) => {
            try {
                const {req, resp} = context;
                if(!context.getUser()) {
                    throw new Error("Unauthorized");
                } 
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({userId}).sort({date: -1});
                return transactions
                
            } catch (error) {
                throw new Error(error.message || "ERROR");
            }
        },
        transaction: async(_, {id}, context) => { 
            try {
                const {req, resp} = context;
                if(!context.getUser()) {
                    throw new Error("Unauthorized Access");
                } 
                const transaction = await Transaction.findById(id);
                return transaction
            } catch (error) {
                throw new Error(error.message || "ERROR IN FETCHING TRANSACTIONBY ID");
            }
        }
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id,
                });
                await newTransaction.save();
                return newTransaction;  
            
            } catch (error) {
                console.log("Error in createTransaction", error);
                throw new Error(error.message || "Error in creating transaction");
            }
        },
        UpdateTransactionInputTransaction: async (_, {id}, context) => {
            try {
                const transaction = await Transaction.findById(id);
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                const updatedTransaction = await Transaction.findByIdAndUpdate(id, {
                    ...input,
                }, {new: true});
                return updatedTransaction;
            } catch (error) {
                console.log("Error in updating transaction", error);
                throw new Error(error.message || "Error in updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}, context) => {
            try {
                const transaction = await Transaction.findById(id);
                if (!transaction) {
                    throw new Error("Transaction not found");
                }
                await Transaction.findByIdAndDelete(transactionId);
            } catch (error) {
                console.log("Error in deleting transaction", error);
                throw new Error(error.message || "Error in deleting transaction");
            }
        }
        // TODO: => ADD THE TRANSACTION/USER RELATIONSHIP

    }
}

export default transactionResolver;