export interface IVehicle {
    rentalPrice: number;
    rentedTo: string | null;
    id: string;
    make: string;
    model: string;
}

export abstract class Vehicle implements IVehicle {
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
    rentedTo: string | null;
    rentalPrice: number;
}
export interface ICar extends IVehicle, CarParams {

}
export interface ITruck extends IVehicle, TruckParams { }

export interface TruckParams {
    cargoType: CargoTypes;
    capacity: number;
    rentedTo: string | null;
    rentalPrice: number;
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
            if (carParams.rentedTo) {
                this.rentedTo = carParams.rentedTo;
            }
            if (carParams.rentalPrice) {
                this.rentalPrice = carParams.rentalPrice;
            }
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
    constructor(public id: string, public make: string, public model: string, truckParams?: TruckParams) {
        super(id, make, model);
        if (truckParams) {
            this.cargoType = truckParams.cargoType;
            if (truckParams.capacity < 0) {
                throw new RangeError("Capacity cannot be negative")
            }
            this.cargoType = truckParams.cargoType;
            this.capacity = truckParams.capacity;
            if (truckParams.rentedTo) {
                this.rentedTo = truckParams.rentedTo;
            }
            if (truckParams.rentalPrice) {
                this.rentalPrice = truckParams.rentalPrice;
            }
        } else {
            this.cargoType = CargoTypes.box;
            this.capacity = 2;
        }
    }
}