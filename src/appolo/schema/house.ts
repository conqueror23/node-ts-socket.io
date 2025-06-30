import { gql } from 'apollo-server';

export const houseTypeDefs = gql`
  type House {
    brand: String!
    type: String!
  }

  extend type Query {
    houseHandler(brand: String!, type: String!): House 
  }
`;

