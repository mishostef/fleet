import { LocalStorage } from "./Storage";
import { BodyTypes, Car, IVehicle } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { FormView } from "./views/FormView";
import { EditForm } from "./views/EditForm";
import { getLocation } from "./utils";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";

let editId = null;

const ls = new LocalStorage();

let isEditing = false;

const actionButton =document.getElementsByClassName("action new")[0] as HTMLButtonElement;

initialize();

actionButton.addEventListener('click', function (e) {
    const createForm = document.getElementById("create") as HTMLFormElement;
   (e.target as HTMLButtonElement).style.display = "none";
    const editForm = document.getElementById("edit") as HTMLFormElement;
   toggleForms(editForm, createForm);

   document.addEventListener('click', (e) => {
       listenForTableclick(e);
   })
});

function initialize(){
    const keys = Object.keys(new Car("a", "b", "c")).filter(key => key !== "id");
    const { newEditor, html } = getEditor(keys, FormView, 1);
    newEditor.appendChild(html)
    const createForm = document.getElementById("create") as HTMLFormElement;
    createForm.style.background = "red";
    let editor = new Editor(createForm, onSubmit, keys,actionButton); 

    const { newEditor: updateEditor, html: html2 } = getEditor(keys, EditForm, 2)
    const reference = document.querySelector('main') as HTMLElement;
    updateEditor.insertBefore(html2, reference);
    const editForm = document.getElementById("edit") as HTMLFormElement;
    editForm.style.background = "yellow";
    editor = new Editor(editForm, onEdit, keys,actionButton);
    [...(document.querySelectorAll('.editor form') as NodeListOf<HTMLElement>)].forEach(el=>el.style.display="none");
}

const table = document.getElementsByTagName('table')[0];
const tableManager = new Table(table, createCarRow, identify);

hidrate(tableManager);

async function hidrate(tableManager: Table) {
    const cars = await ls.getAll('cars');
    cars.forEach(car => tableManager.add(car));
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

function listenForTableclick(e: MouseEvent) {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
        const btnText = target.textContent;
        if (btnText == "Edit") {
            isEditing = true;
            const activatedRow = (e.target as HTMLElement).parentElement.parentElement as HTMLTableRowElement;
            editId = activatedRow.children[0].textContent;
            const keys = ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"];
            const record = getTableRecord(activatedRow, keys);
            const createForm = document.getElementById("create") as HTMLFormElement;
            const editForm = document.getElementById("edit") as HTMLFormElement;
            keys.forEach(key => editForm[key].value = record[key]);
            toggleForms(editForm, createForm);
        }
    }
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
    data.id = generateId();
    alert(JSON.stringify(data));
    const type = getLocation();
    try {
        ls.create(type, new Car(data.id, data.make, data.model));
    } catch (error) {
        alert(error);
    }
}

async function onEdit(data) {
    alert('in Edit...')
    try {
        await ls.update('cars', editId, data);
        const newRecord =await ls.getById('cars',editId);
        tableManager.replace(editId,newRecord);
    } catch (error) {
        alert(error)
    }   
}