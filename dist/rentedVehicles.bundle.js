/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
        const rentalPrice = formData.get("rentalPrice").toString();
        formData.set("rentalPrice", rentalPrice);
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
        const index = [...this.rows.keys()].findIndex(x => x['id'] === id);
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
const span = dom.bind(null, 'span');
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

/***/ "./src/models/Storage.ts":
/*!*******************************!*\
  !*** ./src/models/Storage.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocalStorage": () => (/* binding */ LocalStorage)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

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

/***/ "./src/models/validators.ts":
/*!**********************************!*\
  !*** ./src/models/validators.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getValidators": () => (/* binding */ getValidators)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");

const carValidator = {
    "make": (make) => { if (make.trim() === "")
        throw new RangeError("make cannot be empty"); },
    "model": (model) => { if (model.trim() === "")
        throw new RangeError("model cannot be empty"); },
    "numberOfSeats": (numberOfSeats) => { if (isNaN(numberOfSeats) || +numberOfSeats < 1 || +numberOfSeats > 9)
        throw new RangeError("1 < numberOfSeats< 9"); },
};
const truckValidator = {
    "make": (make) => { if (make.trim() === "")
        throw new RangeError("make cannot be empty"); },
    "model": (model) => { if (model.trim() === "")
        throw new RangeError("model cannot be empty"); },
    "capacity": (capacity) => { if (isNaN(capacity) || +capacity < 1 || +capacity > 4)
        throw new RangeError("1 < Capacity <= 4 "); },
};
const validators = {
    car: carValidator,
    truck: truckValidator
};
function getValidators() {
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getLocation)().slice(0, -1);
    return validators[type];
}


/***/ }),

/***/ "./src/models/vehicle.ts":
/*!*******************************!*\
  !*** ./src/models/vehicle.ts ***!
  \*******************************/
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
            if (carParams.rentedTo) {
                this.rentedTo = carParams.rentedTo;
            }
            if (carParams.rentalPrice) {
                this.rentalPrice = carParams.rentalPrice;
            }
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
        this.cargoType = CargoTypes.box;
        this.capacity = 2;
        if (truckParams) {
            if (truckParams.capacity) {
                if (truckParams.capacity < 0) {
                    throw new RangeError("Capacity cannot be negative");
                }
                this.capacity = truckParams.capacity;
            }
            if (truckParams.cargoType) {
                this.cargoType = truckParams.cargoType;
            }
            if (truckParams.rentedTo) {
                this.rentedTo = truckParams.rentedTo;
            }
            if (truckParams.rentalPrice) {
                this.rentalPrice = truckParams.rentalPrice;
            }
        }
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
/* harmony export */   "getClass": () => (/* binding */ getClass),
/* harmony export */   "getEnum": () => (/* binding */ getEnum),
/* harmony export */   "getLocation": () => (/* binding */ getLocation),
/* harmony export */   "getNumberFromString": () => (/* binding */ getNumberFromString),
/* harmony export */   "getTableRecord": () => (/* binding */ getTableRecord),
/* harmony export */   "mapSelectsToValues": () => (/* binding */ mapSelectsToValues),
/* harmony export */   "setFormValues": () => (/* binding */ setFormValues)
/* harmony export */ });
/* harmony import */ var _models_vehicle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/vehicle */ "./src/models/vehicle.ts");

