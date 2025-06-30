import { carResolvers, houseResolvers, shoeResolvers, } from './resolvers/'

export const resolvers = {
  Query: {
    ...carResolvers.Query,
    ...houseResolvers.Query,
    ...shoeResolvers.Query,
  },
};

