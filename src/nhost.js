import React from 'react';
import {
  NhostClient,
  NhostProvider
} from '@nhost/react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';


// 1️⃣ Nhost client setup
export const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
  region: process.env.REACT_APP_NHOST_REGION,
});

// 2️⃣ HTTP link
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HASURA_HTTP_URL,
});

// 3️⃣ Auth link (adds JWT to headers)
const authLink = setContext(async (_, { headers }) => {
  const token = await nhost.auth.getAccessToken();
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 4️⃣ Subscription link (WebSocket)
const wsLink = new GraphQLWsLink(
  createClient({
    url: process.env.REACT_APP_HASURA_WS_URL,
    connectionParams: async () => {
      const token = await nhost.auth.getAccessToken();
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
    },
  })
);

// 5️⃣ Split: use wsLink for subscriptions, httpLink for queries/mutations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // ✅ inject auth here
);

// 6️⃣ Apollo client
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// 7️⃣ Wrapper for app
export const ApolloProviderWrapper = ({ children }) => (
  <NhostProvider nhost={nhost}>
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  </NhostProvider>
);
