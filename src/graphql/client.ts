import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const APPSYNC_ENDPOINT =
  'https://prrwjjssnvhpbcdwbcwx3nm3zm.appsync-api.ap-southeast-2.amazonaws.com/graphql';
const API_KEY = 'da2-d46dkkw5xnfbxkxkhi6twfb7re';

const httpLink = new HttpLink({
  uri: APPSYNC_ENDPOINT,
  headers: {
    'x-api-key': API_KEY,
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export { client };
