import mongoose from "mongoose";
export const connectMongoDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully', connect.connection.host);
        
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1);
    }
}

// We are gonne use passport.js for authentication and authorization for nodejs middleware.
// For graphql we have graphql-passport package.
// So we install passport and graphql-passport and connect-mongodb-session packages.
// Serializaton is the process of converting a user object into a string that can be stored in a session.
// Deserialization is the process of converting the string back into a user object.