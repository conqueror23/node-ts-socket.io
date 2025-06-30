import { gql } from 'apollo-server';

export const shoeTypeDefs = gql`
  type Shoe {
    brand: String!
    type: String!
  }

  extend type Query {
    shoeHandler(brand: String!, type: String!): Shoe
  }
`;

