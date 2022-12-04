/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Storage.ts":
/*!************************!*\
  !*** ./src/Storage.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalStorage": () => (/* binding */ LocalStorage)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");

;
class LocalStorage {
    async getAll(collectionName) {
        return JSON.parse(localStorage.getItem(collectionName) || null) || [];
    }
    async getAllCollectionsData() {
        const obj = Object.keys(localStorage)
            .reduce((obj, k) => {
            return {
                ...obj, [k]: (JSON.parse(localStorage.getItem(k))).map(x => {
                    x.type = k.slice(0, -1);
                    return x;
                })
            };
        }, {});
        return Object.values(obj);
    }
    async getById(collectionName, id) {
        const items = await this.getAll(collectionName);
        const result = items.find(i => i.id == id);
        return result;
    }
    async create(collectionName, data) {
        const items = await this.getAll(collectionName);
        const record = Object.assign({}, data, { id: (0,_utils__WEBPACK_IMPORTED_MODULE_0__.generateId)() });
        items.push(record);
        localStorage.setItem(collectionName, JSON.stringify(items));
        return record;
    }
    async update(collectionName, id, data) {
        const items = await this.getAll(collectionName);
        const index = items.findIndex(i => i.id == id);
        if (index == -1) {
            throw new ReferenceError(`Record ${id} not found in "${collectionName}"`);
        }
        const record = Object.assign({}, data, { id });
        items[index] = record;
        localStorage.setItem(collectionName, JSON.stringify(items));
        return record;
    }
    async delete(collectionName, id) {
        const items = await this.getAll(collectionName);
        const index = items.findIndex(i => i.id == id);
        if (index == -1) {
            throw new ReferenceError(`Record ${id} not found in "${collectionName}"`);
        }
        items.splice(index, 1);
        localStorage.setItem(collectionName, JSON.stringify(items));
    }
}


/***/ }),

/***/ "./src/dom/Editor.ts":
/*!***************************!*\
  !*** ./src/dom/Editor.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Editor": () => (/* binding */ Editor)
/* harmony export */ });
class Editor {
    form;
    callback;
    propNames;
    records = [];
    rows = new Map();
    constructor(form, callback, propNames, originator) {
        this.form = form;
        this.callback = callback;
        this.propNames = propNames;
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.form.addEventListener('reset', (e) => {
            this.form.style.display = "none";
            if (originator)
                originator.style.display = "block";
        });
    }
    async onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const bodyType = formData.get('bodyType');
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        try {
            await this.callback(data);
        }
        catch (error) {
            alert(error);
        }
    }
}


/***/ }),

/***/ "./src/dom/Table.ts":
/*!**************************!*\
  !*** ./src/dom/Table.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Table": () => (/* binding */ Table)
/* harmony export */ });
class Table {
    element;
    createRow;
    identify;
    records = [];
    rows = new Map();
    //public activatedRow: HTMLTableRowElement = null;
    constructor(element, createRow, identify, records) {
        this.element = element;
        this.createRow = createRow;
        this.identify = identify;
        this.element.replaceChildren(this.element.children[0]);
        if (records) {
            this.records = records;
        }
        this.records.forEach(this.add.bind(this));
        this.element.addEventListener('click', (e) => {
            if (e.target instanceof HTMLButtonElement) {
                if (e.target.textContent === "Delete") {
                    const activatedRow = e.target.parentElement.parentElement;
                    const rowIndex = activatedRow.rowIndex - 1;
                    const deleteRow = this.records[rowIndex];
                    const id = deleteRow["id"];
                    if (confirm(`Are you sure you want to delete ${id}`)) {
                        this.remove(id);
                    }
                }
            }
        });
    }
    add(record) {
        const row = this.createRow(record);
        this.element.appendChild(row);
        this.records.push(record);
        this.rows.set(record, row);
    }
    clear() {
        this.element.replaceChildren(this.element.children[0]);
        this.records = [];
    }
    get(id) {
        if (typeof this.identify == 'function') {
            const result = this.identify(this.records, id);
            return result;
        }
        throw new ReferenceError('Indetity function not specified');
    }
    getRow(id) {
        const record = this.get(id);
        return this.rows.get(record);
    }
    replace(id, newRecord) {
        const record = this.get(id);
        //const index = this.records.findIndex(r => r == record);
        const index = [...this.rows.keys()].findIndex(x => x['id'] = id);
        // Update row in DOM and collection
        const f = this.createRow.bind(this);
        const newRow = f(newRecord);
        // row.replaceWith(newRow);
        this.element.replaceChild(newRow, this.element.childNodes.item(index + 1));
        this.rows.set(record, newRow);
        // Update record in collection
        this.records.splice(index, 1, newRecord);
    }
    remove(id) {
        const record = this.get(id);
        const index = this.records.findIndex(r => r == record);
        const row = this.getRow(id);
        // Update row in DOM and collection
        row.remove();
        this.rows.delete(record);
        // Update record in collection
        this.records.splice(index, 1);
    }
}


/***/ }),

/***/ "./src/dom/dom.ts":
/*!************************!*\
  !*** ./src/dom/dom.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "a": () => (/* binding */ a),
