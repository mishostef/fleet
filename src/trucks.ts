import { LocalStorage } from "./Storage";
import { BodyTypes, Car, CargoTypes, IVehicle, Transmissions, Truck, Vehicle } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { CreateTruck } from "./views/CreateTruck";
import { EditTruck } from "./views/EditTruck"
import { getLocation } from "./utils";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";

let editId = null;

const ls = new LocalStorage();

let isEditing = false;

const actionButton = document.getElementsByClassName("action new")[0] as HTMLButtonElement;
initialize("truck");

actionButton.addEventListener('click', function (e) {
    isEditing = false;
    const createForm = document.getElementById("create") as HTMLFormElement;
    (e.target as HTMLButtonElement).style.display = "none";
    const editForm = document.getElementById("edit") as HTMLFormElement;
    toggleForms(editForm, createForm);
});

document.addEventListener('click', (e) => {
    listenForTableclick(e);
});

function initialize(className) {
    const vehicleType = getLocation().slice(0, -1);
    const Class = getClass(vehicleType, { id: "a", model: "b", make: "c" });
    const keys = Object.keys(Class).filter(key => key !== "id");
    const { newEditor, html } = getEditor(keys, CreateTruck, 1);
    newEditor.appendChild(html)
    const createForm = document.getElementById("create") as HTMLFormElement;
    createForm.style.background = "red";
    let editor = new Editor(createForm, onSubmit, keys, actionButton);

    const { newEditor: updateEditor, html: html2 } = getEditor(keys, EditTruck, 2)
    const reference = document.querySelector('main') as HTMLElement;
    updateEditor.appendChild(html2);
    const editForm = document.getElementById("edit") as HTMLFormElement;
    editForm.style.background = "yellow";
    let e2 = new Editor(editForm, onEdit, keys, actionButton);
    [...(document.querySelectorAll('.editor form') as NodeListOf<HTMLElement>)].forEach(el => el.style.display = "none");
}

const table = document.getElementsByTagName('table')[0];
const tableManager = new Table(table, createTruckRow, identify);

hidrate(tableManager);

async function hidrate(tableManager: Table) {
    const currentType = getLocation();
    const vehicles = await ls.getAll(currentType);
    vehicles.forEach(vehicle => tableManager.add(vehicle));
}

function getEditor(keys: string[], view, index) {
    const html = view(keys);
    const newEditor = (document.querySelectorAll('.editor')[index] as HTMLElement);
    newEditor.style.display = "block";
    return { newEditor, html };
}

function toggleForms(editForm: HTMLFormElement, createForm: HTMLFormElement) {
    if (isEditing) {
        editForm.style.display = "block";
        createForm.style.display = "none";
    } else {
        editForm.style.display = "none";
        createForm.style.display = "block";
    }
}

async function listenForTableclick(e: MouseEvent) {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
        const btnText = target.textContent;
        if (btnText == "Edit" || btnText == "Delete") {
            const activatedRow = (e.target as HTMLElement).parentElement.parentElement as HTMLTableRowElement;
            editId = activatedRow.children[0].textContent;
            if (btnText == "Edit") {
                isEditing = true;
                const keys = ["make", "model", "cargoType", "capacity", "rentalPrice"];
                const record = getTableRecord(activatedRow, keys);
                const createForm = document.getElementById("create") as HTMLFormElement;
                const editForm = document.getElementById("edit") as HTMLFormElement;
                setFormValues(keys, editForm, record);
                toggleForms(editForm, createForm);
            } else if (btnText == "Delete") {
                const currentCollection = getLocation();
                console.log('currentCollection = ', currentCollection)
                try {
                    await ls.delete(currentCollection, editId);
                } catch (error) {
                    alert(error);
                }

            }
        }
    }
}
//goto utils
export function getEnum(): any {
    const type = getLocation().slice(0, -1);//truck
    const kvp = {
        "truck": [{ cargoType: CargoTypes }],
        "car": [{ bodyType: BodyTypes }, { transmission: Transmissions }]
    }
    return kvp[type];
}

function setFormValues(keys: string[], editForm: HTMLFormElement, record: {}) {
    const enums = getEnum();
    keys.forEach(key => {
        enums.forEach(en => {
            const enumKey = Object.keys(en)[0];
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
            if (key === enumKey) {
                const selectItems = enumVals;
                (editForm[key] as HTMLSelectElement).selectedIndex = selectItems[key]
            }
        });
        editForm[key].value = record[key];
    });
}

function getTableRecord(activatedRow: HTMLTableRowElement, keys: string[]) {
    return [...activatedRow.children].slice(1).reduce((a, b, index) => {
        const key = keys[index];
        if (key === "rentalPrice") {
            const r = /-?\d+/;
            const price = b.textContent.match(r);
            a[key] = Number(price[0]);
        } else {
            a[key] = b.textContent;

        }
        return a;
    }, {});
}

function identify(cars: IVehicle[], id: string) {
    return cars.find(e => e.id == id);
}

function createTruckRow(truck: Truck) {
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

export function getClass(type: string, data: { id: string, make: string, model: string }) {
    return type === "car" ? new Car(data.id, data.make, data.model) : new Truck(data.id, data.make, data.model);
}
async function onSubmit(data) {
    data.id = generateId();
    alert(JSON.stringify(data));
    const type = getLocation();
    ///to replace with bottle
    const Class = getClass(type, data);
    try {
        ls.create(type, Class);
    } catch (error) {
        alert(error);
    }
}

async function onEdit(data) {
    alert('in Edit...')
    const collectionName = getLocation();
    try {
        data["bodyType"] = BodyTypes[data["bodyType"]];
        data["transmission"] = Transmissions[data["transmission"]];
        const newRecord = { ...await ls.getById(collectionName, editId), ...data };
        tableManager.replace(editId, newRecord);
        await ls.update(collectionName, editId, data);
    } catch (error) {
        alert(error)
    }
}