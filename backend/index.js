import  express  from 'express';
import dotenv from 'dotenv';


import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

 
// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    hello: String
  }
`
 
// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    hello: () => "world",
  },
}
 
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
 
const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`);


app.listen(port);