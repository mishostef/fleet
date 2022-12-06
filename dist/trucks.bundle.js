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
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vehicle */ "./src/vehicle.ts");

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
        "truck": [{ cargoType: _vehicle__WEBPACK_IMPORTED_MODULE_0__.CargoTypes }],
        "car": [{ bodyType: _vehicle__WEBPACK_IMPORTED_MODULE_0__.BodyTypes }, { transmission: _vehicle__WEBPACK_IMPORTED_MODULE_0__.Transmissions }]
    };
    return kvp[type];
}
function getClass(type, data) {
    const { id, make, model, ...rest } = data;
    return type === "car" ? new _vehicle__WEBPACK_IMPORTED_MODULE_0__.Car(id, make, model, rest) : new _vehicle__WEBPACK_IMPORTED_MODULE_0__.Truck(id, make, model, rest);
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
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vehicle */ "./src/vehicle.ts");


function createCarRow(car) {
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[car.bodyType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, car.numberOfSeats.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions[car.transmission]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, `$${car.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action delete" }, 'Delete')));
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
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vehicle */ "./src/vehicle.ts");


function createTruckRow(truck) {
    console.log(truck.cargoType);
    console.log(_vehicle__WEBPACK_IMPORTED_MODULE_1__.CargoTypes[truck.cargoType]);
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.CargoTypes[truck.cargoType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, truck.capacity.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, `$${truck.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action delete" }, 'Delete')));
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
/*!***********************!*\
  !*** ./src/trucks.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tableKeys": () => (/* binding */ tableKeys)
/* harmony export */ });
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _dom_Editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/Editor */ "./src/dom/Editor.ts");
/* harmony import */ var _views_CreateTruck__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/CreateTruck */ "./src/views/CreateTruck.ts");
/* harmony import */ var _views_EditTruck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./views/EditTruck */ "./src/views/EditTruck.ts");
/* harmony import */ var _dom_Table__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom/Table */ "./src/dom/Table.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _views_createTruckRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./views/createTruckRow */ "./src/views/createTruckRow.ts");
/* harmony import */ var _views_createCarRow__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./views/createCarRow */ "./src/views/createCarRow.ts");