/* harmony export */   "button": () => (/* binding */ button),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "dom": () => (/* binding */ dom),
/* harmony export */   "form": () => (/* binding */ form),
/* harmony export */   "h3": () => (/* binding */ h3),
/* harmony export */   "input": () => (/* binding */ input),
/* harmony export */   "label": () => (/* binding */ label),
/* harmony export */   "option": () => (/* binding */ option),
/* harmony export */   "p": () => (/* binding */ p),
/* harmony export */   "select": () => (/* binding */ select),
/* harmony export */   "span": () => (/* binding */ span),
/* harmony export */   "strong": () => (/* binding */ strong),
/* harmony export */   "table": () => (/* binding */ table),
/* harmony export */   "tbody": () => (/* binding */ tbody),
/* harmony export */   "td": () => (/* binding */ td),
/* harmony export */   "th": () => (/* binding */ th),
/* harmony export */   "thead": () => (/* binding */ thead),
/* harmony export */   "tr": () => (/* binding */ tr)
/* harmony export */ });
function dom(type, props, ...content) {
    const element = document.createElement(type);
    if (props) {
        for (let propName in props) {
            if (propName.startsWith('on')) {
                const eventName = propName.slice(2).toLowerCase();
                element.addEventListener(eventName, props[propName]);
            }
            else if (propName.startsWith('data')) {
                const dataName = propName.slice(4, 5).toLowerCase() + propName.slice(5);
                element.dataset[dataName] = props[propName];
            }
            else {
                element[propName] = props[propName];
            }
        }
    }
    for (let item of content) {
        element.append(item);
    }
    return element;
}
const table = dom.bind(null, 'table');
const thead = dom.bind(null, 'thead');
const tbody = dom.bind(null, 'tbody');
const tr = dom.bind(null, 'tr');
const th = dom.bind(null, 'th');
const td = dom.bind(null, 'td');
const button = dom.bind(null, 'button');
const span = dom.bind(null, 'span'); ///
const label = dom.bind(null, 'label');
const input = dom.bind(null, 'input');
const select = dom.bind(null, 'select');
const option = dom.bind(null, 'option');
const form = dom.bind(null, 'form');
const div = dom.bind(null, 'div');
const a = dom.bind(null, 'a');
const p = dom.bind(null, 'p');
const h3 = dom.bind(null, 'h3');
const strong = dom.bind(null, 'strong');


/***/ }),

/***/ "./src/trucks.ts":
/*!***********************!*\
  !*** ./src/trucks.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getClass": () => (/* binding */ getClass),
/* harmony export */   "getEnum": () => (/* binding */ getEnum)
/* harmony export */ });
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vehicle */ "./src/vehicle.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _dom_Editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/Editor */ "./src/dom/Editor.ts");
/* harmony import */ var _views_CreateTruck__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/CreateTruck */ "./src/views/CreateTruck.ts");
/* harmony import */ var _views_EditTruck__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/EditTruck */ "./src/views/EditTruck.ts");
/* harmony import */ var _dom_Table__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom/Table */ "./src/dom/Table.ts");
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom/dom */ "./src/dom/dom.ts");









