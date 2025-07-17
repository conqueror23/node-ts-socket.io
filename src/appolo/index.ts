import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typesDefs';
import { resolvers } from './resolvers';

const port = process.env.APOLLO_PORT ? parseInt(process.env.APOLLO_PORT) : 5051;

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  introspection: true,
  debug: process.env.NODE_ENV !== 'production'
});

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Apollo GraphQL server ready at ${url}`);
}).catch((error: Error) => {
  console.error('Failed to start Apollo server:', error);
  process.exit(1);
});

