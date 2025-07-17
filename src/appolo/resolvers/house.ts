interface HouseArgs {
  brand: string;
  type: string;
}

interface HouseResponse {
  brand: string;
  type: string;
}

export const houseResolvers = {
  Query: {
    houseHandler: (
      _: any,
      args: HouseArgs
    ): HouseResponse => ({
      brand: args.brand || "Sydney",
      type: args.type || "House"
    })
  }
}
