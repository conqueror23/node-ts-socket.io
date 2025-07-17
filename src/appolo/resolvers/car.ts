export enum CarType {
  "EV" = "EV",
  "Gas" = "Gas",
  "Diesel" = "Diesel"
}

class CarResponse {
  constructor(
    public brand: string,
    public type: string
  ) { }
}

export const carHandler = (brand: string, type: CarType = CarType.EV): CarResponse => {
  if (brand === 'Honda') {
    if (type === CarType.EV) {
      return new CarResponse("Clarity", type);
    }
    return new CarResponse("Civic", CarType.Gas);
  }
  return new CarResponse("Prius", CarType.Diesel);
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

