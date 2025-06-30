import { gql } from 'apollo-server';

export const carTypeDefs = gql`
  type Car {
    brand: String!
    type: String!
  }

  extend type Query {
    carHandler(brand: String!, type: String!): Car
  }
`;

