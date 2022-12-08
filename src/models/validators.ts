import { getLocation } from "../utils";

const carValidator = {
    "make": (make) => { if (make.trim() === "") throw new RangeError("make cannot be empty") },
    "model": (model) => { if (model.trim() === "") throw new RangeError("model cannot be empty") },
    "numberOfSeats": (numberOfSeats) => { if (isNaN(numberOfSeats) || +numberOfSeats < 1 || +numberOfSeats > 9) throw new RangeError("1 < numberOfSeats< 9") },
};

const truckValidator = {
    "make": (make) => { if (make.trim() === "") throw new RangeError("make cannot be empty") },
    "model": (model) => { if (model.trim() === "") throw new RangeError("model cannot be empty") },
    "capacity": (capacity) => { if (isNaN(capacity) || +capacity < 1 || +capacity > 4) throw new RangeError("1 < Capacity <= 4 ") },
};


const validators = {
    car: carValidator,
    truck: truckValidator
}

export function getValidators() {
    const type = getLocation().slice(0, -1);
    return validators[type];
}