let editId = null;
const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
let isEditing = false;
const actionButton = document.getElementsByClassName("action new")[0];
initialize("truck");
actionButton.addEventListener('click', function (e) {
    isEditing = false;
    const createForm = document.getElementById("create");
    e.target.style.display = "none";
    const editForm = document.getElementById("edit");
    toggleForms(editForm, createForm);
});
document.addEventListener('click', (e) => {
    listenForTableclick(e);
});
function initialize(className) {
    //todo - extract common func
    const vehicleType = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)().slice(0, -1);
    const Class = getClass(vehicleType, { id: "a", model: "b", make: "c" });
    const keys = Object.keys(Class).filter(key => key !== "id");
    const { newEditor, html } = getEditor(keys, _views_CreateTruck__WEBPACK_IMPORTED_MODULE_4__.CreateTruck, 1);
    newEditor.appendChild(html);
    const createForm = document.getElementById("create");
    createForm.style.background = "red";
    let editor = new _dom_Editor__WEBPACK_IMPORTED_MODULE_3__.Editor(createForm, onSubmit, keys, actionButton);
    const { newEditor: updateEditor, html: html2 } = getEditor(keys, _views_EditTruck__WEBPACK_IMPORTED_MODULE_5__.EditTruck, 2);
    const reference = document.querySelector('main');
    updateEditor.appendChild(html2);
    const editForm = document.getElementById("edit");
    editForm.style.background = "yellow";
    let e2 = new _dom_Editor__WEBPACK_IMPORTED_MODULE_3__.Editor(editForm, onEdit, keys, actionButton);
    [...document.querySelectorAll('.editor form')].forEach(el => el.style.display = "none");
}
const table = document.getElementsByTagName('table')[0];
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_6__.Table(table, createTruckRow, identify);
hidrate(tableManager);
async function hidrate(tableManager) {
    const currentType = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)();
    const vehicles = await ls.getAll(currentType);
    vehicles.forEach(vehicle => tableManager.add(vehicle));
}
function getEditor(keys, view, index) {
    const html = view(keys);
    const newEditor = document.querySelectorAll('.editor')[index];
    newEditor.style.display = "block";
    return { newEditor, html };
}
function toggleForms(editForm, createForm) {
    if (isEditing) {
        editForm.style.display = "block";
        createForm.style.display = "none";
    }
    else {
        editForm.style.display = "none";
        createForm.style.display = "block";
    }
}
async function listenForTableclick(e) {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
        const btnText = target.textContent;
        if (btnText == "Edit" || btnText == "Delete") {
            const activatedRow = e.target.parentElement.parentElement;
            editId = activatedRow.children[0].textContent;
            if (btnText == "Edit") {
                isEditing = true;
                const keys = ["make", "model", "cargoType", "capacity", "rentalPrice"];
                const record = getTableRecord(activatedRow, keys);
                const createForm = document.getElementById("create");
                const editForm = document.getElementById("edit");
                setFormValues(keys, editForm, record);
                toggleForms(editForm, createForm);
            }
            else if (btnText == "Delete") {
                const currentCollection = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)();
                console.log('currentCollection = ', currentCollection);
                try {
                    await ls.delete(currentCollection, editId);
                }
                catch (error) {
                    alert(error);
                }
            }
        }
    }
}
//goto utils
function getEnum() {
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)().slice(0, -1); //truck
    const kvp = {
        "truck": [{ cargoType: _vehicle__WEBPACK_IMPORTED_MODULE_1__.CargoTypes }],
        "car": [{ bodyType: _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes }, { transmission: _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions }]
    };
    return kvp[type];
}
function setFormValues(keys, editForm, record) {
    const enums = getEnum();
    keys.forEach(key => {
        enums.forEach(en => {
            const enumKey = Object.keys(en)[0];
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
            if (key === enumKey) {
                const selectItems = enumVals;
                editForm[key].selectedIndex = selectItems[key];
            }
        });
        editForm[key].value = record[key];
    });
}
function getTableRecord(activatedRow, keys) {
    return [...activatedRow.children].slice(1).reduce((a, b, index) => {
        const key = keys[index];
        if (key === "rentalPrice") {
            const r = /-?\d+/;
            const price = b.textContent.match(r);
            a[key] = Number(price[0]);
        }
        else {
            a[key] = b.textContent;
        }
        return a;
    }, {});
}
function identify(cars, id) {
    return cars.find(e => e.id == id);
}
function createTruckRow(truck) {
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, truck.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, truck.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, truck.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.CargoTypes[truck.cargoType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, truck.capacity.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, `$${truck.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action delete" }, 'Delete')));
    return row;
}
function getClass(type, data) {
    return type === "car" ? new _vehicle__WEBPACK_IMPORTED_MODULE_1__.Car(data.id, data.make, data.model) : new _vehicle__WEBPACK_IMPORTED_MODULE_1__.Truck(data.id, data.make, data.model);
}
async function onSubmit(data) {
    data.id = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.generateId)();
    alert(JSON.stringify(data));
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)();
    ///to replace with bottle
    const Class = getClass(type, data);
    try {
        ls.create(type, Class);
    }
    catch (error) {
        alert(error);
    }
}
async function onEdit(data) {
    alert('in Edit...');
    const collectionName = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)();
    try {
        data["bodyType"] = _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[data["bodyType"]];
        data["transmission"] = _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions[data["transmission"]];
        const newRecord = { ...await ls.getById(collectionName, editId), ...data };
        tableManager.replace(editId, newRecord);
        await ls.update(collectionName, editId, data);
    }
    catch (error) {
        alert(error);
    }
}


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "generateId": () => (/* binding */ generateId),
/* harmony export */   "getLocation": () => (/* binding */ getLocation)
/* harmony export */ });
function generateId() {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`;
}
function getLocation() {
    return window.location.pathname.replace('/', '').split('.')[0];
}


/***/ }),

/***/ "./src/vehicle.ts":
/*!************************!*\
  !*** ./src/vehicle.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BodyTypes": () => (/* binding */ BodyTypes),
