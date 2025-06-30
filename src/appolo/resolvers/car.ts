export enum CarType {
  "EV" = "EV",
  "Gas" = "Gas",
  "Dissel" = "Dissel"
}

class CarResponse {
  constructor(
    public brand: String,
    public type: String
  ) { }
}

export const carHandler = (brand: string, type: CarType = CarType.EV) => {
  if (brand === 'Honda') {
    if (type === CarType.EV) {
      return new CarResponse("E Tron", type)
    }
    return new CarResponse("Civi", CarType.Gas)
  }
  return new CarResponse("Toyota", CarType.Dissel)
}

export const carResolvers = {
  Query: {
    carHandler: (
      _: any,
      args: { brand: string; type: CarType }
    ): CarResponse =>
      carHandler(args.brand, args.type)
  },
};

