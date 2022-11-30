import { LocalStorage } from "./Storage";
import { Car, ICar, CarParams, Truck } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
import { FormView } from "./views/FormView";
import { getLocation } from "./utils";

const ls = new LocalStorage();
ls.create('cats', { name: "Puffy", age: 1 });
const id = generateId();
const car = new Car(id, "golf", "VW");

(function initializeContent() {
    [...(document.getElementsByClassName('editor') as HTMLCollectionOf<HTMLElement>)].slice(1).forEach(form => form.style.display = "none")
}())
document.getElementsByClassName("action new")[0].addEventListener('click', function (e) {
    const keys = Object.keys(new Car("oo", "kk", "pp")).filter(key => key !== "id");
    const html = FormView(keys);
    (document.querySelector('.editor') as HTMLElement).style.display = "block";
    document.querySelector(".editor").appendChild(html)
    const createForm = document.getElementById("create") as HTMLFormElement;
    const editor = new Editor(createForm, onSubmit, keys);
    (e.target as HTMLButtonElement).style.display = "none";
});


ls.create("vehicle", car);



async function onSubmit(data) {
    data.id = generateId();
    alert(JSON.stringify(data));   
    const type = getLocation();
    ls.create(type, new Car(data.id, data.make, data.model));
}
