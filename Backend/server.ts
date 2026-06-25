import "dotenv/config";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { mergeSchema } from "./src/schema/merge.shema.js";
import SupabaseClient from "./src/db/db.js";
import { MergeAllResolvers } from './src/api/resolverMerge.js'
import { ServerContext } from "./src/type/user.base.type.js";

console.log("cwd:", process.cwd());
console.log("DATABASE_URL exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);

type TokenPayload = {
  userid: string;
};

async function connectToDatabase() {
  try {
    await SupabaseClient.connect();
    console.log("Connect to supabase successfully");
  } catch (e) {
    console.error("Database connection error:", e);
    throw e;
  }
}

async function startServer() {
  await connectToDatabase();

  const app = express();

  const server = new ApolloServer<ServerContext>({
    typeDefs: mergeSchema,
    resolvers: MergeAllResolvers,
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
      origin: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Apollo-Require-Preflight",
      ],
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, "") ?? null;
        let user = null


        /**身分認證流程 : get token -> verify token -> get userid from verified payload -> get user profile by userid */
        if (token) {
          try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
            const result = await SupabaseClient.query(`SELECT u.id,u.name,u.email,u.role_id,u.status,r.id AS role_code,r.manage_level FROM users AS u INNER JOIN roles AS r ON r.id=u.role_id WHERE u.id=$1`, [payload.userid])
            user = result.rows[0]
            console.log('user verify result : ', user)
          }
          catch (error) {
            console.error('verify token failed : ', error)
          }
        }
        return {
          token,
          db: SupabaseClient,
          user
        };
      },
    }),
  );

  app.listen(4201, () => {
    console.log("GraphQL Server running at http://localhost:4201/graphql");
  });
}

startServer();
