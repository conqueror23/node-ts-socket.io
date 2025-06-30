import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typesDefs';
import { resolvers } from './resolvers';

const port = 5051
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

