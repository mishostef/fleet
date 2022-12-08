import { tr, td, button } from "../dom/dom";
import { CargoTypes, Truck, Vehicle } from "../models/vehicle";
import { enumMap, getLocation } from "../utils";

export const tableKeys = {
    "truck": ["make", "model", "cargoType", "capacity", "rentalPrice"],
    "car": ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"]
};

export function createVehicleRow(vehicle: Vehicle) {
    const vehicleType = getLocation().slice(0, -1);
    const keys = tableKeys[vehicleType].slice(0, -1);

    const tds = keys.map(key => {
        console.log(key);
        console.log(enumMap[key]);
        console.log(vehicle[key]);
        const val = enumMap[key] ? (enumMap[key])[vehicle[key]] : vehicle[key].toString();
        return td({}, val)
    })
    const row = tr({},
        td({}, vehicle.id),
        ...tds,
        td({}, `$${vehicle.rentalPrice.toString()}/day`),
        td({}, button({ className: "action edit" }, 'Edit'), button({ className: "action delete" }, 'Delete'))
    );
    return row;
}

