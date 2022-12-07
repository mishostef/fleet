import { tr, td, button } from "../dom/dom";
import { BodyTypes, Transmissions } from "../models/vehicle";
import { Car } from "../models/vehicle";

export function createCarRow(car: Car) {
    const row = tr({},
        td({}, car.id),
        td({}, car.make),
        td({}, car.model),
        td({}, BodyTypes[car.bodyType]),
        td({}, car.numberOfSeats.toString()),
        td({}, Transmissions[car.transmission]),
        td({}, `$${car.rentalPrice.toString()}/day`),
        td({}, button({ className: "action edit" }, 'Edit'), button({ className: "action delete" }, 'Delete'))
    );

    return row;
}