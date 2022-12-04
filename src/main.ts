import { LocalStorage } from "./Storage";
import { IVehicle, Vehicle } from "./vehicle";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";
import { IType, overviewOptions, IStatus } from "./maintypes";
const ls = new LocalStorage();

const form = document.getElementById("overviewForm") as HTMLFormElement;
const urlParams = new URLSearchParams(window.location.search);
const selectedCollection = urlParams.get('type');
const showAvailable = (urlParams.get("availableOnly"));

const table = document.getElementsByTagName('table')[0];
console.log(table);
const tableManager = new Table(table, createOverviewRow, identify);
(async function () {
    const records = await getRecordsByQuery();
    hidrate(tableManager, records);
}())

form.addEventListener("submit", async function (e) {
    let records = await getRecordsByQuery();
    console.log('in event records=', records);
    tableManager.clear();
    hidrate(tableManager, records);
});


async function getRecordsByQuery() {
    let records = selectedCollection === "all" || selectedCollection === null ?
        getAllTableRecords() :
        (await ls.getAll(selectedCollection)).map(vehicle => {
            (vehicle as any).type = selectedCollection.slice(0, -1);
            return vehicle;
        }).map(createOverviewTableRecord);
    if (showAvailable) {
        records = (records as any).filter(rec => rec.status === "Available");
    }
    return records;
}

async function getAllTableRecords() {
    const lsValues = await ls.getAllCollectionsData();
    const allVehicles = [].concat.apply([], lsValues);
    const tableRecords = allVehicles.map(createOverviewTableRecord);
    return tableRecords;
}

function createOverviewTableRecord(vehicle: IVehicle & IType) {
    return {
        id: vehicle.id,
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        rentalPrice: vehicle.rentalPrice,
        status: vehicle.rentedTo ? "Rented" : "Available"
    }
}

async function hidrate(tableManager: Table, records?: IVehicle & IType) {
    const vehicles = records ? records : await getAllTableRecords();
    vehicles.forEach(vehicle => tableManager.add(vehicle));
}


function identify(cars: IVehicle[], id: string) {
    return cars.find(e => e.id == id);
}

function createOverviewRow(extendedVehicle: IVehicle & IType & IStatus) {
    console.log(extendedVehicle);
    console.log(Object.keys(extendedVehicle));
    console.log(Object.entries(extendedVehicle));
    const row = tr({},
        td({}, extendedVehicle.id),
        td({}, extendedVehicle.type),
        td({}, extendedVehicle.make),
        td({}, extendedVehicle.model),
        td({}, `$${extendedVehicle.rentalPrice.toString()}/day`),
        td({}, extendedVehicle.status),
        td({}, button({ className: "action edit" }, 'Edit'), button({ className: "action delete" }, 'Delete'))
    );

    return row;
}