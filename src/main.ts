import { LocalStorage } from "./Storage";
import { Car } from "./vehicle";
import { generateId } from "./utils";
const ls = new LocalStorage();
ls.create('cats', { name: "Puffy", age: 1 });
const id = generateId();
const car = new Car(id, "golf", "VW")
ls.create('vehicle', car);