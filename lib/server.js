import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs, resolvers } from "./schema.js";
import pg from "pg";
import { config } from "dotenv";
config();
const connectPg = new pg.Client({
  user: process.env.PGUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: process.env.PORT ? parseInt(process.env.PORT) : 5432
});
const server = new ApolloServer({
  typeDefs,
  resolvers
});
(async () => {
  try {
    await connectPg.connect();
    console.log('Connected to Postgres');
    const {
      url
    } = await startStandaloneServer(server, {
      listen: {
        port: 4000
      }
    });
    //const url = await server.listen();
    console.log(`Server listening at ${url}`);
  } catch (error) {
    if (error instanceof Error) {
      return console.log(error.message);
    }
    console.log(error);
  }
})();
export { connectPg };