/* harmony export */   "Car": () => (/* binding */ Car),
/* harmony export */   "CargoTypes": () => (/* binding */ CargoTypes),
/* harmony export */   "Transmissions": () => (/* binding */ Transmissions),
/* harmony export */   "Truck": () => (/* binding */ Truck),
/* harmony export */   "Vehicle": () => (/* binding */ Vehicle)
/* harmony export */ });
class Vehicle {
    id;
    make;
    model;
    rentalPrice;
    rentedTo;
    constructor(id, make, model) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.rentedTo = null;
        this.rentalPrice = -1;
    }
}
var BodyTypes;
(function (BodyTypes) {
    BodyTypes[BodyTypes["sedan"] = 0] = "sedan";
    BodyTypes[BodyTypes["suv"] = 1] = "suv";
    BodyTypes[BodyTypes["hatchback"] = 2] = "hatchback";
})(BodyTypes || (BodyTypes = {}));
var Transmissions;
(function (Transmissions) {
    Transmissions[Transmissions["manual"] = 0] = "manual";
    Transmissions[Transmissions["automatic"] = 1] = "automatic";
})(Transmissions || (Transmissions = {}));
var CargoTypes;
(function (CargoTypes) {
    CargoTypes[CargoTypes["box"] = 0] = "box";
    CargoTypes[CargoTypes["flatbed"] = 1] = "flatbed";
    CargoTypes[CargoTypes["van"] = 2] = "van";
})(CargoTypes || (CargoTypes = {}));
class Car extends Vehicle {
    id;
    make;
    model;
    bodyType;
    numberOfSeats;
    transmission;
    constructor(id, make, model, carParams) {
        super(id, make, model);
        this.id = id;
        this.make = make;
        this.model = model;
        if (carParams) {
            this.bodyType = carParams.bodyType;
            if (carParams.numberOfSeats < 0) {
                throw new RangeError("Seats cannot be negative");
            }
            this.numberOfSeats = carParams.numberOfSeats;
            this.transmission = carParams.transmission;
        }
        else {
            this.bodyType = BodyTypes.sedan;
            this.numberOfSeats = 4;
            this.transmission = Transmissions.automatic;
        }
    }
}
class Truck extends Vehicle {
    id;
    make;
    model;
    cargoType;
    capacity;
    constructor(id, make, model, truckParams) {
        super(id, make, model);
        this.id = id;
        this.make = make;
        this.model = model;
        if (truckParams) {
            this.cargoType = truckParams.cargoType;
            if (truckParams.capacity < 0) {
                throw new RangeError("Capacity cannot be negative");
            }
            this.cargoType = truckParams.cargoType;
            this.capacity = truckParams.capacity;
        }
        else {
            this.cargoType = CargoTypes.box;
            this.capacity = 2;
        }
    }
}


/***/ }),

/***/ "./src/views/CreateTruck.ts":
/*!**********************************!*\
  !*** ./src/views/CreateTruck.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateTruck": () => (/* binding */ CreateTruck)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _trucks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../trucks */ "./src/trucks.ts");


function CreateTruck(keys) {
    const enums = (0,_trucks__WEBPACK_IMPORTED_MODULE_1__.getEnum)();
    console.log(enums);
    const fields = keys.map(key => {
        for (let i = 0; i < enums.length; i++) {
            let en = enums[i];
            const enumKey = Object.keys(en)[0];
            console.log(key);
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
            console.log(enumVals);
            if (key === enumKey) {
                const values = enumVals;
                const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
                const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, key);
                const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: key }, ...options);
                return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
            }
        }
        const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.input)({ type: "text", name: key });
        return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentInput);
    });
    const submitBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action confirm", type: "submit", id: "create" }, "Add Car");
    const cancelBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({}, submitBtn, cancelBtn);
    return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.form)({ className: "align", id: "create" }, ...fields, buttonWrapperDiv);
}


/***/ }),

/***/ "./src/views/EditTruck.ts":
/*!********************************!*\
  !*** ./src/views/EditTruck.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditTruck": () => (/* binding */ EditTruck)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _trucks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../trucks */ "./src/trucks.ts");