function generateId() {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`;
}
function getLocation() {
    return window.location.pathname.replace('/', '').split('.')[0];
}
function getEnum() {
    const type = getLocation().slice(0, -1); //truck
    const kvp = {
        "truck": [{ cargoType: _models_vehicle__WEBPACK_IMPORTED_MODULE_0__.CargoTypes }],
        "car": [{ bodyType: _models_vehicle__WEBPACK_IMPORTED_MODULE_0__.BodyTypes }, { transmission: _models_vehicle__WEBPACK_IMPORTED_MODULE_0__.Transmissions }]
    };
    return kvp[type];
}
function getClass(type, data) {
    const { id, make, model, ...rest } = data;
    return type === "car" ? new _models_vehicle__WEBPACK_IMPORTED_MODULE_0__.Car(id, make, model, rest) : new _models_vehicle__WEBPACK_IMPORTED_MODULE_0__.Truck(id, make, model, rest);
}
function mapSelectsToValues(data) {
    const enums = getEnum();
    enums.forEach(en => {
        const enumKey = Object.keys(en)[0];
        const enumValsString = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
        const enumValsNumber = Object.values(en[enumKey]).filter(v => !isNaN(Number(v)));
        const currentSelectValue = data[enumKey];
        const index = enumValsString.indexOf(currentSelectValue);
        data[enumKey] = enumValsNumber[index];
    });
}
function setFormValues(keys, editForm, record) {
    const enums = getEnum();
    keys.forEach(key => {
        enums.forEach(en => {
            const enumKey = Object.keys(en)[0];
            if (key === enumKey) {
                const enumValsString = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
                const enumValsNumber = Object.values(en[enumKey]).filter(v => !isNaN(Number(v)));
                const currentSelectValue = record[enumKey];
                const index = enumValsString.indexOf(currentSelectValue);
                editForm[key].selectedIndex = Number(enumValsNumber[index]);
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
function getNumberFromString(str) {
    const r = /-?\d+/;
    const numbers = str.match(r);
    return Number(numbers[0]);
}


/***/ }),

/***/ "./src/views/CreateVehicle.ts":
/*!************************************!*\
  !*** ./src/views/CreateVehicle.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CreateTruck": () => (/* binding */ CreateTruck)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");


function CreateTruck(keys) {
    const enums = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getEnum)();
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
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getLocation)().slice(0, -1);
    const capitalizedType = type[0].toLocaleUpperCase() + type.slice(1);
    const submitBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action confirm", type: "submit", id: "create" }, `Add ${capitalizedType}`);
    const cancelBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({}, submitBtn, cancelBtn);
    return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.form)({ className: "align", id: "create" }, ...fields, buttonWrapperDiv);
}


/***/ }),

/***/ "./src/views/EditVehicle.ts":
/*!**********************************!*\
  !*** ./src/views/EditVehicle.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditTruck": () => (/* binding */ EditTruck)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/utils.ts");



function EditTruck(keys) {
    const enums = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getEnum)();
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
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getLocation)().slice(0, -1);
    const capitalizedType = type[0].toLocaleUpperCase() + type.slice(1);
    const editBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action confirm", type: "submit", id: "edit" }, `Save ${capitalizedType}`);
    const cancelBtn = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({}, editBtn, cancelBtn);
    return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.form)({ className: "align", id: "edit" }, ...fields, buttonWrapperDiv);
}


/***/ }),

/***/ "./src/views/createCarRow.ts":
/*!***********************************!*\
  !*** ./src/views/createCarRow.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createCarRow": () => (/* binding */ createCarRow)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _models_vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/vehicle */ "./src/models/vehicle.ts");


function createCarRow(car) {
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _models_vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[car.bodyType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.numberOfSeats.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _models_vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions[car.transmission]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, `$${car.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action delete" }, 'Delete')));
    return row;
}


/***/ }),

/***/ "./src/views/createTruckRow.ts":
/*!*************************************!*\
  !*** ./src/views/createTruckRow.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createTruckRow": () => (/* binding */ createTruckRow)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _models_vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/vehicle */ "./src/models/vehicle.ts");


