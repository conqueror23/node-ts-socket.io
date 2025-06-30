export const shoeResolvers = {
  Query: {
    shoeHandler: (
      _: any,
      args: { brand: string; type: string }
    ) => ({ brand: "Addidas", type: "athlate" })
  }
}
