export const houseResolvers = {
  Query: {
    houseHandler: (_: any,
      args: { brand: string; type: string }
    ) => ({
      brand: "Sydney",
      type: "House"
    })
  }
}
