import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';

const link = new RestLink({
  uri: `https:${API_V3_URL}/api/v3`
});

const cache = new InMemoryCache({ addTypename: true });

export const client = new ApolloClient({
  link,
  cache
});
