import "dotenv/config";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { baseTypeDefs } from "./src/schema/base.type.js";
import SupabaseClient from "./src/db/db.js";

console.log("cwd:", process.cwd());
console.log("DATABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);

async function connectToDatabase() {
  try {
    await SupabaseClient.connect();
    console.log("Connect to supabase successfully");
  } catch (e) {
    console.error("Database connection error:", e);
    throw e;
  }
}

const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
  Mutation: {
    hello: () => "Hello World!",
  },
};

async function startServer() {
  await connectToDatabase();

  const app = express();

  const server = new ApolloServer({
    typeDefs: baseTypeDefs,
    resolvers,
    formatError: (error) => ({
      message: error.message,
      code: error.extensions?.code || "INTERNAL_SERVER_ERROR",
      path: error.path,
    }),
  });

  await server.start();

  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:3000",
    }),
    express.json(),
    expressMiddleware(server, {
      context: async () => ({
        db: SupabaseClient,
      }),
    })
  );

  app.listen(4201, () => {
    console.log("GraphQL Server running at http://localhost:4201/graphql");
  });
}

startServer();