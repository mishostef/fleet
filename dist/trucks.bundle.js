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
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_4__.Table(table, _views_createTruckRow__WEBPACK_IMPORTED_MODULE_6__.createTruckRow, identify);
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
                isEditing = true;
                //to be called conditionally depending on location
                const keys = tableKeys[vehicleType];
                const record = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getTableRecord)(activatedRow, keys);
                const createForm = document.getElementById("create");
                const editForm = document.getElementById("edit");
                (0,_utils__WEBPACK_IMPORTED_MODULE_5__.setFormValues)(keys, editForm, record);
                toggleForms(editForm, createForm);
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
function identify(cars, id) {
    return cars.find(e => e.id == id);
}
async function onSubmit(data) {
    data.id = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.generateId)();
    alert(JSON.stringify(data));
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getLocation)();
    (0,_utils__WEBPACK_IMPORTED_MODULE_5__.mapSelectsToValues)(data);
    const Class = (0,_utils__WEBPACK_IMPORTED_MODULE_5__.getClass)(type, data);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLENBQUM7QUFDdEUsTUFBTSxFQUFFLEdBQXlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RFLE1BQU0sTUFBTSxHQUFzQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRSxNQUFNLElBQUksR0FBb0MsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBRztBQUN4RSxNQUFNLEtBQUssR0FBcUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEUsTUFBTSxLQUFLLEdBQXFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sTUFBTSxHQUFzQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRSxNQUFNLE1BQU0sR0FBc0MsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDM0UsTUFBTSxJQUFJLEdBQW9DLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sR0FBRyxHQUFtQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNsRSxNQUFNLENBQUMsR0FBc0MsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDakUsTUFBTSxDQUFDLEdBQXlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3BFLE1BQU0sRUFBRSxHQUF1QyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNwRSxNQUFNLE1BQU0sR0FBb0MsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3Q0g7QUFFdEUsU0FBUyxVQUFVO0lBQ3RCLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRSxPQUFPLEdBQUcsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUU7QUFDaEMsQ0FBQztBQUVNLFNBQVMsV0FBVztJQUN2QixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFTSxTQUFTLE9BQU87SUFDbkIsTUFBTSxJQUFJLEdBQUcsV0FBVyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQU87SUFDL0MsTUFBTSxHQUFHLEdBQUc7UUFDUixPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxnREFBVSxFQUFFLENBQUM7UUFDcEMsS0FBSyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsK0NBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxFQUFFLG1EQUFhLEVBQUUsQ0FBQztLQUNwRTtJQUNELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFFTSxTQUFTLFFBQVEsQ0FBQyxJQUFZLEVBQUUsSUFBUztJQUM1QyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDMUMsT0FBTyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLHlDQUFHLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksMkNBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRU0sU0FBUyxrQkFBa0IsQ0FBQyxJQUFTO0lBQ3hDLE1BQU0sS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDO0lBQ3hCLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDZixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ25DLE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEYsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTFDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVNLFNBQVMsYUFBYSxDQUFDLElBQWMsRUFBRSxRQUF5QixFQUFFLE1BQVU7SUFDL0UsTUFBTSxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNmLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDZixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRixNQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUV4RCxRQUFRLENBQUMsR0FBRyxDQUF1QixDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDdEY7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUNILFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLFlBQWlDLEVBQUUsSUFBYztJQUM1RSxPQUFPLENBQUMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7UUFDOUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUksR0FBRyxLQUFLLGFBQWEsRUFBRTtZQUN2QixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDbEIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QjthQUFNO1lBQ0gsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUM7U0FDMUI7UUFDRCxPQUFPLENBQUMsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNYLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNURNLE1BQWUsT0FBTztJQUdOO0lBQW1CO0lBQXFCO0lBRjNELFdBQVcsQ0FBUztJQUNwQixRQUFRLENBQWdCO0lBQ3hCLFlBQW1CLEVBQVUsRUFBUyxJQUFZLEVBQVMsS0FBYTtRQUFyRCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDcEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0o7QUFDRCxJQUFZLFNBRVg7QUFGRCxXQUFZLFNBQVM7SUFDakIsMkNBQU87SUFBRSx1Q0FBSztJQUFFLG1EQUFXO0FBQy9CLENBQUMsRUFGVyxTQUFTLEtBQVQsU0FBUyxRQUVwQjtBQUNELElBQVksYUFFWDtBQUZELFdBQVksYUFBYTtJQUNyQixxREFBUTtJQUFFLDJEQUFXO0FBQ3pCLENBQUMsRUFGVyxhQUFhLEtBQWIsYUFBYSxRQUV4QjtBQUNELElBQVksVUFFWDtBQUZELFdBQVksVUFBVTtJQUNsQix5Q0FBSztJQUFFLGlEQUFTO0lBQUUseUNBQUs7QUFDM0IsQ0FBQyxFQUZXLFVBQVUsS0FBVixVQUFVLFFBRXJCO0FBb0JNLE1BQU0sR0FBSSxTQUFRLE9BQU87SUFLVDtJQUFtQjtJQUFxQjtJQUozRCxRQUFRLENBQVk7SUFDcEIsYUFBYSxDQUFTO0lBQ3RCLFlBQVksQ0FBZ0I7SUFFNUIsWUFBbUIsRUFBVSxFQUFTLElBQVksRUFBUyxLQUFhLEVBQUUsU0FBcUI7UUFDM0YsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFEUixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7UUFFcEUsSUFBSSxTQUFTLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7WUFDbkMsSUFBSSxTQUFTLENBQUMsYUFBYSxHQUFHLENBQUMsRUFBRTtnQkFDN0IsTUFBTSxJQUFJLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQzthQUNuRDtZQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUM3QyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQUM7WUFDM0MsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO2dCQUNwQixJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7YUFDdEM7WUFDRCxJQUFJLFNBQVMsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQzthQUM1QztTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDO1NBQy9DO0lBQ0wsQ0FBQztDQUNKO0FBRU0sTUFBTSxLQUFNLFNBQVEsT0FBTztJQUdYO0lBQW1CO0lBQXFCO0lBRjNELFNBQVMsQ0FBYTtJQUN0QixRQUFRLENBQVM7SUFDakIsWUFBbUIsRUFBVSxFQUFTLElBQVksRUFBUyxLQUFhLEVBQUUsV0FBeUI7UUFDL0YsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFEUixPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7UUFFcEUsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksV0FBVyxFQUFFO1lBQ2IsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO2dCQUN0QixJQUFJLFdBQVcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFO29CQUMxQixNQUFNLElBQUksVUFBVSxDQUFDLDZCQUE2QixDQUFDLENBQUM7aUJBQ3ZEO2dCQUNELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQzthQUN4QztZQUNELElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRTtnQkFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO2dCQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7YUFDeEM7WUFDRCxJQUFJLFdBQVcsQ0FBQyxXQUFXLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQzthQUM5QztTQUNKO0lBQ0wsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pHa0Y7QUFDbkM7QUFHekMsU0FBUyxXQUFXLENBQUMsSUFBSTtJQUM1QixNQUFNLEtBQUssR0FBRywrQ0FBTyxFQUFFLENBQUM7SUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsZ0RBQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsTUFBTSxXQUFXLEdBQUcsOENBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sYUFBYSxHQUFHLGdEQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDeEQsT0FBTywrQ0FBSyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDaEQ7U0FDSjtRQUVELE1BQU0sV0FBVyxHQUFHLDhDQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNwRixNQUFNLFlBQVksR0FBRywrQ0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4RCxPQUFPLCtDQUFLLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLG1EQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxNQUFNLFNBQVMsR0FBRyxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sZUFBZSxFQUFFLENBQUMsQ0FBQztJQUNsSCxNQUFNLFNBQVMsR0FBRyxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEYsTUFBTSxnQkFBZ0IsR0FBRyw2Q0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkQsT0FBTyw4Q0FBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUUsZ0JBQWdCLENBQUM7QUFDbEYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQmtGO0FBQ2hEO0FBQ0k7QUFFaEMsU0FBUyxTQUFTLENBQUMsSUFBSTtJQUMxQixNQUFNLEtBQUssR0FBRywrQ0FBTyxFQUFFLENBQUM7SUFFeEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFFLElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtnQkFDakIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUN4QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsZ0RBQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDNUUsTUFBTSxXQUFXLEdBQUcsOENBQUksQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sYUFBYSxHQUFHLGdEQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsQ0FBQztnQkFDeEQsT0FBTywrQ0FBSyxDQUFDLEVBQUUsRUFBRSxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7YUFDaEQ7U0FDSjtRQUVELE1BQU0sV0FBVyxHQUFHLDhDQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNwRixNQUFNLFlBQVksR0FBRywrQ0FBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4RCxPQUFPLCtDQUFLLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLG1EQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEMsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRSxNQUFNLE9BQU8sR0FBRyxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsZUFBZSxFQUFFLENBQUMsQ0FBQztJQUMvRyxNQUFNLFNBQVMsR0FBRyxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDbEYsTUFBTSxnQkFBZ0IsR0FBRyw2Q0FBRyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckQsT0FBTyw4Q0FBSSxDQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUUsZ0JBQWdCLENBQUM7QUFDaEYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvQjJDO0FBQ0c7QUFFeEMsU0FBUyxjQUFjLENBQUMsS0FBWTtJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGdEQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDekMsTUFBTSxHQUFHLEdBQUcsNENBQUUsQ0FBQyxFQUFFLEVBQ2IsNENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUNoQiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQ2xCLDRDQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZ0RBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFDbkMsNENBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUNqQyw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUM5Qyw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLGdEQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FDekcsQ0FBQztJQUNGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQzs7Ozs7OztVQ2hCRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTnlDO0FBRUg7QUFDWTtBQUNMO0FBQ1Q7QUFDMEU7QUFDdEQ7QUFFakQsTUFBTSxTQUFTLEdBQUc7SUFDckIsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQztJQUNsRSxLQUFLLEVBQUUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQztDQUN2RixDQUFDO0FBRUYsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLE1BQU0sRUFBRSxHQUFHLElBQUksa0RBQVksRUFBRSxDQUFDO0FBQzlCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixNQUFNLFdBQVcsR0FBRyxtREFBVyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9DLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQXNCLENBQUM7QUFDM0YsVUFBVSxFQUFFLENBQUM7QUFFYixZQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQztJQUM5QyxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFvQixDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxNQUE0QixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3ZELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFvQixDQUFDO0lBQ3BFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7SUFDckMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLFVBQVU7SUFDZixNQUFNLEtBQUssR0FBRyxnREFBUSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4RSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxDQUFDO0lBQ3hGLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsMkRBQVcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEUsTUFBTSxFQUFFLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSx1REFBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRSxDQUFDLEdBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxDQUFDO0FBQ3pILENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQ3pDLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLE1BQU0sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7SUFDN0UsWUFBWSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBb0IsQ0FBQztJQUNoRSxRQUFRLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BGLE9BQU8sSUFBSSwrQ0FBTSxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFFRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsTUFBTSxZQUFZLEdBQUcsSUFBSSw2Q0FBSyxDQUFDLEtBQUssRUFBRSxpRUFBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hFLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUV0QixLQUFLLFVBQVUsT0FBTyxDQUFDLFlBQW1CO0lBQ3RDLE1BQU0sV0FBVyxHQUFHLG1EQUFXLEVBQUUsQ0FBQztJQUNsQyxNQUFNLFFBQVEsR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDOUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBYyxFQUFFLElBQUksRUFBRSxLQUFLO0lBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixNQUFNLFNBQVMsR0FBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFpQixDQUFDO0lBQy9FLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUNsQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxRQUF5QixFQUFFLFVBQTJCO0lBQ3ZFLElBQUksU0FBUyxFQUFFO1FBQ1gsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ2pDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztLQUNyQztTQUFNO1FBQ0gsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztLQUN0QztBQUNMLENBQUM7QUFFRCxLQUFLLFVBQVUsbUJBQW1CLENBQUMsQ0FBYTtJQUM1QyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3hCLElBQUksTUFBTSxZQUFZLGlCQUFpQixFQUFFO1FBQ3JDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDbkMsSUFBSSxPQUFPLElBQUksTUFBTSxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDMUMsTUFBTSxZQUFZLEdBQUksQ0FBQyxDQUFDLE1BQXNCLENBQUMsYUFBYSxDQUFDLGFBQW9DLENBQUM7WUFDbEcsTUFBTSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1lBQzlDLElBQUksT0FBTyxJQUFJLE1BQU0sRUFBRTtnQkFDbkIsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDakIsa0RBQWtEO2dCQUNsRCxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3BDLE1BQU0sTUFBTSxHQUFHLHNEQUFjLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBb0IsQ0FBQztnQkFDeEUsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQW9CLENBQUM7Z0JBQ3BFLHFEQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDdEMsV0FBVyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7Z0JBQzVCLE1BQU0saUJBQWlCLEdBQUcsbURBQVcsRUFBRSxDQUFDO2dCQUN4QyxJQUFJO29CQUNBLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDOUM7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNoQjthQUVKO1NBQ0o7S0FDSjtBQUNMLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxJQUFnQixFQUFFLEVBQVU7SUFDMUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsS0FBSyxVQUFVLFFBQVEsQ0FBQyxJQUFJO0lBQ3hCLElBQUksQ0FBQyxFQUFFLEdBQUcsa0RBQVUsRUFBRSxDQUFDO0lBQ3ZCLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUIsTUFBTSxJQUFJLEdBQUcsbURBQVcsRUFBRSxDQUFDO0lBQzNCLDBEQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLE1BQU0sS0FBSyxHQUFHLGdEQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUk7UUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztLQUMxQjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hCO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxNQUFNLENBQUMsSUFBSTtJQUN0QixLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEMsTUFBTSxjQUFjLEdBQUcsbURBQVcsRUFBRSxDQUFDO0lBQ3JDLDBEQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pCLElBQUk7UUFDQSxNQUFNLFNBQVMsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQzNFLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vRWRpdG9yLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvQ3JlYXRlVHJ1Y2sudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdFRydWNrLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZpZXdzL2NyZWF0ZVRydWNrUm93LnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdHJ1Y2tzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuICAgIGFzeW5jIGdldEFsbENvbGxlY3Rpb25zRGF0YSgpOiBQcm9taXNlPFJlY29yZFtdPiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKG9iaiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9iaiwgW2tdOiAoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKSkpLm1hcCh4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgudHlwZSA9IGsuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcblxuICAgIH1cbiAgICBhc3luYyBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlbXMuZmluZChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZDogZ2VuZXJhdGVJZCgpIH0pO1xuICAgICAgICBpdGVtcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWNvcmQgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGlkIH0pO1xuICAgICAgICBpdGVtc1tpbmRleF0gPSByZWNvcmQ7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBSZWNvcmQgJHtpZH0gbm90IGZvdW5kIGluIFwiJHtjb2xsZWN0aW9uTmFtZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgRWRpdG9yIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGZvcm06IEhUTUxGb3JtRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFjazogKGRhdGE6IG9iamVjdCkgPT4gYW55LFxuICAgICAgICBwcml2YXRlIHByb3BOYW1lczogc3RyaW5nW10sIG9yaWdpbmF0b3I/OiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICB0aGlzLmZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5vblN1Ym1pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2V0JywgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBpZiAob3JpZ2luYXRvcikgb3JpZ2luYXRvci5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIG9uU3VibWl0KGV2ZW50OiBTdWJtaXRFdmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSh0aGlzLmZvcm0pO1xuICAgICAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKHRoaXMucHJvcE5hbWVzLm1hcChuID0+IFtuLCBmb3JtRGF0YS5nZXQobildKSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNhbGxiYWNrKGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICAvL3B1YmxpYyBhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogSFRNTFRhYmxlRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVSb3c6IChyZWNvcmQ6IGFueSkgPT4gSFRNTFRhYmxlUm93RWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmeT86IChyZWNvcmRzOiBhbnlbXSwgaWQ6IGFueSkgPT4gYW55LFxuICAgICAgICByZWNvcmRzPzogYW55W11cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICBpZiAocmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZHMuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGFjdGl2YXRlZFJvdy5yb3dJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJvdyA9IHRoaXMucmVjb3Jkc1tyb3dJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gZGVsZXRlUm93W1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlICR7aWR9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQocmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVSb3cocmVjb3JkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCByb3cpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB9XG4gICAgZ2V0KGlkOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpZnkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pZGVudGlmeSh0aGlzLnJlY29yZHMsIGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbmRldGl0eSBmdW5jdGlvbiBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgZ2V0Um93KGlkOiBhbnkpOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzLmdldChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJlcGxhY2UoaWQ6IGFueSwgbmV3UmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICAvL2NvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBbLi4udGhpcy5yb3dzLmtleXMoKV0uZmluZEluZGV4KHggPT4geFsnaWQnXSA9IGlkKTtcbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgY29uc3QgZiA9IHRoaXMuY3JlYXRlUm93LmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGYobmV3UmVjb3JkKTtcbiAgICAgICAgLy8gcm93LnJlcGxhY2VXaXRoKG5ld1Jvdyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlQ2hpbGQobmV3Um93LCB0aGlzLmVsZW1lbnQuY2hpbGROb2Rlcy5pdGVtKGluZGV4ICsgMSkpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgbmV3Um93KTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSwgbmV3UmVjb3JkKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaWQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3coaWQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5yb3dzLmRlbGV0ZShyZWNvcmQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59IiwidHlwZSBEb21Db250ZW50ID0gc3RyaW5nIHwgTm9kZTtcblxudHlwZSBlbGVtZW50RmFjdG9yeTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gKHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb20odHlwZTogc3RyaW5nLCBwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhTmFtZSA9IHByb3BOYW1lLnNsaWNlKDQsIDUpLnRvTG93ZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSg1KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXRbZGF0YU5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IHRhYmxlOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IHRoZWFkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGhlYWQnKTtcbmV4cG9ydCBjb25zdCB0Ym9keTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3Rib2R5Jyk7XG5leHBvcnQgY29uc3QgdHI6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RyJyk7XG5leHBvcnQgY29uc3QgdGg6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aCcpO1xuZXhwb3J0IGNvbnN0IHRkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGQnKTtcbmV4cG9ydCBjb25zdCBidXR0b246IGVsZW1lbnRGYWN0b3J5PEhUTUxCdXR0b25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdidXR0b24nKTtcbmV4cG9ydCBjb25zdCBzcGFuOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NwYW4nKTsvLy9cbmV4cG9ydCBjb25zdCBsYWJlbDogZWxlbWVudEZhY3Rvcnk8SFRNTExhYmVsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnbGFiZWwnKTtcbmV4cG9ydCBjb25zdCBpbnB1dDogZWxlbWVudEZhY3Rvcnk8SFRNTElucHV0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBzZWxlY3Q6IGVsZW1lbnRGYWN0b3J5PEhUTUxTZWxlY3RFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzZWxlY3QnKTtcbmV4cG9ydCBjb25zdCBvcHRpb246IGVsZW1lbnRGYWN0b3J5PEhUTUxPcHRpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdvcHRpb24nKTtcbmV4cG9ydCBjb25zdCBmb3JtOiBlbGVtZW50RmFjdG9yeTxIVE1MRm9ybUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBkaXY6IGVsZW1lbnRGYWN0b3J5PEhUTUxEaXZFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdkaXYnKTtcbmV4cG9ydCBjb25zdCBhOiBlbGVtZW50RmFjdG9yeTxIVE1MQW5jaG9yRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYScpO1xuZXhwb3J0IGNvbnN0IHA6IGVsZW1lbnRGYWN0b3J5PEhUTUxQYXJhZ3JhcGhFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdwJyk7XG5leHBvcnQgY29uc3QgaDM6IGVsZW1lbnRGYWN0b3J5PEhUTUxIZWFkaW5nRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaDMnKTtcbmV4cG9ydCBjb25zdCBzdHJvbmc6IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3Ryb25nJyk7IiwiaW1wb3J0IHsgQ2FyZ29UeXBlcywgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zLCBDYXIsIFRydWNrIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJZCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZ1bmMgPSAoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBgJHtmdW5jKCl9LSR7ZnVuYygpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywgJycpLnNwbGl0KCcuJylbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnVtKCk6IGFueSB7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCkuc2xpY2UoMCwgLTEpOy8vdHJ1Y2tcbiAgICBjb25zdCBrdnAgPSB7XG4gICAgICAgIFwidHJ1Y2tcIjogW3sgY2FyZ29UeXBlOiBDYXJnb1R5cGVzIH1dLFxuICAgICAgICBcImNhclwiOiBbeyBib2R5VHlwZTogQm9keVR5cGVzIH0sIHsgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zIH1dXG4gICAgfVxuICAgIHJldHVybiBrdnBbdHlwZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzcyh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHsgaWQsIG1ha2UsIG1vZGVsLCAuLi5yZXN0IH0gPSBkYXRhO1xuICAgIHJldHVybiB0eXBlID09PSBcImNhclwiID8gbmV3IENhcihpZCwgbWFrZSwgbW9kZWwsIHJlc3QpIDogbmV3IFRydWNrKGlkLCBtYWtlLCBtb2RlbCwgcmVzdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YTogYW55KSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAgZW51bXMuZm9yRWFjaChlbiA9PiB7XG4gICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgIGNvbnN0IGVudW1WYWxzU3RyaW5nID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgIGNvbnN0IGVudW1WYWxzTnVtYmVyID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gIWlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0VmFsdWUgPSBkYXRhW2VudW1LZXldO1xuICAgICAgICBjb25zdCBpbmRleCA9IGVudW1WYWxzU3RyaW5nLmluZGV4T2YoY3VycmVudFNlbGVjdFZhbHVlKTtcbiAgICAgICAgZGF0YVtlbnVtS2V5XSA9IGVudW1WYWxzTnVtYmVyW2luZGV4XTtcblxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Rm9ybVZhbHVlcyhrZXlzOiBzdHJpbmdbXSwgZWRpdEZvcm06IEhUTUxGb3JtRWxlbWVudCwgcmVjb3JkOiB7fSkge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBlbnVtcy5mb3JFYWNoKGVuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBlbnVtS2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bVZhbHNTdHJpbmcgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnVtVmFsc051bWJlciA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+ICFpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0VmFsdWUgPSByZWNvcmRbZW51bUtleV07XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBlbnVtVmFsc1N0cmluZy5pbmRleE9mKGN1cnJlbnRTZWxlY3RWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAoZWRpdEZvcm1ba2V5XSBhcyBIVE1MU2VsZWN0RWxlbWVudCkuc2VsZWN0ZWRJbmRleCA9IE51bWJlcihlbnVtVmFsc051bWJlcltpbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZWRpdEZvcm1ba2V5XS52YWx1ZSA9IHJlY29yZFtrZXldO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBrZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBbLi4uYWN0aXZhdGVkUm93LmNoaWxkcmVuXS5zbGljZSgxKS5yZWR1Y2UoKGEsIGIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICBpZiAoa2V5ID09PSBcInJlbnRhbFByaWNlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gYi50ZXh0Q29udGVudC5tYXRjaChyKTtcbiAgICAgICAgICAgIGFba2V5XSA9IE51bWJlcihwcmljZVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiLnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH0sIHt9KTtcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWFrZTogc3RyaW5nO1xuICAgIG1vZGVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWhpY2xlIGltcGxlbWVudHMgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIElDYXIgZXh0ZW5kcyBJVmVoaWNsZSwgQ2FyUGFyYW1zIHtcblxufVxuZXhwb3J0IGludGVyZmFjZSBJVHJ1Y2sgZXh0ZW5kcyBJVmVoaWNsZSwgVHJ1Y2tQYXJhbXMgeyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gY2FyUGFyYW1zLnJlbnRlZFRvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSBjYXJQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gQm9keVR5cGVzLnNlZGFuO1xuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gNDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gVHJhbnNtaXNzaW9ucy5hdXRvbWF0aWM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnVjayBleHRlbmRzIFZlaGljbGUge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgdHJ1Y2tQYXJhbXM/OiBUcnVja1BhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gMjtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQ2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FyZ29UeXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gdHJ1Y2tQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gdHJ1Y2tQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb24sIGdldEVudW0gfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgZnVuY3Rpb24gQ3JlYXRlVHJ1Y2soa2V5cykge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuXG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGVuID0gZW51bXNbaV07XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbiAgICBjb25zdCBjYXBpdGFsaXplZFR5cGUgPSB0eXBlWzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpO1xuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJjcmVhdGVcIiB9LCBgQWRkICR7Y2FwaXRhbGl6ZWRUeXBlfWApO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBzdWJtaXRCdG4sIGNhbmNlbEJ0bik7XG4gICAgcmV0dXJuIGZvcm0oeyBjbGFzc05hbWU6IFwiYWxpZ25cIiwgaWQ6IFwiY3JlYXRlXCIgfSwgLi4uZmllbGRzLCBidXR0b25XcmFwcGVyRGl2KVxufSIsImltcG9ydCB7IHNwYW4sIGlucHV0LCBsYWJlbCwgc2VsZWN0LCBvcHRpb24sIGJ1dHRvbiwgZm9ybSwgZGl2IH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IGdldEVudW0gfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGdldExvY2F0aW9uIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBFZGl0VHJ1Y2soa2V5cykge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuXG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGVuID0gZW51bXNbaV07XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgY29uc3QgZW51bVZhbHMgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBlbnVtVmFscztcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBrZXkgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbiAgICBjb25zdCBjYXBpdGFsaXplZFR5cGUgPSB0eXBlWzBdLnRvTG9jYWxlVXBwZXJDYXNlKCkgKyB0eXBlLnNsaWNlKDEpO1xuICAgIGNvbnN0IGVkaXRCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNvbmZpcm1cIiwgdHlwZTogXCJzdWJtaXRcIiwgaWQ6IFwiZWRpdFwiIH0sIGBTYXZlICR7Y2FwaXRhbGl6ZWRUeXBlfWApO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBlZGl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImVkaXRcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG5cblxuXG4iLCJpbXBvcnQgeyB0ciwgdGQsIGJ1dHRvbiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBDYXJnb1R5cGVzLCBUcnVjayB9IGZyb20gXCIuLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcnVja1Jvdyh0cnVjazogVHJ1Y2spIHtcbiAgICBjb25zb2xlLmxvZyh0cnVjay5jYXJnb1R5cGUpO1xuICAgIGNvbnNvbGUubG9nKENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSk7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCB0cnVjay5pZCksXG4gICAgICAgIHRkKHt9LCB0cnVjay5tYWtlKSxcbiAgICAgICAgdGQoe30sIHRydWNrLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIENhcmdvVHlwZXNbdHJ1Y2suY2FyZ29UeXBlXSksXG4gICAgICAgIHRkKHt9LCB0cnVjay5jYXBhY2l0eS50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGAkJHt0cnVjay5yZW50YWxQcmljZS50b1N0cmluZygpfS9kYXlgKSxcbiAgICAgICAgdGQoe30sIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZWRpdFwiIH0sICdFZGl0JyksIGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gZGVsZXRlXCIgfSwgJ0RlbGV0ZScpKVxuICAgICk7XG4gICAgcmV0dXJuIHJvdztcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL1N0b3JhZ2VcIjtcbmltcG9ydCB7IENhciwgSVZlaGljbGUsIFRydWNrIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZG9tL0VkaXRvclwiO1xuaW1wb3J0IHsgQ3JlYXRlVHJ1Y2sgfSBmcm9tIFwiLi92aWV3cy9DcmVhdGVUcnVja1wiO1xuaW1wb3J0IHsgRWRpdFRydWNrIH0gZnJvbSBcIi4vdmlld3MvRWRpdFRydWNrXCJcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyBtYXBTZWxlY3RzVG9WYWx1ZXMsIHNldEZvcm1WYWx1ZXMsIGdldFRhYmxlUmVjb3JkLCBnZXRMb2NhdGlvbiwgZ2V0Q2xhc3MsIGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQgeyBjcmVhdGVUcnVja1JvdyB9IGZyb20gXCIuL3ZpZXdzL2NyZWF0ZVRydWNrUm93XCI7XG5cbmV4cG9ydCBjb25zdCB0YWJsZUtleXMgPSB7XG4gICAgXCJ0cnVja1wiOiBbXCJtYWtlXCIsIFwibW9kZWxcIiwgXCJjYXJnb1R5cGVcIiwgXCJjYXBhY2l0eVwiLCBcInJlbnRhbFByaWNlXCJdLFxuICAgIFwiY2FyXCI6IFtcIm1ha2VcIiwgXCJtb2RlbFwiLCBcImJvZHlUeXBlXCIsIFwibnVtYmVyT2ZTZWF0c1wiLCBcInRyYW5zbWlzc2lvblwiLCBcInJlbnRhbFByaWNlXCJdXG59O1xuXG5sZXQgZWRpdElkID0gbnVsbDtcbmNvbnN0IGxzID0gbmV3IExvY2FsU3RvcmFnZSgpO1xubGV0IGlzRWRpdGluZyA9IGZhbHNlO1xuY29uc3QgdmVoaWNsZVR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTtcbmNvbnN0IGFjdGlvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJhY3Rpb24gbmV3XCIpWzBdIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuaW5pdGlhbGl6ZSgpO1xuXG5hY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGlzRWRpdGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgKGUudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgbGlzdGVuRm9yVGFibGVjbGljayhlKTtcbn0pO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IENsYXNzID0gZ2V0Q2xhc3ModmVoaWNsZVR5cGUsIHsgaWQ6IFwiYVwiLCBtb2RlbDogXCJiXCIsIG1ha2U6IFwiY1wiIH0pO1xuICAgIGNvbnN0IHZlaGljbGVLZXlzID0gT2JqZWN0LmtleXMoQ2xhc3MpLmZpbHRlcihrZXkgPT4ga2V5ICE9PSBcImlkXCIgJiYga2V5ICE9IFwicmVudGVkVG9cIik7XG4gICAgY29uc3QgZTEgPSBjb25maWdFZGl0b3IodmVoaWNsZUtleXMsIENyZWF0ZVRydWNrLCBvblN1Ym1pdCwgXCJjcmVhdGVcIik7XG4gICAgY29uc3QgZTIgPSBjb25maWdFZGl0b3IodmVoaWNsZUtleXMsIEVkaXRUcnVjaywgb25FZGl0LCBcImVkaXRcIik7XG4gICAgWy4uLihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZWRpdG9yIGZvcm0nKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PildLmZvckVhY2goZWwgPT4gZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcbn1cblxuZnVuY3Rpb24gY29uZmlnRWRpdG9yKGtleXMsIHZpZXcsIGhhbmRsZXIsIGlkKSB7XG4gICAgY29uc3QgaW5kZXggPSBpZCA9PSBcImVkaXRcIiA/IDIgOiAxO1xuICAgIGNvbnN0IHsgbmV3RWRpdG9yOiB1cGRhdGVFZGl0b3IsIGh0bWw6IGh0bWwyIH0gPSBnZXRFZGl0b3Ioa2V5cywgdmlldywgaW5kZXgpXG4gICAgdXBkYXRlRWRpdG9yLmFwcGVuZENoaWxkKGh0bWwyKTtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgZWRpdEZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwiI1wiICsgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gbmV3IEVkaXRvcihlZGl0Rm9ybSwgaGFuZGxlciwga2V5cywgYWN0aW9uQnV0dG9uKTtcbn1cblxuY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGFibGUnKVswXTtcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlVHJ1Y2tSb3csIGlkZW50aWZ5KTtcbmhpZHJhdGUodGFibGVNYW5hZ2VyKTtcblxuYXN5bmMgZnVuY3Rpb24gaGlkcmF0ZSh0YWJsZU1hbmFnZXI6IFRhYmxlKSB7XG4gICAgY29uc3QgY3VycmVudFR5cGUgPSBnZXRMb2NhdGlvbigpO1xuICAgIGNvbnN0IHZlaGljbGVzID0gYXdhaXQgbHMuZ2V0QWxsKGN1cnJlbnRUeXBlKTtcbiAgICB2ZWhpY2xlcy5mb3JFYWNoKHZlaGljbGUgPT4gdGFibGVNYW5hZ2VyLmFkZCh2ZWhpY2xlKSk7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRvcihrZXlzOiBzdHJpbmdbXSwgdmlldywgaW5kZXgpIHtcbiAgICBjb25zdCBodG1sID0gdmlldyhrZXlzKTtcbiAgICBjb25zdCBuZXdFZGl0b3IgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvcicpW2luZGV4XSBhcyBIVE1MRWxlbWVudCk7XG4gICAgbmV3RWRpdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgcmV0dXJuIHsgbmV3RWRpdG9yLCBodG1sIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUZvcm1zKGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIGNyZWF0ZUZvcm06IEhUTUxGb3JtRWxlbWVudCkge1xuICAgIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYnRuVGV4dCA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIgfHwgYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgZWRpdElkID0gYWN0aXZhdGVkUm93LmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xuICAgICAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIpIHtcbiAgICAgICAgICAgICAgICBpc0VkaXRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vdG8gYmUgY2FsbGVkIGNvbmRpdGlvbmFsbHkgZGVwZW5kaW5nIG9uIGxvY2F0aW9uXG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IHRhYmxlS2V5c1t2ZWhpY2xlVHlwZV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93LCBrZXlzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgICAgICBzZXRGb3JtVmFsdWVzKGtleXMsIGVkaXRGb3JtLCByZWNvcmQpO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbGxlY3Rpb24gPSBnZXRMb2NhdGlvbigpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGxzLmRlbGV0ZShjdXJyZW50Q29sbGVjdGlvbiwgZWRpdElkKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uU3VibWl0KGRhdGEpIHtcbiAgICBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YSk7XG4gICAgY29uc3QgQ2xhc3MgPSBnZXRDbGFzcyh0eXBlLCBkYXRhKTtcbiAgICB0cnkge1xuICAgICAgICBscy5jcmVhdGUodHlwZSwgQ2xhc3MpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uRWRpdChkYXRhKSB7XG4gICAgYWxlcnQoJ2luIEVkaXQuLi4nKVxuICAgIGNvbnNvbGUubG9nKCdkYXRhIGluIGVkaXQ6ICcsIGRhdGEpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gZ2V0TG9jYXRpb24oKTtcbiAgICBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YSk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbmV3UmVjb3JkID0geyAuLi5hd2FpdCBscy5nZXRCeUlkKGNvbGxlY3Rpb25OYW1lLCBlZGl0SWQpLCAuLi5kYXRhIH07XG4gICAgICAgIHRhYmxlTWFuYWdlci5yZXBsYWNlKGVkaXRJZCwgbmV3UmVjb3JkKTtcbiAgICAgICAgYXdhaXQgbHMudXBkYXRlKGNvbGxlY3Rpb25OYW1lLCBlZGl0SWQsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=