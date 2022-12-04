import { LocalStorage } from "./Storage";
import { BodyTypes, Car, IVehicle, Vehicle } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { FormView } from "./views/FormView";
import { getLocation } from "./utils";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";
const ls = new LocalStorage();
const id = generateId();
const car = new Car(id, "golf", "VW");
const form = document.getElementById("overviewForm") as HTMLFormElement;

export enum overviewOptions {
    "all",
    "cars",
    "trucks"
}
form.addEventListener("submit", async function (e) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    alert(JSON.stringify(data));
    const showAvailable = data["availableOnly"];
    console.log(showAvailable);
    console.log(showAvailable && data["availableOnly"])
    const selectedCollection = data.type;
    console.log(overviewOptions[Number(selectedCollection)]);
    if (overviewOptions[Number(selectedCollection)] == "all") {
        const lsValues = await ls.getAllCollectionsData();
        console.log('v=', lsValues);
        const allVehicles = [].concat.apply([], lsValues);
        console.log('x=', allVehicles)
        const tableRecords = allVehicles.map(getTableRecord);
        console.log('tablerecords: ', tableRecords)
    }
    if (showAvailable) {

    }
});
interface IType {
    type: string;
}

function getTableRecord(vehicle: IVehicle & IType) {
    return {
        id: vehicle.id,
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        rentalPrice: vehicle.rentalPrice,
        status: vehicle.rentedTo ? "Rented" : "Available"
    }
}
const table = document.getElementsByTagName('table')[0];
// console.log(table);
// const tableManager = new Table(table, createCarRow, identify);
// tableManager.add(car)

function identify(cars: IVehicle[], id: string) {
    return cars.find(e => e.id == id);
}

function createCarRow(car: Car) {
    console.log(car);
    console.log(Object.keys(car));
    console.log(Object.entries(car));
    const row = tr({},
        td({}, car.id),
        td({}, car.make),
        td({}, car.model),
        td({}, BodyTypes[car.bodyType]),
        td({}, car.numberOfSeats.toString()),
        td({}, car.transmission.toString()),
        td({}, `$${car.rentalPrice.toString()}/day`),
        td({}, button({ className: "action edit" }, 'Edit'), button({ className: "action delete" }, 'Delete'))
    );

    return row;
}



async function onSubmit(data) {
    // data.id = generateId();
    // alert(JSON.stringify(data));
    // const type = getLocation();
    // ls.create(type, new Car(data.id, data.make, data.model));
}