function EditTruck(keys) {
    const enums = (0,_trucks__WEBPACK_IMPORTED_MODULE_1__.getEnum)();
    console.log(enums);
    const fields = keys.map(key => {
        for (let i = 0; i < enums.length; i++) {
            let en = enums[i];
            const enumKey = Object.keys(en)[0];
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
            if (key === enumKey) {
                const values = enumVals;
                const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
                const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, key);
                const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: key }, ...options);
                return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
            }
        }
        const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.input)({ type: "text", name: key });
        return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentInput);
    });
    const editBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action confirm", type: "submit", id: "edit" }, "Save Car");
    const cancelBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({}, editBtn, cancelBtn);
    return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.form)({ className: "align", id: "edit" }, ...fields, buttonWrapperDiv);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/trucks.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3JELE9BQU8sOENBQUksQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLGdCQUFnQixDQUFDO0FBQ2hGLENBQUM7Ozs7Ozs7VUM3QkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1VFTkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9FZGl0b3IudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZG9tL1RhYmxlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9kb20udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdHJ1Y2tzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvQ3JlYXRlVHJ1Y2sudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdFRydWNrLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuICAgIGFzeW5jIGdldEFsbENvbGxlY3Rpb25zRGF0YSgpOiBQcm9taXNlPFJlY29yZFtdPiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKG9iaiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9iaiwgW2tdOiAoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKSkpLm1hcCh4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgudHlwZSA9IGsuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcblxuICAgIH1cbiAgICBhc3luYyBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlbXMuZmluZChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZDogZ2VuZXJhdGVJZCgpIH0pO1xuICAgICAgICBpdGVtcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWNvcmQgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGlkIH0pO1xuICAgICAgICBpdGVtc1tpbmRleF0gPSByZWNvcmQ7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBSZWNvcmQgJHtpZH0gbm90IGZvdW5kIGluIFwiJHtjb2xsZWN0aW9uTmFtZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgRWRpdG9yIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZvcm06IEhUTUxGb3JtRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFjazogKGRhdGE6IG9iamVjdCkgPT4gYW55LFxuICAgICAgICBwcml2YXRlIHByb3BOYW1lczogc3RyaW5nW10sIG9yaWdpbmF0b3I/OiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAob3JpZ2luYXRvcikgb3JpZ2luYXRvci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIG9uU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzLmZvcm0pO1xuICAgICAgICBjb25zdCBib2R5VHlwZSA9IGZvcm1EYXRhLmdldCgnYm9keVR5cGUnKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLnByb3BOYW1lcy5tYXAobiA9PiBbbiwgZm9ybURhdGEuZ2V0KG4pXSkpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5jYWxsYmFjayhkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgfVxuXG4gICAgfVxufSIsImV4cG9ydCBjbGFzcyBUYWJsZSB7XG4gICAgcHJpdmF0ZSByZWNvcmRzOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgcm93czogTWFwPG9iamVjdCwgSFRNTFRhYmxlUm93RWxlbWVudD4gPSBuZXcgTWFwKCk7XG4gICAgLy9wdWJsaWMgYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50ID0gbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIGVsZW1lbnQ6IEhUTUxUYWJsZUVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUm93OiAocmVjb3JkOiBhbnkpID0+IEhUTUxUYWJsZVJvd0VsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgaWRlbnRpZnk/OiAocmVjb3JkczogYW55W10sIGlkOiBhbnkpID0+IGFueSxcbiAgICAgICAgcmVjb3Jkcz86IGFueVtdXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlQ2hpbGRyZW4odGhpcy5lbGVtZW50LmNoaWxkcmVuWzBdKTtcbiAgICAgICAgaWYgKHJlY29yZHMpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkcyA9IHJlY29yZHM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNvcmRzLmZvckVhY2godGhpcy5hZGQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7Ly8vYWRkZWQgZGVsZXRlIGZ1bmN0aW9uYWxpdHlcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGFjdGl2YXRlZFJvdy5yb3dJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJvdyA9IHRoaXMucmVjb3Jkc1tyb3dJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gZGVsZXRlUm93W1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlICR7aWR9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQocmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVSb3cocmVjb3JkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCByb3cpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB9XG4gICAgZ2V0KGlkOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpZnkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pZGVudGlmeSh0aGlzLnJlY29yZHMsIGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbmRldGl0eSBmdW5jdGlvbiBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgZ2V0Um93KGlkOiBhbnkpOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzLmdldChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJlcGxhY2UoaWQ6IGFueSwgbmV3UmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICAvL2NvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBbLi4udGhpcy5yb3dzLmtleXMoKV0uZmluZEluZGV4KHggPT4geFsnaWQnXSA9IGlkKTtcbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgY29uc3QgZiA9IHRoaXMuY3JlYXRlUm93LmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGYobmV3UmVjb3JkKTtcbiAgICAgICAgLy8gcm93LnJlcGxhY2VXaXRoKG5ld1Jvdyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlQ2hpbGQobmV3Um93LCB0aGlzLmVsZW1lbnQuY2hpbGROb2Rlcy5pdGVtKGluZGV4ICsgMSkpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgbmV3Um93KTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSwgbmV3UmVjb3JkKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaWQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3coaWQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5yb3dzLmRlbGV0ZShyZWNvcmQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59IiwidHlwZSBEb21Db250ZW50ID0gc3RyaW5nIHwgTm9kZTtcblxudHlwZSBlbGVtZW50RmFjdG9yeTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gKHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb20odHlwZTogc3RyaW5nLCBwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhTmFtZSA9IHByb3BOYW1lLnNsaWNlKDQsIDUpLnRvTG93ZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSg1KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXRbZGF0YU5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IHRhYmxlOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IHRoZWFkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGhlYWQnKTtcbmV4cG9ydCBjb25zdCB0Ym9keTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3Rib2R5Jyk7XG5leHBvcnQgY29uc3QgdHI6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RyJyk7XG5leHBvcnQgY29uc3QgdGg6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aCcpO1xuZXhwb3J0IGNvbnN0IHRkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGQnKTtcbmV4cG9ydCBjb25zdCBidXR0b246IGVsZW1lbnRGYWN0b3J5PEhUTUxCdXR0b25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdidXR0b24nKTtcbmV4cG9ydCBjb25zdCBzcGFuOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NwYW4nKTsvLy9cbmV4cG9ydCBjb25zdCBsYWJlbDogZWxlbWVudEZhY3Rvcnk8SFRNTExhYmVsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnbGFiZWwnKTtcbmV4cG9ydCBjb25zdCBpbnB1dDogZWxlbWVudEZhY3Rvcnk8SFRNTElucHV0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBzZWxlY3Q6IGVsZW1lbnRGYWN0b3J5PEhUTUxTZWxlY3RFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzZWxlY3QnKTtcbmV4cG9ydCBjb25zdCBvcHRpb246IGVsZW1lbnRGYWN0b3J5PEhUTUxPcHRpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdvcHRpb24nKTtcbmV4cG9ydCBjb25zdCBmb3JtOiBlbGVtZW50RmFjdG9yeTxIVE1MRm9ybUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBkaXY6IGVsZW1lbnRGYWN0b3J5PEhUTUxEaXZFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdkaXYnKTtcbmV4cG9ydCBjb25zdCBhOiBlbGVtZW50RmFjdG9yeTxIVE1MQW5jaG9yRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYScpO1xuZXhwb3J0IGNvbnN0IHA6IGVsZW1lbnRGYWN0b3J5PEhUTUxQYXJhZ3JhcGhFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdwJyk7XG5leHBvcnQgY29uc3QgaDM6IGVsZW1lbnRGYWN0b3J5PEhUTUxIZWFkaW5nRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaDMnKTtcbmV4cG9ydCBjb25zdCBzdHJvbmc6IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3Ryb25nJyk7IiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4vU3RvcmFnZVwiO1xuaW1wb3J0IHsgQm9keVR5cGVzLCBDYXIsIENhcmdvVHlwZXMsIElWZWhpY2xlLCBUcmFuc21pc3Npb25zLCBUcnVjaywgVmVoaWNsZSB9IGZyb20gXCIuL3ZlaGljbGVcIjtcbmltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZG9tL0VkaXRvclwiO1xuaW1wb3J0IHsgQ3JlYXRlVHJ1Y2sgfSBmcm9tIFwiLi92aWV3cy9DcmVhdGVUcnVja1wiO1xuaW1wb3J0IHsgRWRpdFRydWNrIH0gZnJvbSBcIi4vdmlld3MvRWRpdFRydWNrXCJcbmltcG9ydCB7IGdldExvY2F0aW9uIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyB0ciwgdGQsIHNwYW4sIGJ1dHRvbiB9IGZyb20gXCIuL2RvbS9kb21cIjtcblxubGV0IGVkaXRJZCA9IG51bGw7XG5cbmNvbnN0IGxzID0gbmV3IExvY2FsU3RvcmFnZSgpO1xuXG5sZXQgaXNFZGl0aW5nID0gZmFsc2U7XG5cbmNvbnN0IGFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3Rpb24gbmV3XCIpWzBdIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuaW5pdGlhbGl6ZShcInRydWNrXCIpO1xuXG5hY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgKGUudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgbGlzdGVuRm9yVGFibGVjbGljayhlKTtcbn0pO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKGNsYXNzTmFtZSkge1xuLy90b2RvIC0gZXh0cmFjdCBjb21tb24gZnVuY1xuICAgIGNvbnN0IHZlaGljbGVUeXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7XG4gICAgY29uc3QgQ2xhc3MgPSBnZXRDbGFzcyh2ZWhpY2xlVHlwZSwgeyBpZDogXCJhXCIsIG1vZGVsOiBcImJcIiwgbWFrZTogXCJjXCIgfSk7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKENsYXNzKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJpZFwiKTtcbiAgICBjb25zdCB7IG5ld0VkaXRvciwgaHRtbCB9ID0gZ2V0RWRpdG9yKGtleXMsIENyZWF0ZVRydWNrLCAxKTtcbiAgICBuZXdFZGl0b3IuYXBwZW5kQ2hpbGQoaHRtbClcbiAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIGNyZWF0ZUZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwicmVkXCI7XG4gICAgbGV0IGVkaXRvciA9IG5ldyBFZGl0b3IoY3JlYXRlRm9ybSwgb25TdWJtaXQsIGtleXMsIGFjdGlvbkJ1dHRvbik7XG5cbiAgICBjb25zdCB7IG5ld0VkaXRvcjogdXBkYXRlRWRpdG9yLCBodG1sOiBodG1sMiB9ID0gZ2V0RWRpdG9yKGtleXMsIEVkaXRUcnVjaywgMilcbiAgICBjb25zdCByZWZlcmVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdXBkYXRlRWRpdG9yLmFwcGVuZENoaWxkKGh0bWwyKTtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgZWRpdEZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwieWVsbG93XCI7XG4gICAgbGV0IGUyID0gbmV3IEVkaXRvcihlZGl0Rm9ybSwgb25FZGl0LCBrZXlzLCBhY3Rpb25CdXR0b24pO1xuICAgIFsuLi4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvciBmb3JtJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pXS5mb3JFYWNoKGVsID0+IGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XG59XG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG5jb25zdCB0YWJsZU1hbmFnZXIgPSBuZXcgVGFibGUodGFibGUsIGNyZWF0ZVRydWNrUm93LCBpZGVudGlmeSk7XG5cbmhpZHJhdGUodGFibGVNYW5hZ2VyKTtcblxuYXN5bmMgZnVuY3Rpb24gaGlkcmF0ZSh0YWJsZU1hbmFnZXI6IFRhYmxlKSB7XG4gICAgY29uc3QgY3VycmVudFR5cGUgPSBnZXRMb2NhdGlvbigpO1xuICAgIGNvbnN0IHZlaGljbGVzID0gYXdhaXQgbHMuZ2V0QWxsKGN1cnJlbnRUeXBlKTtcbiAgICB2ZWhpY2xlcy5mb3JFYWNoKHZlaGljbGUgPT4gdGFibGVNYW5hZ2VyLmFkZCh2ZWhpY2xlKSk7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRvcihrZXlzOiBzdHJpbmdbXSwgdmlldywgaW5kZXgpIHtcbiAgICBjb25zdCBodG1sID0gdmlldyhrZXlzKTtcbiAgICBjb25zdCBuZXdFZGl0b3IgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvcicpW2luZGV4XSBhcyBIVE1MRWxlbWVudCk7XG4gICAgbmV3RWRpdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgcmV0dXJuIHsgbmV3RWRpdG9yLCBodG1sIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUZvcm1zKGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIGNyZWF0ZUZvcm06IEhUTUxGb3JtRWxlbWVudCkge1xuICAgIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYnRuVGV4dCA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIgfHwgYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgZWRpdElkID0gYWN0aXZhdGVkUm93LmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xuICAgICAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIpIHtcbiAgICAgICAgICAgICAgICBpc0VkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJjYXJnb1R5cGVcIiwgXCJjYXBhY2l0eVwiLCBcInJlbnRhbFByaWNlXCJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdywga2V5cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgc2V0Rm9ybVZhbHVlcyhrZXlzLCBlZGl0Rm9ybSwgcmVjb3JkKTtcbiAgICAgICAgICAgICAgICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJ0blRleHQgPT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uID0gZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY3VycmVudENvbGxlY3Rpb24gPSAnLCBjdXJyZW50Q29sbGVjdGlvbilcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBscy5kZWxldGUoY3VycmVudENvbGxlY3Rpb24sIGVkaXRJZCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy9nb3RvIHV0aWxzXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW51bSgpOiBhbnkge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTsvL3RydWNrXG4gICAgY29uc3Qga3ZwID0ge1xuICAgICAgICBcInRydWNrXCI6IFt7IGNhcmdvVHlwZTogQ2FyZ29UeXBlcyB9XSxcbiAgICAgICAgXCJjYXJcIjogW3sgYm9keVR5cGU6IEJvZHlUeXBlcyB9LCB7IHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucyB9XVxuICAgIH1cbiAgICByZXR1cm4ga3ZwW3R5cGVdO1xufVxuXG5mdW5jdGlvbiBzZXRGb3JtVmFsdWVzKGtleXM6IHN0cmluZ1tdLCBlZGl0Rm9ybTogSFRNTEZvcm1FbGVtZW50LCByZWNvcmQ6IHt9KSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBlbnVtS2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0SXRlbXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICAoZWRpdEZvcm1ba2V5XSBhcyBIVE1MU2VsZWN0RWxlbWVudCkuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdEl0ZW1zW2tleV1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGVkaXRGb3JtW2tleV0udmFsdWUgPSByZWNvcmRba2V5XTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBrZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBbLi4uYWN0aXZhdGVkUm93LmNoaWxkcmVuXS5zbGljZSgxKS5yZWR1Y2UoKGEsIGIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICBpZiAoa2V5ID09PSBcInJlbnRhbFByaWNlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gYi50ZXh0Q29udGVudC5tYXRjaChyKTtcbiAgICAgICAgICAgIGFba2V5XSA9IE51bWJlcihwcmljZVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiLnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gaWRlbnRpZnkoY2FyczogSVZlaGljbGVbXSwgaWQ6IHN0cmluZykge1xuICAgIHJldHVybiBjYXJzLmZpbmQoZSA9PiBlLmlkID09IGlkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHJ1Y2tSb3codHJ1Y2s6IFRydWNrKSB7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCB0cnVjay5pZCksXG4gICAgICAgIHRkKHt9LCB0cnVjay5tYWtlKSxcbiAgICAgICAgdGQoe30sIHRydWNrLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSksXG4gICAgICAgIHRkKHt9LCB0cnVjay5jYXBhY2l0eS50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGAkJHt0cnVjay5yZW50YWxQcmljZS50b1N0cmluZygpfS9kYXlgKSxcbiAgICAgICAgdGQoe30sIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZWRpdFwiIH0sICdFZGl0JyksIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZGVsZXRlXCIgfSwgJ0RlbGV0ZScpKVxuICAgICk7XG4gICAgcmV0dXJuIHJvdztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKHR5cGU6IHN0cmluZywgZGF0YTogeyBpZDogc3RyaW5nLCBtYWtlOiBzdHJpbmcsIG1vZGVsOiBzdHJpbmcgfSkge1xuICAgIHJldHVybiB0eXBlID09PSBcImNhclwiID8gbmV3IENhcihkYXRhLmlkLCBkYXRhLm1ha2UsIGRhdGEubW9kZWwpIDogbmV3IFRydWNrKGRhdGEuaWQsIGRhdGEubWFrZSwgZGF0YS5tb2RlbCk7XG59XG5hc3luYyBmdW5jdGlvbiBvblN1Ym1pdChkYXRhKSB7XG4gICAgZGF0YS5pZCA9IGdlbmVyYXRlSWQoKTtcbiAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCk7XG4gICAgLy8vdG8gcmVwbGFjZSB3aXRoIGJvdHRsZVxuICAgIGNvbnN0IENsYXNzID0gZ2V0Q2xhc3ModHlwZSwgZGF0YSk7XG4gICAgdHJ5IHtcbiAgICAgICAgbHMuY3JlYXRlKHR5cGUsIENsYXNzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkVkaXQoZGF0YSkge1xuICAgIGFsZXJ0KCdpbiBFZGl0Li4uJylcbiAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IGdldExvY2F0aW9uKCk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGF0YVtcImJvZHlUeXBlXCJdID0gQm9keVR5cGVzW2RhdGFbXCJib2R5VHlwZVwiXV07XG4gICAgICAgIGRhdGFbXCJ0cmFuc21pc3Npb25cIl0gPSBUcmFuc21pc3Npb25zW2RhdGFbXCJ0cmFuc21pc3Npb25cIl1dO1xuICAgICAgICBjb25zdCBuZXdSZWNvcmQgPSB7IC4uLmF3YWl0IGxzLmdldEJ5SWQoY29sbGVjdGlvbk5hbWUsIGVkaXRJZCksIC4uLmRhdGEgfTtcbiAgICAgICAgdGFibGVNYW5hZ2VyLnJlcGxhY2UoZWRpdElkLCBuZXdSZWNvcmQpO1xuICAgICAgICBhd2FpdCBscy51cGRhdGUoY29sbGVjdGlvbk5hbWUsIGVkaXRJZCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IpXG4gICAgfVxufSIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTpzdHJpbmd7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywnJykuc3BsaXQoJy4nKVswXTtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYWtlOiBzdHJpbmc7XG4gICAgbW9kZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZlaGljbGUgaW1wbGVtZW50cyBJVmVoaWNsZXtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlbnRlZFRvID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IC0xO1xuICAgIH1cbn1cbmV4cG9ydCBlbnVtIEJvZHlUeXBlcyB7XG4gICAgXCJzZWRhblwiLCBcInN1dlwiLCBcImhhdGNoYmFja1wiXG59XG5leHBvcnQgZW51bSBUcmFuc21pc3Npb25zIHtcbiAgICBcIm1hbnVhbFwiLCBcImF1dG9tYXRpY1wiXG59XG5leHBvcnQgZW51bSBDYXJnb1R5cGVzIHtcbiAgICBcImJveFwiLCBcImZsYXRiZWRcIiwgXCJ2YW5cIlxufVxuZXhwb3J0IGludGVyZmFjZSBDYXJQYXJhbXMge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNhciBleHRlbmRzIElWZWhpY2xlLCBDYXJQYXJhbXMge1xuXG59XG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUGFyYW1zIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbn1cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBCb2R5VHlwZXMuc2VkYW47XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSA0O1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBUcmFuc21pc3Npb25zLmF1dG9tYXRpYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCB0cnVja1BhcmFtcz86IFRydWNrUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIGlmICh0cnVja1BhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJDYXBhY2l0eSBjYW5ub3QgYmUgbmVnYXRpdmVcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY2FyZ29UeXBlID0gdHJ1Y2tQYXJhbXMuY2FyZ29UeXBlO1xuICAgICAgICAgICAgdGhpcy5jYXBhY2l0eSA9IHRydWNrUGFyYW1zLmNhcGFjaXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSBDYXJnb1R5cGVzLmJveDtcbiAgICAgICAgICAgIHRoaXMuY2FwYWNpdHkgPSAyO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IHNwYW4sIGlucHV0LCBsYWJlbCwgc2VsZWN0LCBvcHRpb24sIGJ1dHRvbiwgZm9ybSwgZGl2IH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IGdldEVudW0gfSBmcm9tIFwiLi4vdHJ1Y2tzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVRydWNrKGtleXMpIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBjb25zb2xlLmxvZyhlbnVtcyk7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBrZXlzLm1hcChrZXkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZW4gPSBlbnVtc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhrZXkpO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVudW1WYWxzKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJjcmVhdGVcIiB9LCBcIkFkZCBDYXJcIik7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIHN1Ym1pdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJjcmVhdGVcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59IiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgZ2V0RW51bSB9IGZyb20gXCIuLi90cnVja3NcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEVkaXRUcnVjayhrZXlzKSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAgY29uc29sZS5sb2coZW51bXMpO1xuXG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGVuID0gZW51bXNbaV07XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IGVkaXRCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNvbmZpcm1cIiwgdHlwZTogXCJzdWJtaXRcIiwgaWQ6IFwiZWRpdFwiIH0sIFwiU2F2ZSBDYXJcIik7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIGVkaXRCdG4sIGNhbmNlbEJ0bik7XG4gICAgcmV0dXJuIGZvcm0oeyBjbGFzc05hbWU6IFwiYWxpZ25cIiwgaWQ6IFwiZWRpdFwiIH0sIC4uLmZpZWxkcywgYnV0dG9uV3JhcHBlckRpdilcbn1cblxuXG5cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvdHJ1Y2tzLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9