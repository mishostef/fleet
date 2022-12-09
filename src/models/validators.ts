import { getLocation } from "../utils";
const makeValidator = (make) => { if (make.trim() === "") throw new RangeError("make cannot be empty") }
const modelValidator = (model) => { if (model.trim() === "") throw new RangeError("model cannot be empty") }
const numberOfSeatsValidator = (numberOfSeats) => { if (isNaN(numberOfSeats) || Number(numberOfSeats) < 1 || Number(numberOfSeats) > 9) throw new RangeError("1 < numberOfSeats< 9") }
const capacityValidator = (capacity) => { if (isNaN(capacity) || Number(capacity) < 1 || Number(capacity) > 4) throw new RangeError("1 < Capacity <= 4 ") }

const rentValidator = (rentalPrice) => {
    if (isNaN(rentalPrice) || Number(rentalPrice) <= 0
    ) { throw new Error('price should be a positive number'); }
}
const carValidator = {
    "make": makeValidator,
    "model": modelValidator,
    "numberOfSeats": numberOfSeatsValidator,
    "rentalPrice": rentValidator
};

const truckValidator = {
    "make": makeValidator,
    "model": modelValidator,
    "capacity": capacityValidator,
    "rentalPrice": rentValidator
};


const validators = {
    car: carValidator,
    truck: truckValidator
}

export function getValidators() {
    const type = getLocation().slice(0, -1);
    return validators[type];
}