const tableKeys = {
    "truck": ["make", "model", "cargoType", "capacity", "rentalPrice"],
    "car": ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"]
};
let editId = null;
const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
let isEditing = false;
const vehicleType = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)().slice(0, -1);
const actionButton = document.getElementsByClassName("action new")[0];
initialize();
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
function initialize() {
    const Class = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getClass)(vehicleType, { id: "a", model: "b", make: "c" });
    const vehicleKeys = Object.keys(Class).filter(key => key !== "id" && key != "rentedTo");
    const e1 = configEditor(vehicleKeys, _views_CreateTruck__WEBPACK_IMPORTED_MODULE_2__.CreateTruck, onSubmit, "create");
    const e2 = configEditor(vehicleKeys, _views_EditTruck__WEBPACK_IMPORTED_MODULE_3__.EditTruck, onEdit, "edit");
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
const table = document.getElementsByTagName('table')[0];
const createRow = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)().slice(0, -1) === 'car' ? _views_createCarRow__WEBPACK_IMPORTED_MODULE_7__.createCarRow : _views_createTruckRow__WEBPACK_IMPORTED_MODULE_6__.createTruckRow; ///////here last edit
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_4__.Table(table, createRow, identify); //
hidrate(tableManager);
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
    data.id = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.generateId)();
    alert(JSON.stringify(data));
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
    (0,_utils__WEBPACK_IMPORTED_MODULE_5__.mapSelectsToValues)(data);
    const Class = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getClass)(type.slice(0, -1), data);
    tableManager.add(data);
    try {
        ls.create(type, Class);
    }
    catch (error) {
        alert(error);
    }
}
async function onEdit(data) {
    alert('in Edit...');
    console.log('data in edit: ', data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEI7QUFDTCxDQUFDO0FBRUQsS0FBSyxVQUFVLE1BQU0sQ0FBQyxJQUFJO0lBQ3RCLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwQyxNQUFNLGNBQWMsR0FBRyxtREFBVyxFQUFFLENBQUM7SUFDckMsMERBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekIsSUFBSTtRQUNBLE1BQU0sU0FBUyxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDM0UsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDakQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLEtBQUssQ0FBQyxLQUFLLENBQUM7S0FDZjtBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9FZGl0b3IudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZG9tL1RhYmxlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9kb20udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmVoaWNsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92aWV3cy9DcmVhdGVUcnVjay50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92aWV3cy9FZGl0VHJ1Y2sudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvY3JlYXRlQ2FyUm93LnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZpZXdzL2NyZWF0ZVRydWNrUm93LnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdHJ1Y2tzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuICAgIGFzeW5jIGdldEFsbENvbGxlY3Rpb25zRGF0YSgpOiBQcm9taXNlPFJlY29yZFtdPiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKG9iaiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9iaiwgW2tdOiAoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKSkpLm1hcCh4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgudHlwZSA9IGsuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcblxuICAgIH1cbiAgICBhc3luYyBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlbXMuZmluZChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZDogZ2VuZXJhdGVJZCgpIH0pO1xuICAgICAgICBpdGVtcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWNvcmQgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGlkIH0pO1xuICAgICAgICBpdGVtc1tpbmRleF0gPSByZWNvcmQ7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBSZWNvcmQgJHtpZH0gbm90IGZvdW5kIGluIFwiJHtjb2xsZWN0aW9uTmFtZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBnZXROdW1iZXJGcm9tU3RyaW5nIH0gZnJvbSBcIi4uL3V0aWxzXCJcbmV4cG9ydCBjbGFzcyBFZGl0b3Ige1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZm9ybTogSFRNTEZvcm1FbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrOiAoZGF0YTogb2JqZWN0KSA9PiBhbnksXG4gICAgICAgIHByaXZhdGUgcHJvcE5hbWVzOiBzdHJpbmdbXSwgb3JpZ2luYXRvcj86IEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLm9uU3VibWl0LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcigncmVzZXQnLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5mb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hdG9yKSBvcmlnaW5hdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgb25TdWJtaXQoZXZlbnQ6IFN1Ym1pdEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKHRoaXMuZm9ybSk7XG4gICAgICAgIGNvbnN0IHJlbnRhbFByaWNlID0gZm9ybURhdGEuZ2V0KFwicmVudGFsUHJpY2VcIikudG9TdHJpbmcoKTtcbiAgICAgICAgZm9ybURhdGEuc2V0KFwicmVudGFsUHJpY2VcIiwgcmVudGFsUHJpY2UpO1xuICAgICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMucHJvcE5hbWVzLm1hcChuID0+IFtuLCBmb3JtRGF0YS5nZXQobildKSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gYWN0aXZhdGVkUm93LnJvd0luZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlUm93ID0gdGhpcy5yZWNvcmRzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBkZWxldGVSb3dbXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgJHtpZH1gKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZChyZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmNyZWF0ZVJvdyhyZWNvcmQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIHJvdyk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIH1cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID09PSBpZCk7XG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmNyZWF0ZVJvdy5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCBuZXdSb3cgPSBmKG5ld1JlY29yZCk7XG4gICAgICAgIC8vIHJvdy5yZXBsYWNlV2l0aChuZXdSb3cpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkKG5ld1JvdywgdGhpcy5lbGVtZW50LmNoaWxkTm9kZXMuaXRlbShpbmRleCArIDEpKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIG5ld1Jvdyk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEsIG5ld1JlY29yZCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGlkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucmVjb3Jkcy5maW5kSW5kZXgociA9PiByID09IHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93KGlkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucm93cy5kZWxldGUocmVjb3JkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufSIsInR5cGUgRG9tQ29udGVudCA9IHN0cmluZyB8IE5vZGU7XG5cbnR5cGUgZWxlbWVudEZhY3Rvcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IChwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSA9PiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tKHR5cGU6IHN0cmluZywgcHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3BOYW1lLnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnZGF0YScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YU5hbWUgPSBwcm9wTmFtZS5zbGljZSg0LCA1KS50b0xvd2VyQ2FzZSgpICsgcHJvcE5hbWUuc2xpY2UoNSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhc2V0W2RhdGFOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGNvbnRlbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCB0YWJsZTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGFibGUnKTtcbmV4cG9ydCBjb25zdCB0aGVhZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoZWFkJyk7XG5leHBvcnQgY29uc3QgdGJvZHk6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IHRyOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVSb3dFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0cicpO1xuZXhwb3J0IGNvbnN0IHRoOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGgnKTtcbmV4cG9ydCBjb25zdCB0ZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RkJyk7XG5leHBvcnQgY29uc3QgYnV0dG9uOiBlbGVtZW50RmFjdG9yeTxIVE1MQnV0dG9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYnV0dG9uJyk7XG5leHBvcnQgY29uc3Qgc3BhbjogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzcGFuJyk7Ly8vXG5leHBvcnQgY29uc3QgbGFiZWw6IGVsZW1lbnRGYWN0b3J5PEhUTUxMYWJlbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgaW5wdXQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxJbnB1dEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2lucHV0Jyk7XG5leHBvcnQgY29uc3Qgc2VsZWN0OiBlbGVtZW50RmFjdG9yeTxIVE1MU2VsZWN0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3Qgb3B0aW9uOiBlbGVtZW50RmFjdG9yeTxIVE1MT3B0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgZm9ybTogZWxlbWVudEZhY3Rvcnk8SFRNTEZvcm1FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdmb3JtJyk7XG5leHBvcnQgY29uc3QgZGl2OiBlbGVtZW50RmFjdG9yeTxIVE1MRGl2RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZGl2Jyk7XG5leHBvcnQgY29uc3QgYTogZWxlbWVudEZhY3Rvcnk8SFRNTEFuY2hvckVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2EnKTtcbmV4cG9ydCBjb25zdCBwOiBlbGVtZW50RmFjdG9yeTxIVE1MUGFyYWdyYXBoRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAncCcpO1xuZXhwb3J0IGNvbnN0IGgzOiBlbGVtZW50RmFjdG9yeTxIVE1MSGVhZGluZ0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2gzJyk7XG5leHBvcnQgY29uc3Qgc3Ryb25nOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3N0cm9uZycpOyIsImltcG9ydCB7IENhcmdvVHlwZXMsIEJvZHlUeXBlcywgVHJhbnNtaXNzaW9ucywgQ2FyLCBUcnVjayB9IGZyb20gXCIuL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gYCR7ZnVuYygpfS0ke2Z1bmMoKX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgnLycsICcnKS5zcGxpdCgnLicpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW51bSgpOiBhbnkge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTsvL3RydWNrXG4gICAgY29uc3Qga3ZwID0ge1xuICAgICAgICBcInRydWNrXCI6IFt7IGNhcmdvVHlwZTogQ2FyZ29UeXBlcyB9XSxcbiAgICAgICAgXCJjYXJcIjogW3sgYm9keVR5cGU6IEJvZHlUeXBlcyB9LCB7IHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucyB9XVxuICAgIH1cbiAgICByZXR1cm4ga3ZwW3R5cGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3ModHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGlkLCBtYWtlLCBtb2RlbCwgLi4ucmVzdCB9ID0gZGF0YTtcbiAgICByZXR1cm4gdHlwZSA9PT0gXCJjYXJcIiA/IG5ldyBDYXIoaWQsIG1ha2UsIG1vZGVsLCByZXN0KSA6IG5ldyBUcnVjayhpZCwgbWFrZSwgbW9kZWwsIHJlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICBjb25zdCBlbnVtVmFsc1N0cmluZyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICBjb25zdCBlbnVtVmFsc051bWJlciA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+ICFpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gZGF0YVtlbnVtS2V5XTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBlbnVtVmFsc1N0cmluZy5pbmRleE9mKGN1cnJlbnRTZWxlY3RWYWx1ZSk7XG4gICAgICAgIGRhdGFbZW51bUtleV0gPSBlbnVtVmFsc051bWJlcltpbmRleF07XG5cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZvcm1WYWx1ZXMoa2V5czogc3RyaW5nW10sIGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIHJlY29yZDoge30pIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgZW51bXMuZm9yRWFjaChlbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gZW51bUtleSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzU3RyaW5nID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bVZhbHNOdW1iZXIgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiAhaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gcmVjb3JkW2VudW1LZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZW51bVZhbHNTdHJpbmcuaW5kZXhPZihjdXJyZW50U2VsZWN0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgKGVkaXRGb3JtW2tleV0gYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnNlbGVjdGVkSW5kZXggPSBOdW1iZXIoZW51bVZhbHNOdW1iZXJbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGVkaXRGb3JtW2tleV0udmFsdWUgPSByZWNvcmRba2V5XTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCwga2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gWy4uLmFjdGl2YXRlZFJvdy5jaGlsZHJlbl0uc2xpY2UoMSkucmVkdWNlKChhLCBiLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJyZW50YWxQcmljZVwiKSB7XG4gICAgICAgICAgICBjb25zdCByID0gLy0/XFxkKy87XG4gICAgICAgICAgICBjb25zdCBwcmljZSA9IGIudGV4dENvbnRlbnQubWF0Y2gocik7XG4gICAgICAgICAgICBhW2tleV0gPSBOdW1iZXIocHJpY2VbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVtrZXldID0gYi50ZXh0Q29udGVudDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXJGcm9tU3RyaW5nKHN0cjogc3RyaW5nKSA6bnVtYmVye1xuICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICBjb25zdCBudW1iZXJzID0gc3RyLm1hdGNoKHIpO1xuICAgIHJldHVybiBOdW1iZXIobnVtYmVyc1swXSk7XG59IiwiZXhwb3J0IGludGVyZmFjZSBJVmVoaWNsZSB7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICBpZDogc3RyaW5nO1xuICAgIG1ha2U6IHN0cmluZztcbiAgICBtb2RlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmVoaWNsZSBpbXBsZW1lbnRzIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlbnRlZFRvID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IC0xO1xuICAgIH1cbn1cbmV4cG9ydCBlbnVtIEJvZHlUeXBlcyB7XG4gICAgXCJzZWRhblwiLCBcInN1dlwiLCBcImhhdGNoYmFja1wiXG59XG5leHBvcnQgZW51bSBUcmFuc21pc3Npb25zIHtcbiAgICBcIm1hbnVhbFwiLCBcImF1dG9tYXRpY1wiXG59XG5leHBvcnQgZW51bSBDYXJnb1R5cGVzIHtcbiAgICBcImJveFwiLCBcImZsYXRiZWRcIiwgXCJ2YW5cIlxufVxuZXhwb3J0IGludGVyZmFjZSBDYXJQYXJhbXMge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ2FyIGV4dGVuZHMgSVZlaGljbGUsIENhclBhcmFtcyB7XG5cbn1cbmV4cG9ydCBpbnRlcmZhY2UgSVRydWNrIGV4dGVuZHMgSVZlaGljbGUsIFRydWNrUGFyYW1zIHsgfVxuXG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUGFyYW1zIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ2FyIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCBjYXJQYXJhbXM/OiBDYXJQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKGNhclBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IGNhclBhcmFtcy5ib2R5VHlwZTtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cyA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlNlYXRzIGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gY2FyUGFyYW1zLm51bWJlck9mU2VhdHM7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IGNhclBhcmFtcy50cmFuc21pc3Npb247XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLnJlbnRlZFRvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50ZWRUbyA9IGNhclBhcmFtcy5yZW50ZWRUbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gY2FyUGFyYW1zLnJlbnRhbFByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IEJvZHlUeXBlcy5zZWRhbjtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IFRyYW5zbWlzc2lvbnMuYXV0b21hdGljO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2sgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIHRydWNrUGFyYW1zPzogVHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSBDYXJnb1R5cGVzLmJveDtcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IDI7XG4gICAgICAgIGlmICh0cnVja1BhcmFtcykge1xuICAgICAgICAgICAgaWYgKHRydWNrUGFyYW1zLmNhcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRydWNrUGFyYW1zLmNhcGFjaXR5IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkNhcGFjaXR5IGNhbm5vdCBiZSBuZWdhdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jYXBhY2l0eSA9IHRydWNrUGFyYW1zLmNhcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRydWNrUGFyYW1zLmNhcmdvVHlwZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FyZ29UeXBlID0gdHJ1Y2tQYXJhbXMuY2FyZ29UeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRydWNrUGFyYW1zLnJlbnRlZFRvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50ZWRUbyA9IHRydWNrUGFyYW1zLnJlbnRlZFRvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRydWNrUGFyYW1zLnJlbnRhbFByaWNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IHRydWNrUGFyYW1zLnJlbnRhbFByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IHNwYW4sIGlucHV0LCBsYWJlbCwgc2VsZWN0LCBvcHRpb24sIGJ1dHRvbiwgZm9ybSwgZGl2IH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IGdldExvY2F0aW9uLCBnZXRFbnVtIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVRydWNrKGtleXMpIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IGtleXMubWFwKGtleSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW51bXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBlbiA9IGVudW1zW2ldO1xuICAgICAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBlbnVtS2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gZW51bVZhbHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZToga2V5IH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IGlucHV0KHsgdHlwZTogXCJ0ZXh0XCIsIG5hbWU6IGtleSB9KTtcbiAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudElucHV0KTtcbiAgICB9KTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWRUeXBlID0gdHlwZVswXS50b0xvY2FsZVVwcGVyQ2FzZSgpICsgdHlwZS5zbGljZSgxKTtcbiAgICBjb25zdCBzdWJtaXRCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNvbmZpcm1cIiwgdHlwZTogXCJzdWJtaXRcIiwgaWQ6IFwiY3JlYXRlXCIgfSwgYEFkZCAke2NhcGl0YWxpemVkVHlwZX1gKTtcbiAgICBjb25zdCBjYW5jZWxCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNhbmNlbFwiLCB0eXBlOiBcInJlc2V0XCIgfSwgXCJDYW5jZWxcIik7XG4gICAgY29uc3QgYnV0dG9uV3JhcHBlckRpdiA9IGRpdih7fSwgc3VibWl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImNyZWF0ZVwiIH0sIC4uLmZpZWxkcywgYnV0dG9uV3JhcHBlckRpdilcbn0iLCJpbXBvcnQgeyBzcGFuLCBpbnB1dCwgbGFiZWwsIHNlbGVjdCwgb3B0aW9uLCBidXR0b24sIGZvcm0sIGRpdiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBnZXRFbnVtIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgeyBnZXRMb2NhdGlvbiB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gRWRpdFRydWNrKGtleXMpIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcblxuICAgIGNvbnN0IGZpZWxkcyA9IGtleXMubWFwKGtleSA9PiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW51bXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBlbiA9IGVudW1zW2ldO1xuICAgICAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBlbnVtS2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gZW51bVZhbHM7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZToga2V5IH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IGlucHV0KHsgdHlwZTogXCJ0ZXh0XCIsIG5hbWU6IGtleSB9KTtcbiAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudElucHV0KTtcbiAgICB9KTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7XG4gICAgY29uc3QgY2FwaXRhbGl6ZWRUeXBlID0gdHlwZVswXS50b0xvY2FsZVVwcGVyQ2FzZSgpICsgdHlwZS5zbGljZSgxKTtcbiAgICBjb25zdCBlZGl0QnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjb25maXJtXCIsIHR5cGU6IFwic3VibWl0XCIsIGlkOiBcImVkaXRcIiB9LCBgU2F2ZSAke2NhcGl0YWxpemVkVHlwZX1gKTtcbiAgICBjb25zdCBjYW5jZWxCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNhbmNlbFwiLCB0eXBlOiBcInJlc2V0XCIgfSwgXCJDYW5jZWxcIik7XG4gICAgY29uc3QgYnV0dG9uV3JhcHBlckRpdiA9IGRpdih7fSwgZWRpdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJlZGl0XCIgfSwgLi4uZmllbGRzLCBidXR0b25XcmFwcGVyRGl2KVxufVxuXG5cblxuIiwiaW1wb3J0IHsgdHIsIHRkLCBidXR0b24gfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zIH0gZnJvbSBcIi4uL3ZlaGljbGVcIjtcbmltcG9ydCB7IENhciB9IGZyb20gXCIuLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDYXJSb3coY2FyOiBDYXIpIHtcbiAgICBjb25zdCByb3cgPSB0cih7fSxcbiAgICAgICAgdGQoe30sIGNhci5pZCksXG4gICAgICAgIHRkKHt9LCBjYXIubWFrZSksXG4gICAgICAgIHRkKHt9LCBjYXIubW9kZWwpLFxuICAgICAgICB0ZCh7fSwgQm9keVR5cGVzW2Nhci5ib2R5VHlwZV0pLFxuICAgICAgICB0ZCh7fSwgY2FyLm51bWJlck9mU2VhdHMudG9TdHJpbmcoKSksXG4gICAgICAgIHRkKHt9LCBUcmFuc21pc3Npb25zW2Nhci50cmFuc21pc3Npb25dKSxcbiAgICAgICAgdGQoe30sIGAkJHtjYXIucmVudGFsUHJpY2UudG9TdHJpbmcoKX0vZGF5YCksXG4gICAgICAgIHRkKHt9LCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGVkaXRcIiB9LCAnRWRpdCcpLCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGRlbGV0ZVwiIH0sICdEZWxldGUnKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHJvdztcbn0iLCJpbXBvcnQgeyB0ciwgdGQsIGJ1dHRvbiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBDYXJnb1R5cGVzLCBUcnVjayB9IGZyb20gXCIuLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcnVja1Jvdyh0cnVjazogVHJ1Y2spIHtcbiAgICBjb25zb2xlLmxvZyh0cnVjay5jYXJnb1R5cGUpO1xuICAgIGNvbnNvbGUubG9nKENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSk7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCB0cnVjay5pZCksXG4gICAgICAgIHRkKHt9LCB0cnVjay5tYWtlKSxcbiAgICAgICAgdGQoe30sIHRydWNrLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSksXG4gICAgICAgIHRkKHt9LCB0cnVjay5jYXBhY2l0eS50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGAkJHt0cnVjay5yZW50YWxQcmljZS50b1N0cmluZygpfS9kYXlgKSxcbiAgICAgICAgdGQoe30sIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZWRpdFwiIH0sICdFZGl0JyksIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZGVsZXRlXCIgfSwgJ0RlbGV0ZScpKVxuICAgICk7XG4gICAgcmV0dXJuIHJvdztcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL1N0b3JhZ2VcIjtcbmltcG9ydCB7IElWZWhpY2xlIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZG9tL0VkaXRvclwiO1xuaW1wb3J0IHsgQ3JlYXRlVHJ1Y2sgfSBmcm9tIFwiLi92aWV3cy9DcmVhdGVUcnVja1wiO1xuaW1wb3J0IHsgRWRpdFRydWNrIH0gZnJvbSBcIi4vdmlld3MvRWRpdFRydWNrXCJcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyBtYXBTZWxlY3RzVG9WYWx1ZXMsIHNldEZvcm1WYWx1ZXMsIGdldFRhYmxlUmVjb3JkLCBnZXRMb2NhdGlvbiwgZ2V0Q2xhc3MsIGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQgeyBjcmVhdGVUcnVja1JvdyB9IGZyb20gXCIuL3ZpZXdzL2NyZWF0ZVRydWNrUm93XCI7XG5pbXBvcnQgeyBjcmVhdGVDYXJSb3cgfSBmcm9tIFwiLi92aWV3cy9jcmVhdGVDYXJSb3dcIjtcblxuZXhwb3J0IGNvbnN0IHRhYmxlS2V5cyA9IHtcbiAgICBcInRydWNrXCI6IFtcIm1ha2VcIiwgXCJtb2RlbFwiLCBcImNhcmdvVHlwZVwiLCBcImNhcGFjaXR5XCIsIFwicmVudGFsUHJpY2VcIl0sXG4gICAgXCJjYXJcIjogW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwiYm9keVR5cGVcIiwgXCJudW1iZXJPZlNlYXRzXCIsIFwidHJhbnNtaXNzaW9uXCIsIFwicmVudGFsUHJpY2VcIl1cbn07XG5cbmxldCBlZGl0SWQgPSBudWxsO1xuY29uc3QgbHMgPSBuZXcgTG9jYWxTdG9yYWdlKCk7XG5sZXQgaXNFZGl0aW5nID0gZmFsc2U7XG5jb25zdCB2ZWhpY2xlVHlwZSA9IGdldExvY2F0aW9uKCkuc2xpY2UoMCwgLTEpO1xuY29uc3QgYWN0aW9uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFjdGlvbiBuZXdcIilbMF0gYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5pbml0aWFsaXplKCk7XG5cbmFjdGlvbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgaXNFZGl0aW5nID0gZmFsc2U7XG4gICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAoZS50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgdG9nZ2xlRm9ybXMoZWRpdEZvcm0sIGNyZWF0ZUZvcm0pO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGUpO1xufSk7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3QgQ2xhc3MgPSBnZXRDbGFzcyh2ZWhpY2xlVHlwZSwgeyBpZDogXCJhXCIsIG1vZGVsOiBcImJcIiwgbWFrZTogXCJjXCIgfSk7XG4gICAgY29uc3QgdmVoaWNsZUtleXMgPSBPYmplY3Qua2V5cyhDbGFzcykuZmlsdGVyKGtleSA9PiBrZXkgIT09IFwiaWRcIiAmJiBrZXkgIT0gXCJyZW50ZWRUb1wiKTtcbiAgICBjb25zdCBlMSA9IGNvbmZpZ0VkaXRvcih2ZWhpY2xlS2V5cywgQ3JlYXRlVHJ1Y2ssIG9uU3VibWl0LCBcImNyZWF0ZVwiKTtcbiAgICBjb25zdCBlMiA9IGNvbmZpZ0VkaXRvcih2ZWhpY2xlS2V5cywgRWRpdFRydWNrLCBvbkVkaXQsIFwiZWRpdFwiKTtcbiAgICBbLi4uKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lZGl0b3IgZm9ybScpIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+KV0uZm9yRWFjaChlbCA9PiBlbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpO1xufVxuXG5mdW5jdGlvbiBjb25maWdFZGl0b3Ioa2V5cywgdmlldywgaGFuZGxlciwgaWQpIHtcbiAgICBjb25zdCBpbmRleCA9IGlkID09IFwiZWRpdFwiID8gMiA6IDE7XG4gICAgY29uc3QgeyBuZXdFZGl0b3I6IHVwZGF0ZUVkaXRvciwgaHRtbDogaHRtbDIgfSA9IGdldEVkaXRvcihrZXlzLCB2aWV3LCBpbmRleClcbiAgICB1cGRhdGVFZGl0b3IuYXBwZW5kQ2hpbGQoaHRtbDIpO1xuICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICBlZGl0Rm9ybS5zdHlsZS5iYWNrZ3JvdW5kID0gXCIjXCIgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBuZXcgRWRpdG9yKGVkaXRGb3JtLCBoYW5kbGVyLCBrZXlzLCBhY3Rpb25CdXR0b24pO1xufVxuXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWJsZScpWzBdO1xuY29uc3QgY3JlYXRlUm93ID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSkgPT09ICdjYXInID8gY3JlYXRlQ2FyUm93IDogY3JlYXRlVHJ1Y2tSb3c7Ly8vLy8vL2hlcmUgbGFzdCBlZGl0XG5jb25zdCB0YWJsZU1hbmFnZXIgPSBuZXcgVGFibGUodGFibGUsIGNyZWF0ZVJvdywgaWRlbnRpZnkpOy8vXG5oaWRyYXRlKHRhYmxlTWFuYWdlcik7XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSkge1xuICAgIGNvbnN0IGN1cnJlbnRUeXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICBjb25zdCB2ZWhpY2xlcyA9IGF3YWl0IGxzLmdldEFsbChjdXJyZW50VHlwZSk7XG4gICAgdmVoaWNsZXMuZm9yRWFjaCh2ZWhpY2xlID0+IHRhYmxlTWFuYWdlci5hZGQodmVoaWNsZSkpO1xufVxuXG5mdW5jdGlvbiBnZXRFZGl0b3Ioa2V5czogc3RyaW5nW10sIHZpZXcsIGluZGV4KSB7XG4gICAgY29uc3QgaHRtbCA9IHZpZXcoa2V5cyk7XG4gICAgY29uc3QgbmV3RWRpdG9yID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5lZGl0b3InKVtpbmRleF0gYXMgSFRNTEVsZW1lbnQpO1xuICAgIG5ld0VkaXRvci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIHJldHVybiB7IG5ld0VkaXRvciwgaHRtbCB9O1xufVxuXG5mdW5jdGlvbiB0b2dnbGVGb3JtcyhlZGl0Rm9ybTogSFRNTEZvcm1FbGVtZW50LCBjcmVhdGVGb3JtOiBIVE1MRm9ybUVsZW1lbnQpIHtcbiAgICBpZiAoaXNFZGl0aW5nKSB7XG4gICAgICAgIGVkaXRGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIGNyZWF0ZUZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGVkaXRGb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gbGlzdGVuRm9yVGFibGVjbGljayhlOiBNb3VzZUV2ZW50KSB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZS50YXJnZXQ7XG4gICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IGJ0blRleHQgPSB0YXJnZXQudGV4dENvbnRlbnQ7XG4gICAgICAgIGlmIChidG5UZXh0ID09IFwiRWRpdFwiIHx8IGJ0blRleHQgPT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgIGVkaXRJZCA9IGFjdGl2YXRlZFJvdy5jaGlsZHJlblswXS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGlmIChidG5UZXh0ID09IFwiRWRpdFwiKSB7XG4gICAgICAgICAgICAgICAgZWRpdFJvdyhhY3RpdmF0ZWRSb3cpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChidG5UZXh0ID09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50Q29sbGVjdGlvbiA9IGdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgbHMuZGVsZXRlKGN1cnJlbnRDb2xsZWN0aW9uLCBlZGl0SWQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGVkaXRSb3coYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50KSB7XG4gICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICBjb25zdCBrZXlzID0gdGFibGVLZXlzW3ZlaGljbGVUeXBlXTtcbiAgICBjb25zdCByZWNvcmQgPSBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3csIGtleXMpO1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHNldEZvcm1WYWx1ZXMoa2V5cywgZWRpdEZvcm0sIHJlY29yZCk7XG4gICAgdG9nZ2xlRm9ybXMoZWRpdEZvcm0sIGNyZWF0ZUZvcm0pO1xufVxuXG5mdW5jdGlvbiBpZGVudGlmeShjYXJzOiBJVmVoaWNsZVtdLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNhcnMuZmluZChlID0+IGUuaWQgPT0gaWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBvblN1Ym1pdChkYXRhKSB7XG4gICAgZGF0YS5pZCA9IGdlbmVyYXRlSWQoKTtcbiAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCk7XG4gICAgbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGEpO1xuICAgIGNvbnN0IENsYXNzID0gZ2V0Q2xhc3ModHlwZS5zbGljZSgwLCAtMSksIGRhdGEpO1xuICAgIHRhYmxlTWFuYWdlci5hZGQoZGF0YSk7XG4gICAgdHJ5IHtcbiAgICAgICAgbHMuY3JlYXRlKHR5cGUsIENsYXNzKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkVkaXQoZGF0YSkge1xuICAgIGFsZXJ0KCdpbiBFZGl0Li4uJylcbiAgICBjb25zb2xlLmxvZygnZGF0YSBpbiBlZGl0OiAnLCBkYXRhKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IGdldExvY2F0aW9uKCk7XG4gICAgbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGEpO1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG5ld1JlY29yZCA9IHsgLi4uYXdhaXQgbHMuZ2V0QnlJZChjb2xsZWN0aW9uTmFtZSwgZWRpdElkKSwgLi4uZGF0YSB9O1xuICAgICAgICB0YWJsZU1hbmFnZXIucmVwbGFjZShlZGl0SWQsIG5ld1JlY29yZCk7XG4gICAgICAgIGF3YWl0IGxzLnVwZGF0ZShjb2xsZWN0aW9uTmFtZSwgZWRpdElkLCBkYXRhKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcilcbiAgICB9XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9