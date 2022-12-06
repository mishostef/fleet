import { LocalStorage } from "./Storage";
import { IVehicle } from "./vehicle";
import { Editor } from "./dom/Editor";
import { CreateTruck } from "./views/CreateTruck";
import { EditTruck } from "./views/EditTruck"
import { Table } from "./dom/Table";
import { mapSelectsToValues, setFormValues, getTableRecord, getLocation, getClass, generateId } from "./utils"
import { createTruckRow } from "./views/createTruckRow";
import { createCarRow } from "./views/createCarRow";

export const tableKeys = {
    "truck": ["make", "model", "cargoType", "capacity", "rentalPrice"],
    "car": ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"]
};

let editId = null;
const ls = new LocalStorage();
let isEditing = false;
const vehicleType = getLocation().slice(0, -1);
const actionButton = document.getElementsByClassName("action new")[0] as HTMLButtonElement;
initialize();

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

function initialize() {
    const Class = getClass(vehicleType, { id: "a", model: "b", make: "c" });
    const vehicleKeys = Object.keys(Class).filter(key => key !== "id" && key != "rentedTo");
    const e1 = configEditor(vehicleKeys, CreateTruck, onSubmit, "create");
    const e2 = configEditor(vehicleKeys, EditTruck, onEdit, "edit");
    [...(document.querySelectorAll('.editor form') as NodeListOf<HTMLElement>)].forEach(el => el.style.display = "none");
}

function configEditor(keys, view, handler, id) {
    const index = id == "edit" ? 2 : 1;
    const { newEditor: updateEditor, html: html2 } = getEditor(keys, view, index)
    updateEditor.appendChild(html2);
    const editForm = document.getElementById(id) as HTMLFormElement;
    editForm.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return new Editor(editForm, handler, keys, actionButton);
}

const table = document.getElementsByTagName('table')[0];
const createRow = getLocation().slice(0, -1) === 'car' ? createCarRow : createTruckRow;
const tableManager = new Table(table, createRow, identify);
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
                editRow(activatedRow);
            } else if (btnText == "Delete") {
                const currentCollection = getLocation();
                try {
                    await ls.delete(currentCollection, editId);
                } catch (error) {
                    alert(error);
                }
            }
        }
    }
}

function editRow(activatedRow: HTMLTableRowElement) {
    isEditing = true;
    const keys = tableKeys[vehicleType];
    const record = getTableRecord(activatedRow, keys);
    const createForm = document.getElementById("create") as HTMLFormElement;
    const editForm = document.getElementById("edit") as HTMLFormElement;
    setFormValues(keys, editForm, record);
    toggleForms(editForm, createForm);
}

function identify(cars: IVehicle[], id: string) {
    return cars.find(e => e.id == id);
}

async function onSubmit(data) {
    data.id = generateId();
    alert(JSON.stringify(data));
    const type = getLocation();
    mapSelectsToValues(data);
    const Class = getClass(type.slice(0, -1), data);
    tableManager.add(data);
    try {
        ls.create(type, Class);
    } catch (error) {
        alert(error);
    }
}

async function onEdit(data) {
    const collectionName = getLocation();
    mapSelectsToValues(data);
    try {
        const newRecord = { ...await ls.getById(collectionName, editId), ...data };
        tableManager.replace(editId, newRecord);
        await ls.update(collectionName, editId, data);
    } catch (error) {
        alert(error)
    }
}