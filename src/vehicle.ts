export interface IVehicle {
    rentalPrice: number;
    rentedTo: string | null;
    id: string;
    make: string;
    model: string;
}

export abstract class Vehicle {
    rentalPrice: number;
    rentedTo: string | null;
    constructor(public id: string, public make: string, public model: string) {
        this.rentedTo = null;
        this.rentalPrice = -1;
    }
}
export enum BodyTypes {
    "sedan", "suv", "hatchback"
}
export enum Transmissions {
    "manual", "automatic"
}
export enum CargoTypes {
    "box", "flatbed", "van"
}
export interface CarParams {
    bodyType: BodyTypes;
    numberOfSeats: number;
    transmission: Transmissions;
}
export interface ICar extends IVehicle, CarParams{
     
}

export class Car extends Vehicle {
    bodyType: BodyTypes;
    numberOfSeats: number;
    transmission: Transmissions;

    constructor(public id: string, public make: string, public model: string, carParams?: CarParams) {
        super(id, make, model);
        if (carParams) {
            this.bodyType = carParams.bodyType;
            if (carParams.numberOfSeats < 0) {
                throw new RangeError("Seats cannot be negative")
            }
            this.numberOfSeats = carParams.numberOfSeats;
            this.transmission = carParams.transmission;
        } else {
            this.bodyType = BodyTypes.sedan;
            this.numberOfSeats = 4;
            this.transmission = Transmissions.automatic;
        }
    }
}

export class Truck extends Vehicle {
    cargoType: CargoTypes;
    capacity: number;
    constructor(public id: string, public make: string, public model: string) {
        super(id, make, model);
    }
}