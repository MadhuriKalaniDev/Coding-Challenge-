import React from 'react';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../src/graphql/client';

export default function RootLayout() {
  return (
    <ApolloProvider client={client}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ApolloProvider>
  );
}
