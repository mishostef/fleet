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
    console.log(Object.keys(truck));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxNQUFNLENBQUMsSUFBSTtJQUN0QixLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxjQUFjLEdBQUcsbURBQVcsRUFBRSxDQUFDO0lBQ3JDLDBEQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLElBQUk7UUFDQSxNQUFNLFNBQVMsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQzNFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vRWRpdG9yLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvQ3JlYXRlVHJ1Y2sudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdFRydWNrLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZpZXdzL2NyZWF0ZUNhclJvdy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92aWV3cy9jcmVhdGVUcnVja1Jvdy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3RydWNrcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgZ2V0TnVtYmVyRnJvbVN0cmluZyB9IGZyb20gXCIuLi91dGlsc1wiXG5leHBvcnQgY2xhc3MgRWRpdG9yIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZvcm06IEhUTUxGb3JtRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFjazogKGRhdGE6IG9iamVjdCkgPT4gYW55LFxuICAgICAgICBwcml2YXRlIHByb3BOYW1lczogc3RyaW5nW10sIG9yaWdpbmF0b3I/OiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAob3JpZ2luYXRvcikgb3JpZ2luYXRvci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIG9uU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzLmZvcm0pO1xuICAgICAgICBjb25zdCByZW50YWxQcmljZSA9IGZvcm1EYXRhLmdldChcInJlbnRhbFByaWNlXCIpLnRvU3RyaW5nKCk7XG4gICAgICAgIGZvcm1EYXRhLnNldChcInJlbnRhbFByaWNlXCIsIHJlbnRhbFByaWNlKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IE9iamVjdC5mcm9tRW50cmllcyh0aGlzLnByb3BOYW1lcy5tYXAobiA9PiBbbiwgZm9ybURhdGEuZ2V0KG4pXSkpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICAvL3B1YmxpYyBhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogSFRNTFRhYmxlRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVSb3c6IChyZWNvcmQ6IGFueSkgPT4gSFRNTFRhYmxlUm93RWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmeT86IChyZWNvcmRzOiBhbnlbXSwgaWQ6IGFueSkgPT4gYW55LFxuICAgICAgICByZWNvcmRzPzogYW55W11cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICBpZiAocmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZHMuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGFjdGl2YXRlZFJvdy5yb3dJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJvdyA9IHRoaXMucmVjb3Jkc1tyb3dJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gZGVsZXRlUm93W1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlICR7aWR9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQocmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVSb3cocmVjb3JkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCByb3cpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB9XG4gICAgZ2V0KGlkOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpZnkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pZGVudGlmeSh0aGlzLnJlY29yZHMsIGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbmRldGl0eSBmdW5jdGlvbiBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgZ2V0Um93KGlkOiBhbnkpOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzLmdldChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJlcGxhY2UoaWQ6IGFueSwgbmV3UmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICAvL2NvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBbLi4udGhpcy5yb3dzLmtleXMoKV0uZmluZEluZGV4KHggPT4geFsnaWQnXSA9PT0gaWQpO1xuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBmID0gdGhpcy5jcmVhdGVSb3cuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgbmV3Um93ID0gZihuZXdSZWNvcmQpO1xuICAgICAgICAvLyByb3cucmVwbGFjZVdpdGgobmV3Um93KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChuZXdSb3csIHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzLml0ZW0oaW5kZXggKyAxKSk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxLCBuZXdSZWNvcmQpO1xuICAgIH1cblxuICAgIHJlbW92ZShpZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvdyhpZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnJvd3MuZGVsZXRlKHJlY29yZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbn0iLCJ0eXBlIERvbUNvbnRlbnQgPSBzdHJpbmcgfCBOb2RlO1xuXG50eXBlIGVsZW1lbnRGYWN0b3J5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSAocHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkgPT4gVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbSh0eXBlOiBzdHJpbmcsIHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lID0gcHJvcE5hbWUuc2xpY2UoNCwgNSkudG9Mb3dlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDUpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldFtkYXRhTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgY29uc3QgdGFibGU6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RhYmxlJyk7XG5leHBvcnQgY29uc3QgdGhlYWQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IHRib2R5OiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGJvZHknKTtcbmV4cG9ydCBjb25zdCB0cjogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlUm93RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndHInKTtcbmV4cG9ydCBjb25zdCB0aDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoJyk7XG5leHBvcnQgY29uc3QgdGQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0ZCcpO1xuZXhwb3J0IGNvbnN0IGJ1dHRvbjogZWxlbWVudEZhY3Rvcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IHNwYW46IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3BhbicpOy8vL1xuZXhwb3J0IGNvbnN0IGxhYmVsOiBlbGVtZW50RmFjdG9yeTxIVE1MTGFiZWxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IGlucHV0OiBlbGVtZW50RmFjdG9yeTxIVE1MSW5wdXRFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdDogZWxlbWVudEZhY3Rvcnk8SFRNTFNlbGVjdEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IG9wdGlvbjogZWxlbWVudEZhY3Rvcnk8SFRNTE9wdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IGZvcm06IGVsZW1lbnRGYWN0b3J5PEhUTUxGb3JtRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZm9ybScpO1xuZXhwb3J0IGNvbnN0IGRpdjogZWxlbWVudEZhY3Rvcnk8SFRNTERpdkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2RpdicpO1xuZXhwb3J0IGNvbnN0IGE6IGVsZW1lbnRGYWN0b3J5PEhUTUxBbmNob3JFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdhJyk7XG5leHBvcnQgY29uc3QgcDogZWxlbWVudEZhY3Rvcnk8SFRNTFBhcmFncmFwaEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3AnKTtcbmV4cG9ydCBjb25zdCBoMzogZWxlbWVudEZhY3Rvcnk8SFRNTEhlYWRpbmdFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdoMycpO1xuZXhwb3J0IGNvbnN0IHN0cm9uZzogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzdHJvbmcnKTsiLCJpbXBvcnQgeyBDYXJnb1R5cGVzLCBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMsIENhciwgVHJ1Y2sgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoJy8nLCAnJykuc3BsaXQoJy4nKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudW0oKTogYW55IHtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7Ly90cnVja1xuICAgIGNvbnN0IGt2cCA9IHtcbiAgICAgICAgXCJ0cnVja1wiOiBbeyBjYXJnb1R5cGU6IENhcmdvVHlwZXMgfV0sXG4gICAgICAgIFwiY2FyXCI6IFt7IGJvZHlUeXBlOiBCb2R5VHlwZXMgfSwgeyB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnMgfV1cbiAgICB9XG4gICAgcmV0dXJuIGt2cFt0eXBlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKHR5cGU6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBpZCwgbWFrZSwgbW9kZWwsIC4uLnJlc3QgfSA9IGRhdGE7XG4gICAgcmV0dXJuIHR5cGUgPT09IFwiY2FyXCIgPyBuZXcgQ2FyKGlkLCBtYWtlLCBtb2RlbCwgcmVzdCkgOiBuZXcgVHJ1Y2soaWQsIG1ha2UsIG1vZGVsLCByZXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFNlbGVjdHNUb1ZhbHVlcyhkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBlbnVtcy5mb3JFYWNoKGVuID0+IHtcbiAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgY29uc3QgZW51bVZhbHNTdHJpbmcgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgY29uc3QgZW51bVZhbHNOdW1iZXIgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiAhaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RWYWx1ZSA9IGRhdGFbZW51bUtleV07XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZW51bVZhbHNTdHJpbmcuaW5kZXhPZihjdXJyZW50U2VsZWN0VmFsdWUpO1xuICAgICAgICBkYXRhW2VudW1LZXldID0gZW51bVZhbHNOdW1iZXJbaW5kZXhdO1xuXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRGb3JtVmFsdWVzKGtleXM6IHN0cmluZ1tdLCBlZGl0Rm9ybTogSFRNTEZvcm1FbGVtZW50LCByZWNvcmQ6IHt9KSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnVtVmFsc1N0cmluZyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzTnVtYmVyID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gIWlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RWYWx1ZSA9IHJlY29yZFtlbnVtS2V5XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGVudW1WYWxzU3RyaW5nLmluZGV4T2YoY3VycmVudFNlbGVjdFZhbHVlKTtcblxuICAgICAgICAgICAgICAgIChlZGl0Rm9ybVtrZXldIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5zZWxlY3RlZEluZGV4ID0gTnVtYmVyKGVudW1WYWxzTnVtYmVyW2luZGV4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlZGl0Rm9ybVtrZXldLnZhbHVlID0gcmVjb3JkW2tleV07XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQsIGtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIFsuLi5hY3RpdmF0ZWRSb3cuY2hpbGRyZW5dLnNsaWNlKDEpLnJlZHVjZSgoYSwgYiwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIGlmIChrZXkgPT09IFwicmVudGFsUHJpY2VcIikge1xuICAgICAgICAgICAgY29uc3QgciA9IC8tP1xcZCsvO1xuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBiLnRleHRDb250ZW50Lm1hdGNoKHIpO1xuICAgICAgICAgICAgYVtrZXldID0gTnVtYmVyKHByaWNlWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFba2V5XSA9IGIudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtYmVyRnJvbVN0cmluZyhzdHI6IHN0cmluZykgOm51bWJlcntcbiAgICBjb25zdCByID0gLy0/XFxkKy87XG4gICAgY29uc3QgbnVtYmVycyA9IHN0ci5tYXRjaChyKTtcbiAgICByZXR1cm4gTnVtYmVyKG51bWJlcnNbMF0pO1xufSIsImV4cG9ydCBpbnRlcmZhY2UgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYWtlOiBzdHJpbmc7XG4gICAgbW9kZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZlaGljbGUgaW1wbGVtZW50cyBJVmVoaWNsZSB7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZW50ZWRUbyA9IG51bGw7XG4gICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSAtMTtcbiAgICB9XG59XG5leHBvcnQgZW51bSBCb2R5VHlwZXMge1xuICAgIFwic2VkYW5cIiwgXCJzdXZcIiwgXCJoYXRjaGJhY2tcIlxufVxuZXhwb3J0IGVudW0gVHJhbnNtaXNzaW9ucyB7XG4gICAgXCJtYW51YWxcIiwgXCJhdXRvbWF0aWNcIlxufVxuZXhwb3J0IGVudW0gQ2FyZ29UeXBlcyB7XG4gICAgXCJib3hcIiwgXCJmbGF0YmVkXCIsIFwidmFuXCJcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ2FyUGFyYW1zIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNhciBleHRlbmRzIElWZWhpY2xlLCBDYXJQYXJhbXMge1xuXG59XG5leHBvcnQgaW50ZXJmYWNlIElUcnVjayBleHRlbmRzIElWZWhpY2xlLCBUcnVja1BhcmFtcyB7IH1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja1BhcmFtcyB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENhciBleHRlbmRzIFZlaGljbGUge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgY2FyUGFyYW1zPzogQ2FyUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIGlmIChjYXJQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBjYXJQYXJhbXMuYm9keVR5cGU7XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLm51bWJlck9mU2VhdHMgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJTZWF0cyBjYW5ub3QgYmUgbmVnYXRpdmVcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IGNhclBhcmFtcy5udW1iZXJPZlNlYXRzO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBjYXJQYXJhbXMudHJhbnNtaXNzaW9uO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50ZWRUbykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGVkVG8gPSBjYXJQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLnJlbnRhbFByaWNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IGNhclBhcmFtcy5yZW50YWxQcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBCb2R5VHlwZXMuc2VkYW47XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSA0O1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBUcmFuc21pc3Npb25zLmF1dG9tYXRpYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCB0cnVja1BhcmFtcz86IFRydWNrUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIHRoaXMuY2FyZ29UeXBlID0gQ2FyZ29UeXBlcy5ib3g7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSAyO1xuICAgICAgICBpZiAodHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJDYXBhY2l0eSBjYW5ub3QgYmUgbmVnYXRpdmVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2FwYWNpdHkgPSB0cnVja1BhcmFtcy5jYXBhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXJnb1R5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IHRydWNrUGFyYW1zLmNhcmdvVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5yZW50ZWRUbykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGVkVG8gPSB0cnVja1BhcmFtcy5yZW50ZWRUbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSB0cnVja1BhcmFtcy5yZW50YWxQcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBzcGFuLCBpbnB1dCwgbGFiZWwsIHNlbGVjdCwgb3B0aW9uLCBidXR0b24sIGZvcm0sIGRpdiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBnZXRMb2NhdGlvbiwgZ2V0RW51bSB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBDcmVhdGVUcnVjayhrZXlzKSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBrZXlzLm1hcChrZXkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZW4gPSBlbnVtc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgICAgICBjb25zdCBlbnVtVmFscyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gZW51bUtleSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGVudW1WYWxzO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IGtleSB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5wdXQgPSBpbnB1dCh7IHR5cGU6IFwidGV4dFwiLCBuYW1lOiBrZXkgfSk7XG4gICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRJbnB1dCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCkuc2xpY2UoMCwgLTEpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkVHlwZSA9IHR5cGVbMF0udG9Mb2NhbGVVcHBlckNhc2UoKSArIHR5cGUuc2xpY2UoMSk7XG4gICAgY29uc3Qgc3VibWl0QnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjb25maXJtXCIsIHR5cGU6IFwic3VibWl0XCIsIGlkOiBcImNyZWF0ZVwiIH0sIGBBZGQgJHtjYXBpdGFsaXplZFR5cGV9YCk7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIHN1Ym1pdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJjcmVhdGVcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59IiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgZ2V0RW51bSB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb24gfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEVkaXRUcnVjayhrZXlzKSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG5cbiAgICBjb25zdCBmaWVsZHMgPSBrZXlzLm1hcChrZXkgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZW4gPSBlbnVtc1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgICAgICBjb25zdCBlbnVtVmFscyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gZW51bUtleSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IGVudW1WYWxzO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IGtleSB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5wdXQgPSBpbnB1dCh7IHR5cGU6IFwidGV4dFwiLCBuYW1lOiBrZXkgfSk7XG4gICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRJbnB1dCk7XG4gICAgfSk7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCkuc2xpY2UoMCwgLTEpO1xuICAgIGNvbnN0IGNhcGl0YWxpemVkVHlwZSA9IHR5cGVbMF0udG9Mb2NhbGVVcHBlckNhc2UoKSArIHR5cGUuc2xpY2UoMSk7XG4gICAgY29uc3QgZWRpdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJlZGl0XCIgfSwgYFNhdmUgJHtjYXBpdGFsaXplZFR5cGV9YCk7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIGVkaXRCdG4sIGNhbmNlbEJ0bik7XG4gICAgcmV0dXJuIGZvcm0oeyBjbGFzc05hbWU6IFwiYWxpZ25cIiwgaWQ6IFwiZWRpdFwiIH0sIC4uLmZpZWxkcywgYnV0dG9uV3JhcHBlckRpdilcbn1cblxuXG5cbiIsImltcG9ydCB7IHRyLCB0ZCwgYnV0dG9uIH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IEJvZHlUeXBlcywgVHJhbnNtaXNzaW9ucyB9IGZyb20gXCIuLi92ZWhpY2xlXCI7XG5pbXBvcnQgeyBDYXIgfSBmcm9tIFwiLi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FyUm93KGNhcjogQ2FyKSB7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCBjYXIuaWQpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIEJvZHlUeXBlc1tjYXIuYm9keVR5cGVdKSxcbiAgICAgICAgdGQoe30sIGNhci5udW1iZXJPZlNlYXRzLnRvU3RyaW5nKCkpLFxuICAgICAgICB0ZCh7fSwgVHJhbnNtaXNzaW9uc1tjYXIudHJhbnNtaXNzaW9uXSksXG4gICAgICAgIHRkKHt9LCBgJCR7Y2FyLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBlZGl0XCIgfSwgJ0VkaXQnKSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBkZWxldGVcIiB9LCAnRGVsZXRlJykpXG4gICAgKTtcblxuICAgIHJldHVybiByb3c7XG59IiwiaW1wb3J0IHsgdHIsIHRkLCBidXR0b24gfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgQ2FyZ29UeXBlcywgVHJ1Y2sgfSBmcm9tIFwiLi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJ1Y2tSb3codHJ1Y2s6IFRydWNrKSB7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmtleXModHJ1Y2spKTtcbiAgICBjb25zdCByb3cgPSB0cih7fSxcbiAgICAgICAgdGQoe30sIHRydWNrLmlkKSxcbiAgICAgICAgdGQoe30sIHRydWNrLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgdHJ1Y2subW9kZWwpLFxuICAgICAgICB0ZCh7fSwgQ2FyZ29UeXBlc1t0cnVjay5jYXJnb1R5cGVdKSxcbiAgICAgICAgdGQoe30sIHRydWNrLmNhcGFjaXR5LnRvU3RyaW5nKCkpLFxuICAgICAgICB0ZCh7fSwgYCQke3RydWNrLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBlZGl0XCIgfSwgJ0VkaXQnKSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBkZWxldGVcIiB9LCAnRGVsZXRlJykpXG4gICAgKTtcbiAgICByZXR1cm4gcm93O1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4vU3RvcmFnZVwiO1xuaW1wb3J0IHsgSVZlaGljbGUgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwiLi9kb20vRWRpdG9yXCI7XG5pbXBvcnQgeyBDcmVhdGVUcnVjayB9IGZyb20gXCIuL3ZpZXdzL0NyZWF0ZVRydWNrXCI7XG5pbXBvcnQgeyBFZGl0VHJ1Y2sgfSBmcm9tIFwiLi92aWV3cy9FZGl0VHJ1Y2tcIlxuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiLi9kb20vVGFibGVcIjtcbmltcG9ydCB7IG1hcFNlbGVjdHNUb1ZhbHVlcywgc2V0Rm9ybVZhbHVlcywgZ2V0VGFibGVSZWNvcmQsIGdldExvY2F0aW9uLCBnZXRDbGFzcywgZ2VuZXJhdGVJZCB9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7IGNyZWF0ZVRydWNrUm93IH0gZnJvbSBcIi4vdmlld3MvY3JlYXRlVHJ1Y2tSb3dcIjtcbmltcG9ydCB7IGNyZWF0ZUNhclJvdyB9IGZyb20gXCIuL3ZpZXdzL2NyZWF0ZUNhclJvd1wiO1xuXG5leHBvcnQgY29uc3QgdGFibGVLZXlzID0ge1xuICAgIFwidHJ1Y2tcIjogW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwiY2FyZ29UeXBlXCIsIFwiY2FwYWNpdHlcIiwgXCJyZW50YWxQcmljZVwiXSxcbiAgICBcImNhclwiOiBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJib2R5VHlwZVwiLCBcIm51bWJlck9mU2VhdHNcIiwgXCJ0cmFuc21pc3Npb25cIiwgXCJyZW50YWxQcmljZVwiXVxufTtcblxubGV0IGVkaXRJZCA9IG51bGw7XG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcbmxldCBpc0VkaXRpbmcgPSBmYWxzZTtcbmNvbnN0IHZlaGljbGVUeXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7XG5jb25zdCBhY3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aW9uIG5ld1wiKVswXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbmluaXRpYWxpemUoKTtcblxuYWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpc0VkaXRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIChlLnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGxpc3RlbkZvclRhYmxlY2xpY2soZSk7XG59KTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBDbGFzcyA9IGdldENsYXNzKHZlaGljbGVUeXBlLCB7IGlkOiBcImFcIiwgbW9kZWw6IFwiYlwiLCBtYWtlOiBcImNcIiB9KTtcbiAgICBjb25zdCB2ZWhpY2xlS2V5cyA9IE9iamVjdC5rZXlzKENsYXNzKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJpZFwiICYmIGtleSAhPSBcInJlbnRlZFRvXCIpO1xuICAgIGNvbnN0IGUxID0gY29uZmlnRWRpdG9yKHZlaGljbGVLZXlzLCBDcmVhdGVUcnVjaywgb25TdWJtaXQsIFwiY3JlYXRlXCIpO1xuICAgIGNvbnN0IGUyID0gY29uZmlnRWRpdG9yKHZlaGljbGVLZXlzLCBFZGl0VHJ1Y2ssIG9uRWRpdCwgXCJlZGl0XCIpO1xuICAgIFsuLi4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvciBmb3JtJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pXS5mb3JFYWNoKGVsID0+IGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XG59XG5cbmZ1bmN0aW9uIGNvbmZpZ0VkaXRvcihrZXlzLCB2aWV3LCBoYW5kbGVyLCBpZCkge1xuICAgIGNvbnN0IGluZGV4ID0gaWQgPT0gXCJlZGl0XCIgPyAyIDogMTtcbiAgICBjb25zdCB7IG5ld0VkaXRvcjogdXBkYXRlRWRpdG9yLCBodG1sOiBodG1sMiB9ID0gZ2V0RWRpdG9yKGtleXMsIHZpZXcsIGluZGV4KVxuICAgIHVwZGF0ZUVkaXRvci5hcHBlbmRDaGlsZChodG1sMik7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIGVkaXRGb3JtLnN0eWxlLmJhY2tncm91bmQgPSBcIiNcIiArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIG5ldyBFZGl0b3IoZWRpdEZvcm0sIGhhbmRsZXIsIGtleXMsIGFjdGlvbkJ1dHRvbik7XG59XG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG5jb25zdCBjcmVhdGVSb3cgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKSA9PT0gJ2NhcicgPyBjcmVhdGVDYXJSb3cgOiBjcmVhdGVUcnVja1JvdzsvLy8vLy8vaGVyZSBsYXN0IGVkaXRcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlUm93LCBpZGVudGlmeSk7Ly9cbmhpZHJhdGUodGFibGVNYW5hZ2VyKTtcblxuYXN5bmMgZnVuY3Rpb24gaGlkcmF0ZSh0YWJsZU1hbmFnZXI6IFRhYmxlKSB7XG4gICAgY29uc3QgY3VycmVudFR5cGUgPSBnZXRMb2NhdGlvbigpO1xuICAgIGNvbnN0IHZlaGljbGVzID0gYXdhaXQgbHMuZ2V0QWxsKGN1cnJlbnRUeXBlKTtcbiAgICB2ZWhpY2xlcy5mb3JFYWNoKHZlaGljbGUgPT4gdGFibGVNYW5hZ2VyLmFkZCh2ZWhpY2xlKSk7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRvcihrZXlzOiBzdHJpbmdbXSwgdmlldywgaW5kZXgpIHtcbiAgICBjb25zdCBodG1sID0gdmlldyhrZXlzKTtcbiAgICBjb25zdCBuZXdFZGl0b3IgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvcicpW2luZGV4XSBhcyBIVE1MRWxlbWVudCk7XG4gICAgbmV3RWRpdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgcmV0dXJuIHsgbmV3RWRpdG9yLCBodG1sIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUZvcm1zKGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIGNyZWF0ZUZvcm06IEhUTUxGb3JtRWxlbWVudCkge1xuICAgIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYnRuVGV4dCA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIgfHwgYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgZWRpdElkID0gYWN0aXZhdGVkUm93LmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xuICAgICAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIpIHtcbiAgICAgICAgICAgICAgICBlZGl0Um93KGFjdGl2YXRlZFJvdyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJ0blRleHQgPT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRDb2xsZWN0aW9uID0gZ2V0TG9jYXRpb24oKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBscy5kZWxldGUoY3VycmVudENvbGxlY3Rpb24sIGVkaXRJZCk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZWRpdFJvdyhhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQpIHtcbiAgICBpc0VkaXRpbmcgPSB0cnVlO1xuICAgIGNvbnN0IGtleXMgPSB0YWJsZUtleXNbdmVoaWNsZVR5cGVdO1xuICAgIGNvbnN0IHJlY29yZCA9IGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdywga2V5cyk7XG4gICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgc2V0Rm9ybVZhbHVlcyhrZXlzLCBlZGl0Rm9ybSwgcmVjb3JkKTtcbiAgICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG59XG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uU3VibWl0KGRhdGEpIHtcbiAgICBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YSk7XG4gICAgY29uc3QgQ2xhc3MgPSBnZXRDbGFzcyh0eXBlLnNsaWNlKDAsIC0xKSwgZGF0YSk7XG4gICAgdGFibGVNYW5hZ2VyLmFkZChkYXRhKTtcbiAgICB0cnkge1xuICAgICAgICBscy5jcmVhdGUodHlwZSwgQ2xhc3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uRWRpdChkYXRhKSB7XG4gICAgYWxlcnQoJ2luIEVkaXQuLi4nKVxuICAgIGNvbnNvbGUubG9nKCdkYXRhIGluIGVkaXQ6ICcsIGRhdGEpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gZ2V0TG9jYXRpb24oKTtcbiAgICBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbmV3UmVjb3JkID0geyAuLi5hd2FpdCBscy5nZXRCeUlkKGNvbGxlY3Rpb25OYW1lLCBlZGl0SWQpLCAuLi5kYXRhIH07XG4gICAgICAgIHRhYmxlTWFuYWdlci5yZXBsYWNlKGVkaXRJZCwgbmV3UmVjb3JkKTtcbiAgICAgICAgYXdhaXQgbHMudXBkYXRlKGNvbGxlY3Rpb25OYW1lLCBlZGl0SWQsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=