function createTruckRow(truck) {
    console.log(Object.keys(truck));
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _models_vehicle__WEBPACK_IMPORTED_MODULE_1__.CargoTypes[truck.cargoType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.capacity.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, `$${truck.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action delete" }, 'Delete')));
    return row;
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/rentedVehicles.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableKeys": () => (/* binding */ tableKeys)
/* harmony export */ });
/* harmony import */ var _models_Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/Storage */ "./src/models/Storage.ts");
/* harmony import */ var _dom_Editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/Editor */ "./src/dom/Editor.ts");
/* harmony import */ var _views_CreateVehicle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/CreateVehicle */ "./src/views/CreateVehicle.ts");
/* harmony import */ var _views_EditVehicle__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/EditVehicle */ "./src/views/EditVehicle.ts");
/* harmony import */ var _dom_Table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom/Table */ "./src/dom/Table.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _views_createTruckRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/createTruckRow */ "./src/views/createTruckRow.ts");
/* harmony import */ var _views_createCarRow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/createCarRow */ "./src/views/createCarRow.ts");
/* harmony import */ var _models_validators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./models/validators */ "./src/models/validators.ts");









const tableKeys = {
    "truck": ["make", "model", "cargoType", "capacity", "rentalPrice"],
    "car": ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"]
};
let editId = null;
const ls = new _models_Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
let isEditing = false;
const vehicleType = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)().slice(0, -1);
const actionButton = document.getElementsByClassName("action new")[0];
initialize();
actionButton.addEventListener('click', function (e) {
    actionButtonHandler(e);
});
document.addEventListener('click', (e) => {
    listenForTableclick(e);
});
const table = document.getElementsByTagName('table')[0];
const createRow = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)().slice(0, -1) === 'car' ? _views_createCarRow__WEBPACK_IMPORTED_MODULE_7__.createCarRow : _views_createTruckRow__WEBPACK_IMPORTED_MODULE_6__.createTruckRow;
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_4__.Table(table, createRow, identify);
hidrate(tableManager);
function actionButtonHandler(e) {
    isEditing = false;
    const createForm = document.getElementById("create");
    e.target.style.display = "none";
    const editForm = document.getElementById("edit");
    toggleForms(editForm, createForm);
}
function initialize() {
    const Class = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getClass)(vehicleType, { id: "a", model: "b", make: "c" });
    const vehicleKeys = Object.keys(Class).filter(key => key !== "id" && key != "rentedTo");
    const e1 = configEditor(vehicleKeys, _views_CreateVehicle__WEBPACK_IMPORTED_MODULE_2__.CreateTruck, onSubmit, "create");
    const e2 = configEditor(vehicleKeys, _views_EditVehicle__WEBPACK_IMPORTED_MODULE_3__.EditTruck, onEdit, "edit");
    [...document.querySelectorAll('.editor form')].forEach(el => el.style.display = "none");
}
function configEditor(keys, view, handler, id) {
    const index = id == "edit" ? 2 : 1;
    const { newEditor: updateEditor, html: html2 } = getEditor(keys, view, index);
    updateEditor.appendChild(html2);
    const editForm = document.getElementById(id);
    editForm.style.background = "#" + Math.floor(Math.random() * 16777215).toString(16);
    return new _dom_Editor__WEBPACK_IMPORTED_MODULE_1__.Editor(editForm, handler, keys, actionButton);
}
async function hidrate(tableManager) {
    const currentType = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
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
                editRow(activatedRow);
            }
            else if (btnText == "Delete") {
                const currentCollection = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
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
function editRow(activatedRow) {
    isEditing = true;
    const keys = tableKeys[vehicleType];
    const record = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getTableRecord)(activatedRow, keys);
    const createForm = document.getElementById("create");
    const editForm = document.getElementById("edit");
    (0,_utils__WEBPACK_IMPORTED_MODULE_5__.setFormValues)(keys, editForm, record);
    toggleForms(editForm, createForm);
}
function identify(cars, id) {
    return cars.find(e => e.id == id);
}
async function onSubmit(data) {
    try {
        const validators = (0,_models_validators__WEBPACK_IMPORTED_MODULE_8__.getValidators)();
        Object.keys(data).forEach(k => {
            if (validators[k]) {
                validators[k](data[k]);
            }
        });
        data.id = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.generateId)();
        alert(JSON.stringify(data));
        const type = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
        (0,_utils__WEBPACK_IMPORTED_MODULE_5__.mapSelectsToValues)(data);
        validators;
        const Class = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getClass)(type.slice(0, -1), data);
        tableManager.add(data);
        ls.create(type, Class);
    }
    catch (error) {
        alert(error);
    }
}
async function onEdit(data) {
    const collectionName = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
    (0,_utils__WEBPACK_IMPORTED_MODULE_5__.mapSelectsToValues)(data);
    try {
        const newRecord = { ...await ls.getById(collectionName, editId), ...data };
        tableManager.replace(editId, newRecord);
        await ls.update(collectionName, editId, data);
    }
    catch (error) {
        alert(error);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFO1FBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQztLQUNmO0FBQ0wsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9FZGl0b3IudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZG9tL1RhYmxlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9kb20udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbW9kZWxzL1N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbW9kZWxzL3ZhbGlkYXRvcnMudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbW9kZWxzL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvQ3JlYXRlVmVoaWNsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92aWV3cy9FZGl0VmVoaWNsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92aWV3cy9jcmVhdGVDYXJSb3cudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvY3JlYXRlVHJ1Y2tSb3cudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9yZW50ZWRWZWhpY2xlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXROdW1iZXJGcm9tU3RyaW5nIH0gZnJvbSBcIi4uL3V0aWxzXCJcbmV4cG9ydCBjbGFzcyBFZGl0b3Ige1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZm9ybTogSFRNTEZvcm1FbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrOiAoZGF0YTogb2JqZWN0KSA9PiBhbnksXG4gICAgICAgIHByaXZhdGUgcHJvcE5hbWVzOiBzdHJpbmdbXSwgb3JpZ2luYXRvcj86IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLm9uU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hdG9yKSBvcmlnaW5hdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgb25TdWJtaXQoZXZlbnQ6IFN1Ym1pdEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKHRoaXMuZm9ybSk7XG4gICAgICAgIGNvbnN0IHJlbnRhbFByaWNlID0gZm9ybURhdGEuZ2V0KFwicmVudGFsUHJpY2VcIikudG9TdHJpbmcoKTtcbiAgICAgICAgZm9ybURhdGEuc2V0KFwicmVudGFsUHJpY2VcIiwgcmVudGFsUHJpY2UpO1xuICAgICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMucHJvcE5hbWVzLm1hcChuID0+IFtuLCBmb3JtRGF0YS5nZXQobildKSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gYWN0aXZhdGVkUm93LnJvd0luZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlUm93ID0gdGhpcy5yZWNvcmRzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBkZWxldGVSb3dbXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgJHtpZH1gKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZChyZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmNyZWF0ZVJvdyhyZWNvcmQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIHJvdyk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIH1cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID09PSBpZCk7XG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmNyZWF0ZVJvdy5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCBuZXdSb3cgPSBmKG5ld1JlY29yZCk7XG4gICAgICAgIC8vIHJvdy5yZXBsYWNlV2l0aChuZXdSb3cpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkKG5ld1JvdywgdGhpcy5lbGVtZW50LmNoaWxkTm9kZXMuaXRlbShpbmRleCArIDEpKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIG5ld1Jvdyk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEsIG5ld1JlY29yZCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGlkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucmVjb3Jkcy5maW5kSW5kZXgociA9PiByID09IHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93KGlkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucm93cy5kZWxldGUocmVjb3JkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufSIsInR5cGUgRG9tQ29udGVudCA9IHN0cmluZyB8IE5vZGU7XG5cbnR5cGUgZWxlbWVudEZhY3Rvcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IChwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSA9PiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tKHR5cGU6IHN0cmluZywgcHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3BOYW1lLnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnZGF0YScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YU5hbWUgPSBwcm9wTmFtZS5zbGljZSg0LCA1KS50b0xvd2VyQ2FzZSgpICsgcHJvcE5hbWUuc2xpY2UoNSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhc2V0W2RhdGFOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGNvbnRlbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCB0YWJsZTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGFibGUnKTtcbmV4cG9ydCBjb25zdCB0aGVhZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoZWFkJyk7XG5leHBvcnQgY29uc3QgdGJvZHk6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IHRyOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVSb3dFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0cicpO1xuZXhwb3J0IGNvbnN0IHRoOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGgnKTtcbmV4cG9ydCBjb25zdCB0ZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RkJyk7XG5leHBvcnQgY29uc3QgYnV0dG9uOiBlbGVtZW50RmFjdG9yeTxIVE1MQnV0dG9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYnV0dG9uJyk7XG5leHBvcnQgY29uc3Qgc3BhbjogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzcGFuJyk7XG5leHBvcnQgY29uc3QgbGFiZWw6IGVsZW1lbnRGYWN0b3J5PEhUTUxMYWJlbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgaW5wdXQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxJbnB1dEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2lucHV0Jyk7XG5leHBvcnQgY29uc3Qgc2VsZWN0OiBlbGVtZW50RmFjdG9yeTxIVE1MU2VsZWN0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3Qgb3B0aW9uOiBlbGVtZW50RmFjdG9yeTxIVE1MT3B0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgZm9ybTogZWxlbWVudEZhY3Rvcnk8SFRNTEZvcm1FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdmb3JtJyk7XG5leHBvcnQgY29uc3QgZGl2OiBlbGVtZW50RmFjdG9yeTxIVE1MRGl2RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZGl2Jyk7XG5leHBvcnQgY29uc3QgYTogZWxlbWVudEZhY3Rvcnk8SFRNTEFuY2hvckVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2EnKTtcbmV4cG9ydCBjb25zdCBwOiBlbGVtZW50RmFjdG9yeTxIVE1MUGFyYWdyYXBoRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAncCcpO1xuZXhwb3J0IGNvbnN0IGgzOiBlbGVtZW50RmFjdG9yeTxIVE1MSGVhZGluZ0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2gzJyk7XG5leHBvcnQgY29uc3Qgc3Ryb25nOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3N0cm9uZycpOyIsImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgZ2V0TG9jYXRpb24gfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuY29uc3QgY2FyVmFsaWRhdG9yID0ge1xuICAgIFwibWFrZVwiOiAobWFrZSkgPT4geyBpZiAobWFrZS50cmltKCkgPT09IFwiXCIpIHRocm93IG5ldyBSYW5nZUVycm9yKFwibWFrZSBjYW5ub3QgYmUgZW1wdHlcIikgfSxcbiAgICBcIm1vZGVsXCI6IChtb2RlbCkgPT4geyBpZiAobW9kZWwudHJpbSgpID09PSBcIlwiKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIm1vZGVsIGNhbm5vdCBiZSBlbXB0eVwiKSB9LFxuICAgIFwibnVtYmVyT2ZTZWF0c1wiOiAobnVtYmVyT2ZTZWF0cykgPT4geyBpZiAoaXNOYU4obnVtYmVyT2ZTZWF0cykgfHwgK251bWJlck9mU2VhdHMgPCAxIHx8ICtudW1iZXJPZlNlYXRzID4gOSkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCIxIDwgbnVtYmVyT2ZTZWF0czwgOVwiKSB9LFxufTtcblxuY29uc3QgdHJ1Y2tWYWxpZGF0b3IgPSB7XG4gICAgXCJtYWtlXCI6IChtYWtlKSA9PiB7IGlmIChtYWtlLnRyaW0oKSA9PT0gXCJcIikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJtYWtlIGNhbm5vdCBiZSBlbXB0eVwiKSB9LFxuICAgIFwibW9kZWxcIjogKG1vZGVsKSA9PiB7IGlmIChtb2RlbC50cmltKCkgPT09IFwiXCIpIHRocm93IG5ldyBSYW5nZUVycm9yKFwibW9kZWwgY2Fubm90IGJlIGVtcHR5XCIpIH0sXG4gICAgXCJjYXBhY2l0eVwiOiAoY2FwYWNpdHkpID0+IHsgaWYgKGlzTmFOKGNhcGFjaXR5KSB8fCArY2FwYWNpdHkgPCAxIHx8ICtjYXBhY2l0eSA+IDQpIHRocm93IG5ldyBSYW5nZUVycm9yKFwiMSA8IENhcGFjaXR5IDw9IDQgXCIpIH0sXG59O1xuXG5cbmNvbnN0IHZhbGlkYXRvcnMgPSB7XG4gICAgY2FyOiBjYXJWYWxpZGF0b3IsXG4gICAgdHJ1Y2s6IHRydWNrVmFsaWRhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRWYWxpZGF0b3JzKCkge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbiAgICByZXR1cm4gdmFsaWRhdG9yc1t0eXBlXTtcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWFrZTogc3RyaW5nO1xuICAgIG1vZGVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWhpY2xlIGltcGxlbWVudHMgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIElDYXIgZXh0ZW5kcyBJVmVoaWNsZSwgQ2FyUGFyYW1zIHtcblxufVxuZXhwb3J0IGludGVyZmFjZSBJVHJ1Y2sgZXh0ZW5kcyBJVmVoaWNsZSwgVHJ1Y2tQYXJhbXMgeyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gY2FyUGFyYW1zLnJlbnRlZFRvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSBjYXJQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gQm9keVR5cGVzLnNlZGFuO1xuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gNDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gVHJhbnNtaXNzaW9ucy5hdXRvbWF0aWM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnVjayBleHRlbmRzIFZlaGljbGUge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgdHJ1Y2tQYXJhbXM/OiBUcnVja1BhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gMjtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQ2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FyZ29UeXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gdHJ1Y2tQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gdHJ1Y2tQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgQ2FyZ29UeXBlcywgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zLCBDYXIsIFRydWNrIH0gZnJvbSBcIi4vbW9kZWxzL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gYCR7ZnVuYygpfS0ke2Z1bmMoKX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgnLycsICcnKS5zcGxpdCgnLicpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW51bSgpOiBhbnkge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTsvL3RydWNrXG4gICAgY29uc3Qga3ZwID0ge1xuICAgICAgICBcInRydWNrXCI6IFt7IGNhcmdvVHlwZTogQ2FyZ29UeXBlcyB9XSxcbiAgICAgICAgXCJjYXJcIjogW3sgYm9keVR5cGU6IEJvZHlUeXBlcyB9LCB7IHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucyB9XVxuICAgIH1cbiAgICByZXR1cm4ga3ZwW3R5cGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3ModHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGlkLCBtYWtlLCBtb2RlbCwgLi4ucmVzdCB9ID0gZGF0YTtcbiAgICByZXR1cm4gdHlwZSA9PT0gXCJjYXJcIiA/IG5ldyBDYXIoaWQsIG1ha2UsIG1vZGVsLCByZXN0KSA6IG5ldyBUcnVjayhpZCwgbWFrZSwgbW9kZWwsIHJlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICBjb25zdCBlbnVtVmFsc1N0cmluZyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICBjb25zdCBlbnVtVmFsc051bWJlciA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+ICFpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gZGF0YVtlbnVtS2V5XTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBlbnVtVmFsc1N0cmluZy5pbmRleE9mKGN1cnJlbnRTZWxlY3RWYWx1ZSk7XG4gICAgICAgIGRhdGFbZW51bUtleV0gPSBlbnVtVmFsc051bWJlcltpbmRleF07XG5cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZvcm1WYWx1ZXMoa2V5czogc3RyaW5nW10sIGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIHJlY29yZDoge30pIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgZW51bXMuZm9yRWFjaChlbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gZW51bUtleSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzU3RyaW5nID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bVZhbHNOdW1iZXIgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiAhaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gcmVjb3JkW2VudW1LZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZW51bVZhbHNTdHJpbmcuaW5kZXhPZihjdXJyZW50U2VsZWN0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgKGVkaXRGb3JtW2tleV0gYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnNlbGVjdGVkSW5kZXggPSBOdW1iZXIoZW51bVZhbHNOdW1iZXJbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGVkaXRGb3JtW2tleV0udmFsdWUgPSByZWNvcmRba2V5XTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCwga2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gWy4uLmFjdGl2YXRlZFJvdy5jaGlsZHJlbl0uc2xpY2UoMSkucmVkdWNlKChhLCBiLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJyZW50YWxQcmljZVwiKSB7XG4gICAgICAgICAgICBjb25zdCByID0gLy0/XFxkKy87XG4gICAgICAgICAgICBjb25zdCBwcmljZSA9IGIudGV4dENvbnRlbnQubWF0Y2gocik7XG4gICAgICAgICAgICBhW2tleV0gPSBOdW1iZXIocHJpY2VbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVtrZXldID0gYi50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXJGcm9tU3RyaW5nKHN0cjogc3RyaW5nKSA6bnVtYmVye1xuICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICBjb25zdCBudW1iZXJzID0gc3RyLm1hdGNoKHIpO1xuICAgIHJldHVybiBOdW1iZXIobnVtYmVyc1swXSk7XG59IiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb24sIGdldEVudW0gfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlVHJ1Y2soa2V5cykge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuXG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGVuID0gZW51bXNbaV07XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbiAgICBjb25zdCBjYXBpdGFsaXplZFR5cGUgPSB0eXBlWzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpO1xuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJjcmVhdGVcIiB9LCBgQWRkICR7Y2FwaXRhbGl6ZWRUeXBlfWApO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBzdWJtaXRCdG4sIGNhbmNlbEJ0bik7XG4gICAgcmV0dXJuIGZvcm0oeyBjbGFzc05hbWU6IFwiYWxpZ25cIiwgaWQ6IFwiY3JlYXRlXCIgfSwgLi4uZmllbGRzLCBidXR0b25XcmFwcGVyRGl2KVxufSIsImltcG9ydCB7IHNwYW4sIGlucHV0LCBsYWJlbCwgc2VsZWN0LCBvcHRpb24sIGJ1dHRvbiwgZm9ybSwgZGl2IH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IGdldEVudW0gfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGdldExvY2F0aW9uIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBFZGl0VHJ1Y2soa2V5cykge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuXG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGVuID0gZW51bXNbaV07XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbiAgICBjb25zdCBjYXBpdGFsaXplZFR5cGUgPSB0eXBlWzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpO1xuICAgIGNvbnN0IGVkaXRCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNvbmZpcm1cIiwgdHlwZTogXCJzdWJtaXRcIiwgaWQ6IFwiZWRpdFwiIH0sIGBTYXZlICR7Y2FwaXRhbGl6ZWRUeXBlfWApO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBlZGl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImVkaXRcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG5cblxuXG4iLCJpbXBvcnQgeyB0ciwgdGQsIGJ1dHRvbiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMgfSBmcm9tIFwiLi4vbW9kZWxzL3ZlaGljbGVcIjtcbmltcG9ydCB7IENhciB9IGZyb20gXCIuLi9tb2RlbHMvdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FyUm93KGNhcjogQ2FyKSB7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCBjYXIuaWQpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIEJvZHlUeXBlc1tjYXIuYm9keVR5cGVdKSxcbiAgICAgICAgdGQoe30sIGNhci5udW1iZXJPZlNlYXRzLnRvU3RyaW5nKCkpLFxuICAgICAgICB0ZCh7fSwgVHJhbnNtaXNzaW9uc1tjYXIudHJhbnNtaXNzaW9uXSksXG4gICAgICAgIHRkKHt9LCBgJCR7Y2FyLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBlZGl0XCIgfSwgJ0VkaXQnKSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBkZWxldGVcIiB9LCAnRGVsZXRlJykpXG4gICAgKTtcblxuICAgIHJldHVybiByb3c7XG59IiwiaW1wb3J0IHsgdHIsIHRkLCBidXR0b24gfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgQ2FyZ29UeXBlcywgVHJ1Y2sgfSBmcm9tIFwiLi4vbW9kZWxzL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRydWNrUm93KHRydWNrOiBUcnVjaykge1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKHRydWNrKSk7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCB0cnVjay5pZCksXG4gICAgICAgIHRkKHt9LCB0cnVjay5tYWtlKSxcbiAgICAgICAgdGQoe30sIHRydWNrLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSksXG4gICAgICAgIHRkKHt9LCB0cnVjay5jYXBhY2l0eS50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGAkJHt0cnVjay5yZW50YWxQcmljZS50b1N0cmluZygpfS9kYXlgKSxcbiAgICAgICAgdGQoe30sIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZWRpdFwiIH0sICdFZGl0JyksIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZGVsZXRlXCIgfSwgJ0RlbGV0ZScpKVxuICAgICk7XG4gICAgcmV0dXJuIHJvdztcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL21vZGVscy9TdG9yYWdlXCI7XG5pbXBvcnQgeyBJVmVoaWNsZSB9IGZyb20gXCIuL21vZGVscy92ZWhpY2xlXCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwiLi9kb20vRWRpdG9yXCI7XG5pbXBvcnQgeyBDcmVhdGVUcnVjayB9IGZyb20gXCIuL3ZpZXdzL0NyZWF0ZVZlaGljbGVcIjtcbmltcG9ydCB7IEVkaXRUcnVjayB9IGZyb20gXCIuL3ZpZXdzL0VkaXRWZWhpY2xlXCJcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyBtYXBTZWxlY3RzVG9WYWx1ZXMsIHNldEZvcm1WYWx1ZXMsIGdldFRhYmxlUmVjb3JkLCBnZXRMb2NhdGlvbiwgZ2V0Q2xhc3MsIGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQgeyBjcmVhdGVUcnVja1JvdyB9IGZyb20gXCIuL3ZpZXdzL2NyZWF0ZVRydWNrUm93XCI7XG5pbXBvcnQgeyBjcmVhdGVDYXJSb3cgfSBmcm9tIFwiLi92aWV3cy9jcmVhdGVDYXJSb3dcIjtcbmltcG9ydCB7IGdldFZhbGlkYXRvcnMgfSBmcm9tIFwiLi9tb2RlbHMvdmFsaWRhdG9yc1wiO1xuXG5leHBvcnQgY29uc3QgdGFibGVLZXlzID0ge1xuICAgIFwidHJ1Y2tcIjogW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwiY2FyZ29UeXBlXCIsIFwiY2FwYWNpdHlcIiwgXCJyZW50YWxQcmljZVwiXSxcbiAgICBcImNhclwiOiBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJib2R5VHlwZVwiLCBcIm51bWJlck9mU2VhdHNcIiwgXCJ0cmFuc21pc3Npb25cIiwgXCJyZW50YWxQcmljZVwiXVxufTtcblxubGV0IGVkaXRJZCA9IG51bGw7XG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcbmxldCBpc0VkaXRpbmcgPSBmYWxzZTtcbmNvbnN0IHZlaGljbGVUeXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7XG5jb25zdCBhY3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aW9uIG5ld1wiKVswXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbmluaXRpYWxpemUoKTtcblxuYWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBhY3Rpb25CdXR0b25IYW5kbGVyKGUpO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGUpO1xufSk7XG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG5jb25zdCBjcmVhdGVSb3cgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKSA9PT0gJ2NhcicgPyBjcmVhdGVDYXJSb3cgOiBjcmVhdGVUcnVja1JvdztcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlUm93LCBpZGVudGlmeSk7XG5oaWRyYXRlKHRhYmxlTWFuYWdlcik7XG5cbmZ1bmN0aW9uIGFjdGlvbkJ1dHRvbkhhbmRsZXIoZTogTW91c2VFdmVudCkge1xuICAgIGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgKGUudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbn1cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBDbGFzcyA9IGdldENsYXNzKHZlaGljbGVUeXBlLCB7IGlkOiBcImFcIiwgbW9kZWw6IFwiYlwiLCBtYWtlOiBcImNcIiB9KTtcbiAgICBjb25zdCB2ZWhpY2xlS2V5cyA9IE9iamVjdC5rZXlzKENsYXNzKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJpZFwiICYmIGtleSAhPSBcInJlbnRlZFRvXCIpO1xuICAgIGNvbnN0IGUxID0gY29uZmlnRWRpdG9yKHZlaGljbGVLZXlzLCBDcmVhdGVUcnVjaywgb25TdWJtaXQsIFwiY3JlYXRlXCIpO1xuICAgIGNvbnN0IGUyID0gY29uZmlnRWRpdG9yKHZlaGljbGVLZXlzLCBFZGl0VHJ1Y2ssIG9uRWRpdCwgXCJlZGl0XCIpO1xuICAgIFsuLi4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvciBmb3JtJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pXS5mb3JFYWNoKGVsID0+IGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ0VkaXRvcihrZXlzLCB2aWV3LCBoYW5kbGVyLCBpZCkge1xuICAgIGNvbnN0IGluZGV4ID0gaWQgPT0gXCJlZGl0XCIgPyAyIDogMTtcbiAgICBjb25zdCB7IG5ld0VkaXRvcjogdXBkYXRlRWRpdG9yLCBodG1sOiBodG1sMiB9ID0gZ2V0RWRpdG9yKGtleXMsIHZpZXcsIGluZGV4KVxuICAgIHVwZGF0ZUVkaXRvci5hcHBlbmRDaGlsZChodG1sMik7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIGVkaXRGb3JtLnN0eWxlLmJhY2tncm91bmQgPSBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIG5ldyBFZGl0b3IoZWRpdEZvcm0sIGhhbmRsZXIsIGtleXMsIGFjdGlvbkJ1dHRvbik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSkge1xuICAgIGNvbnN0IGN1cnJlbnRUeXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICBjb25zdCB2ZWhpY2xlcyA9IGF3YWl0IGxzLmdldEFsbChjdXJyZW50VHlwZSk7XG4gICAgdmVoaWNsZXMuZm9yRWFjaCh2ZWhpY2xlID0+IHRhYmxlTWFuYWdlci5hZGQodmVoaWNsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0b3Ioa2V5czogc3RyaW5nW10sIHZpZXcsIGluZGV4KSB7XG4gICAgY29uc3QgaHRtbCA9IHZpZXcoa2V5cyk7XG4gICAgY29uc3QgbmV3RWRpdG9yID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lZGl0b3InKVtpbmRleF0gYXMgSFRNTEVsZW1lbnQpO1xuICAgIG5ld0VkaXRvci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHJldHVybiB7IG5ld0VkaXRvciwgaHRtbCB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVGb3JtcyhlZGl0Rm9ybTogSFRNTEZvcm1FbGVtZW50LCBjcmVhdGVGb3JtOiBIVE1MRm9ybUVsZW1lbnQpIHtcbiAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICAgIGVkaXRGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIGNyZWF0ZUZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVkaXRGb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbGlzdGVuRm9yVGFibGVjbGljayhlOiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGJ0blRleHQgPSB0YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmIChidG5UZXh0ID09IFwiRWRpdFwiIHx8IGJ0blRleHQgPT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgIGVkaXRJZCA9IGFjdGl2YXRlZFJvdy5jaGlsZHJlblswXS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGlmIChidG5UZXh0ID09IFwiRWRpdFwiKSB7XG4gICAgICAgICAgICAgICAgZWRpdFJvdyhhY3RpdmF0ZWRSb3cpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChidG5UZXh0ID09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29sbGVjdGlvbiA9IGdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbHMuZGVsZXRlKGN1cnJlbnRDb2xsZWN0aW9uLCBlZGl0SWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVkaXRSb3coYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50KSB7XG4gICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBrZXlzID0gdGFibGVLZXlzW3ZlaGljbGVUeXBlXTtcbiAgICBjb25zdCByZWNvcmQgPSBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3csIGtleXMpO1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHNldEZvcm1WYWx1ZXMoa2V5cywgZWRpdEZvcm0sIHJlY29yZCk7XG4gICAgdG9nZ2xlRm9ybXMoZWRpdEZvcm0sIGNyZWF0ZUZvcm0pO1xufVxuXG5mdW5jdGlvbiBpZGVudGlmeShjYXJzOiBJVmVoaWNsZVtdLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNhcnMuZmluZChlID0+IGUuaWQgPT0gaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBvblN1Ym1pdChkYXRhKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFsaWRhdG9yczogeyBbazogc3RyaW5nXTogKHY6IHN0cmluZykgPT4gdm9pZCB9ID0gZ2V0VmFsaWRhdG9ycygpO1xuICAgICAgICBPYmplY3Qua2V5cyhkYXRhKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbGlkYXRvcnNba10pIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0b3JzW2tdKGRhdGFba10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgICAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpO1xuICAgICAgICBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YSk7XG4gICAgICAgIHZhbGlkYXRvcnNcbiAgICAgICAgY29uc3QgQ2xhc3MgPSBnZXRDbGFzcyh0eXBlLnNsaWNlKDAsIC0xKSwgZGF0YSk7XG4gICAgICAgIHRhYmxlTWFuYWdlci5hZGQoZGF0YSk7XG4gICAgICAgIGxzLmNyZWF0ZSh0eXBlLCBDbGFzcyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gb25FZGl0KGRhdGEpIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IGdldExvY2F0aW9uKCk7XG4gICAgbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGEpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld1JlY29yZCA9IHsgLi4uYXdhaXQgbHMuZ2V0QnlJZChjb2xsZWN0aW9uTmFtZSwgZWRpdElkKSwgLi4uZGF0YSB9O1xuICAgICAgICB0YWJsZU1hbmFnZXIucmVwbGFjZShlZGl0SWQsIG5ld1JlY29yZCk7XG4gICAgICAgIGF3YWl0IGxzLnVwZGF0ZShjb2xsZWN0aW9uTmFtZSwgZWRpdElkLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcilcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9