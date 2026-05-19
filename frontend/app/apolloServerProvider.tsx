"use client";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

import { ApolloProvider } from "@apollo/client/react";
import React from "react";

const httpLink = new HttpLink({ uri: "http://localhost:4201/graphql" });

const client: ApolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
export function ApolloServerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
