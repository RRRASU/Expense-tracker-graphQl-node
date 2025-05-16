import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import ApolloServerPluginLandingPageLocalDefault from "@apollo/server/plugin/landingPage/default";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { connectMongoDB } from "../db/connectDB.js";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { configurePassport } from "./passport/passport.config.js"; // Import the passport configuration
import { buildContext } from "graphql-passport";

// Configure the passport middleware

dotenv.config();
const port = process.env.PORT || 4000;
configurePassport(); // Call the passport configuration function // adfter this the user session and passoprt session are initialized

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

// Start mongoDb connection
await connectMongoDB();

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (error) => {
  console.log("Error in Mongo session", error);
});

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  graphiql: true,
  plugins: [ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Mongo session store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // this option is to speciy to save the sesion to the store on evry request
    saveUninitialized: false, //  Option specifies whether to save uninitialized sessions to the store
    store: store, // Pass the above created MongoDBStore instance
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true, // This option is to specify that the cookie should only be accessible by the server
      // httpOnly is  to prevent cross-site scripting attacks
    },
  })
);

app.use(passport.initialize()); // Initialize the passport middleware
app.use(passport.session()); // Initialize the session middleware

// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function

app.use(
  "/",
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.) to be sent
  }),
  express.json(),
  expressMiddleware(server, {
    // the context gets passed to the resolvers as a third argument
    context: async ({ req, res }) => {
      return buildContext({ req, res });
    },
  })
);
// Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
