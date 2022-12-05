import { tr, td, button } from "../dom/dom";
import { CargoTypes, Truck } from "../vehicle";

export function createTruckRow(truck: Truck) {
    console.log(truck.cargoType);
    console.log(CargoTypes[truck.cargoType]);
    const row = tr({},
        td({}, truck.id),
        td({}, truck.make),
        td({}, truck.model),
        td({}, CargoTypes[truck.cargoType]),
        td({}, truck.capacity.toString()),
        td({}, `$${truck.rentalPrice.toString()}/day`),
        td({}, button({ className: "action edit" }, 'Edit'), button({ className: "action delete" }, 'Delete'))
    );
    return row;
}