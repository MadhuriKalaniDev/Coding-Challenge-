import React from 'react';
import { Stack } from 'expo-router';
import { ApolloProvider } from '@apollo/client/react';
import { client } from '../src/graphql/client';

import { useEffect } from 'react';
import { initDatabase } from '../src/database/db';


export default function RootLayout() {

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      console.log('DB INIT DONE');
    };

    init();
  }, []);





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
