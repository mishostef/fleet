import { span, p, div, form, label, strong, input, button } from "./dom/dom";
import { LocalStorage } from "./Storage";
import { CargoTypes, BodyTypes, Transmissions } from "./vehicle";
const enumMap = {
    cargoType: CargoTypes,
    bodyType: BodyTypes,
    transmission: Transmissions
}
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ls = new LocalStorage();
createDetails();

function createDetailsForm() {
    return form({ onsubmit: addTenant },
        label({},
            span({}, "Rent to"),
            input({ type: "text", name: "name" })),
        button({ className: "action rent", type: "submit" }, "Confirm")
    );
}
async function createDetails() {
    const currentVehicle = await getCurrentVehicle();
    alert(JSON.stringify(currentVehicle));
    const props = Object.entries(currentVehicle).map(kv => {
        let [k, v] = kv;
        if (k in Object.keys(enumMap)) {
            v = enumMap[k];
        }
        return p({}, span({ className: "col" }, k), strong({ className: "col" }, v === null ? '' : v.toString()))
    });
    const detailsDiv = div({ className: "details" }, ...props);
    const form = createDetailsForm();
    const rentalDiv = div({ className: "rental" },
        p({}, span({ classname: "col" }, "Rented to:  "),
            strong({}, currentVehicle["rentedTo"] ? currentVehicle["rentedTo"] : "noone")),

        button({ className: "action release", onclick: endContract }, "End contract"),
        form
    );
    const main = document.getElementsByTagName("main")[0];
    main.replaceChildren();
    main.appendChild(detailsDiv);
    main.appendChild(rentalDiv);

}
async function getCurrentVehicle() {
    const lsValues = await ls.getAllCollectionsData();
    const allVehicles = [].concat.apply([], lsValues);
    const currentVehicle = allVehicles.find(v => v.id === id);
    return currentVehicle;
}

async function endContract() {
    alert("end contract");
    const data = await getCurrentVehicle();
    const collectionName = `${data.type}s`;
    delete data.type;
    await ls.update(collectionName, id, { ...data, rentedTo: null });
    createDetails();
}

async function addTenant(e) {
    e.preventDefault();
    const formData = new FormData(e.target)
    const data = await getCurrentVehicle();
    const collectionName = `${data.type}s`;
    delete data.type;
    await ls.update(collectionName, id, { ...data, rentedTo: formData.get("name") });
    createDetails();
}