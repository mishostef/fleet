import { LocalStorage } from "./Storage";
import { BodyTypes, Car } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { FormView } from "./views/FormView";
import { getLocation } from "./utils";
import { Table } from "./dom/Table";
import { tr, td, span, button } from "./dom/dom";
const ls = new LocalStorage();
ls.create('cats', { name: "Puffy", age: 1 });
const id = generateId();
const car = new Car(id, "golf", "VW");

(function initializeContent() {
    [...(document.getElementsByClassName('editor') as HTMLCollectionOf<HTMLElement>)].slice(1).forEach(form => form.style.display = "none")
}())
document.getElementsByClassName("action new")[0].addEventListener('click', function (e) {
    const keys = Object.keys(new Car("a", "b", "c")).filter(key => key !== "id");
    const html = FormView(keys);
    (document.querySelector('.editor') as HTMLElement).style.display = "block";
    document.querySelector(".editor").appendChild(html)
    const createForm = document.getElementById("create") as HTMLFormElement;
    const editor = new Editor(createForm, onSubmit, keys);
    (e.target as HTMLButtonElement).style.display = "none";
});

const table = document.getElementsByTagName('table')[0];
console.log(table);
const tableManager = new Table(table, createCarRow);
tableManager.add(car)

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
        td({}, button({className:"action edit"}, 'Edit'), button({className:"action delete"}, 'Delete'))
    );

    return row;
}





async function onSubmit(data) {
    data.id = generateId();
    alert(JSON.stringify(data));
    const type = getLocation();
    ls.create(type, new Car(data.id, data.make, data.model));
}
