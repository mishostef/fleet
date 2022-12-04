import { span, p, div, form, label, strong, input, button } from "./dom/dom";
import { LocalStorage } from "./Storage";
import { CargoTypes, BodyTypes, Transmissions } from "./vehicle";
const enumMap = {
    cargoType: CargoTypes,
    bodyType: BodyTypes,
    transmission: Transmissions
}
// <h3>Opel Corsa</h3>
//             <div class="details">
//                 <p><span class="col">ID:</span><strong>0076-5b58</strong></p>
//                 <p><span class="col">Body type:</span><strong>Hatchback</strong></p>
//                 <p><span class="col">Seats:</span><strong>4</strong></p>
//                 <p><span class="col">Transmission:</span><strong>Manual</strong></p>
//                 <p><span class="col">Rental price:</span><strong>$55/day</strong></p>
//             </div>

//             <div class="rental">
//                 <p><span class="col">Status:</span><strong>Available/Rented</strong></p>
//                 <p><span class="col">Rented to:</span><strong>John Smith</strong> <button class="action release">End
//                         contract</button></p>
//                 <form>
//                     <label>
//                         <span>Rent to</span>
//                         <input type="text" name="name">
//                     </label>
//                     <button class="action rent">Confirm</button>
//                 </form>
//             </div>
function createDetailsForm() {
    return form({},
        label({},
            span({}, "Rent to"),
            input({ type: "text", name: "name" })),
        button({ className: "action rent" }, "Confirm")
    );
}
async function createDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const ls = new LocalStorage();
    const lsValues = await ls.getAllCollectionsData();
    const allVehicles = [].concat.apply([], lsValues);
    const currentVehicle = allVehicles.find(v => v.id === id);
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
        p({}, span({ classname: "col" }, "Rented to"),
            strong({}, props["rentedTo"] ? "noone" : props["rentedTo"])),
        
        button({ className: "action release" }, "End contract"),
        form
    );
    const main = document.getElementsByTagName("main")[0];
    main.replaceChildren();
    main.appendChild(detailsDiv);
    main.appendChild(rentalDiv);

}


createDetails()
