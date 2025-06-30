import { gql } from 'apollo-server';
import { carTypeDefs } from './schema/car';
import { houseTypeDefs } from './schema/house';
import { shoeTypeDefs } from './schema/shoe';

const baseTypeDefs = gql`
  type Query
`;

export const typeDefs = [
  baseTypeDefs,
  carTypeDefs,
  houseTypeDefs,
  shoeTypeDefs,
];

