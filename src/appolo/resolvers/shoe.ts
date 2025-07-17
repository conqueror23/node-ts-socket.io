interface ShoeArgs {
  brand: string;
  type: string;
}

interface ShoeResponse {
  brand: string;
  type: string;
}

export const shoeResolvers = {
  Query: {
    shoeHandler: (
      _: any,
      args: ShoeArgs
    ): ShoeResponse => ({ 
      brand: args.brand || "Adidas", 
      type: args.type || "athletic" 
    })
  }
}
