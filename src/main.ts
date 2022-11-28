import { LocalStorage } from "./Storage";
import { Car } from "./vehicle";
import { generateId } from "./utils";
import { Editor } from "./dom/Editor";
const ls = new LocalStorage();
ls.create('cats', { name: "Puffy", age: 1 });
const id = generateId();
const car = new Car(id, "golf", "VW");
const form = document.getElementsByClassName('align')[0] as HTMLFormElement;
const editor = new Editor(form, onSubmit, ['date', 'name', 'category', 'amount']);
ls.create('vehicle', car);

async function onSubmit(data) {
    alert(JSON.stringify(data));
}