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
/* harmony export */   "button": () => (/* binding */ button),
/* harmony export */   "div": () => (/* binding */ div),
/* harmony export */   "dom": () => (/* binding */ dom),
/* harmony export */   "form": () => (/* binding */ form),
/* harmony export */   "input": () => (/* binding */ input),
/* harmony export */   "label": () => (/* binding */ label),
/* harmony export */   "option": () => (/* binding */ option),
/* harmony export */   "select": () => (/* binding */ select),
/* harmony export */   "span": () => (/* binding */ span),
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

/***/ "./src/views/EditForm.ts":
/*!*******************************!*\
  !*** ./src/views/EditForm.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EditForm": () => (/* binding */ EditForm)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vehicle */ "./src/vehicle.ts");


function EditForm(keys) {
    const fields = keys.map(key => {
        if (key === "bodyType") {
            const values = Object.keys(_vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes).filter(x => isNaN(Number(x)));
            const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
            const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, "body type");
            const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: "bodyType" }, ...options);
            return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
        }
        if (key === "transmission") {
            const values = Object.keys(_vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions).filter(x => isNaN(Number(x)));
            const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
            const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, "transmission");
            const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: "transmission" }, ...options);
            return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
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


/***/ }),

/***/ "./src/views/FormView.ts":
/*!*******************************!*\
  !*** ./src/views/FormView.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FormView": () => (/* binding */ FormView)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vehicle */ "./src/vehicle.ts");


function FormView(keys) {
    const fields = keys.map(key => {
        if (key === "bodyType") {
            const values = Object.keys(_vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes).filter(x => isNaN(Number(x)));
            const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
            const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, "body type");
            const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: "bodyType" }, ...options);
            return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
        }
        if (key === "transmission") {
            const values = Object.keys(_vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions).filter(x => isNaN(Number(x)));
            const options = values.map(val => (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.option)({ value: val, textContent: val }));
            const currentSpan = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, "transmission");
            const currentSelect = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.select)({ name: "transmission" }, ...options);
            return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, currentSpan, currentSelect);
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
/*!*********************!*\
  !*** ./src/cars.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vehicle */ "./src/vehicle.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _dom_Editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/Editor */ "./src/dom/Editor.ts");
/* harmony import */ var _views_FormView__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./views/FormView */ "./src/views/FormView.ts");
/* harmony import */ var _views_EditForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./views/EditForm */ "./src/views/EditForm.ts");
/* harmony import */ var _dom_Table__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom/Table */ "./src/dom/Table.ts");
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./dom/dom */ "./src/dom/dom.ts");









let editId = null;
const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
let isEditing = false;
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
    const keys = Object.keys(new _vehicle__WEBPACK_IMPORTED_MODULE_1__.Car("a", "b", "c")).filter(key => key !== "id");
    const { newEditor, html } = getEditor(keys, _views_FormView__WEBPACK_IMPORTED_MODULE_4__.FormView, 1);
    newEditor.appendChild(html);
    const createForm = document.getElementById("create");
    createForm.style.background = "red";
    let editor = new _dom_Editor__WEBPACK_IMPORTED_MODULE_3__.Editor(createForm, onSubmit, keys, actionButton);
    const { newEditor: updateEditor, html: html2 } = getEditor(keys, _views_EditForm__WEBPACK_IMPORTED_MODULE_5__.EditForm, 2);
    const reference = document.querySelector('main');
    updateEditor.insertBefore(html2, reference);
    const editForm = document.getElementById("edit");
    editForm.style.background = "yellow";
    let e2 = new _dom_Editor__WEBPACK_IMPORTED_MODULE_3__.Editor(editForm, onEdit, keys, actionButton);
    [...document.querySelectorAll('.editor form')].forEach(el => el.style.display = "none");
}
const table = document.getElementsByTagName('table')[0];
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_6__.Table(table, createCarRow, identify);
hidrate(tableManager);
async function hidrate(tableManager) {
    const cars = await ls.getAll('cars');
    cars.forEach(car => tableManager.add(car));
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
function listenForTableclick(e) {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
        const btnText = target.textContent;
        if (btnText == "Edit" || btnText == "Delete") {
            if (btnText == "Edit") {
                isEditing = true;
                const activatedRow = e.target.parentElement.parentElement;
                editId = activatedRow.children[0].textContent;
                const keys = ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"];
                const record = getTableRecord(activatedRow, keys);
                const createForm = document.getElementById("create");
                const editForm = document.getElementById("edit");
                setFormValues(keys, editForm, record);
                toggleForms(editForm, createForm);
            }
            else if (btnText == "Delete") {
                ls.delete('cars', editId);
            }
        }
    }
}
function setFormValues(keys, editForm, record) {
    keys.forEach(key => {
        if (key === "bodyType" || key === "transmission") {
            const selectItems = key === "bodyType" ? _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes : _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions;
            editForm[key].selectedIndex = selectItems[key];
        }
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
function createCarRow(car) {
    console.log(car);
    console.log(Object.keys(car));
    console.log(Object.entries(car));
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[car.bodyType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.numberOfSeats.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions[car.transmission]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, `$${car.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action delete" }, 'Delete')));
    return row;
}
async function onSubmit(data) {
    data.id = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.generateId)();
    alert(JSON.stringify(data));
    const type = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.getLocation)();
    try {
        ls.create(type, new _vehicle__WEBPACK_IMPORTED_MODULE_1__.Car(data.id, data.make, data.model));
    }
    catch (error) {
        alert(error);
    }
}
async function onEdit(data) {
    alert('in Edit...');
    try {
        data["bodyType"] = _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[data["bodyType"]];
        data["transmission"] = _vehicle__WEBPACK_IMPORTED_MODULE_1__.Transmissions[data["transmission"]];
        const newRecord = { ...await ls.getById('cars', editId), ...data };
        tableManager.replace(editId, newRecord);
        await ls.update('cars', editId, data);
    }
    catch (error) {
        alert(error);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDO0tBQ2hCO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxNQUFNLENBQUMsSUFBSTtJQUN0QixLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ25CLElBQUk7UUFDQSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsK0NBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsbURBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUMzRCxNQUFNLFNBQVMsR0FBRyxFQUFFLEdBQUcsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ25FLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vRWRpdG9yLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdEZvcm0udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRm9ybVZpZXcudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9jYXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEVkaXRvciB7XG4gICAgcHJpdmF0ZSByZWNvcmRzOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgcm93czogTWFwPG9iamVjdCwgSFRNTFRhYmxlUm93RWxlbWVudD4gPSBuZXcgTWFwKCk7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IChkYXRhOiBvYmplY3QpID0+IGFueSxcbiAgICAgICAgcHJpdmF0ZSBwcm9wTmFtZXM6IHN0cmluZ1tdLCBvcmlnaW5hdG9yPzogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmF0b3IpIG9yaWdpbmF0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBvblN1Ym1pdChldmVudDogU3VibWl0RXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEodGhpcy5mb3JtKTtcbiAgICAgICAgY29uc3QgYm9keVR5cGUgPSBmb3JtRGF0YS5nZXQoJ2JvZHlUeXBlJyk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXModGhpcy5wcm9wTmFtZXMubWFwKG4gPT4gW24sIGZvcm1EYXRhLmdldChuKV0pKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gey8vL2FkZGVkIGRlbGV0ZSBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBhY3RpdmF0ZWRSb3cucm93SW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVSb3cgPSB0aGlzLnJlY29yZHNbcm93SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGRlbGV0ZVJvd1tcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlybShgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSAke2lkfWApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkKHJlY29yZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuY3JlYXRlUm93KHJlY29yZCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB0aGlzLnJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgcm93KTtcbiAgICB9XG5cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID0gaWQpO1xuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBmID0gdGhpcy5jcmVhdGVSb3cuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgbmV3Um93ID0gZihuZXdSZWNvcmQpO1xuICAgICAgICAvLyByb3cucmVwbGFjZVdpdGgobmV3Um93KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChuZXdSb3csIHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzLml0ZW0oaW5kZXggKyAxKSk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxLCBuZXdSZWNvcmQpO1xuICAgIH1cblxuICAgIHJlbW92ZShpZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvdyhpZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnJvd3MuZGVsZXRlKHJlY29yZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbn0iLCJ0eXBlIERvbUNvbnRlbnQgPSBzdHJpbmcgfCBOb2RlO1xuXG50eXBlIGVsZW1lbnRGYWN0b3J5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSAocHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkgPT4gVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbSh0eXBlOiBzdHJpbmcsIHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lID0gcHJvcE5hbWUuc2xpY2UoNCwgNSkudG9Mb3dlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDUpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldFtkYXRhTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgY29uc3QgdGFibGU6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RhYmxlJyk7XG5leHBvcnQgY29uc3QgdGhlYWQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IHRib2R5OiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGJvZHknKTtcbmV4cG9ydCBjb25zdCB0cjogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlUm93RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndHInKTtcbmV4cG9ydCBjb25zdCB0aDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoJyk7XG5leHBvcnQgY29uc3QgdGQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0ZCcpO1xuZXhwb3J0IGNvbnN0IGJ1dHRvbjogZWxlbWVudEZhY3Rvcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IHNwYW46IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3BhbicpOy8vL1xuZXhwb3J0IGNvbnN0IGxhYmVsOiBlbGVtZW50RmFjdG9yeTxIVE1MTGFiZWxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IGlucHV0OiBlbGVtZW50RmFjdG9yeTxIVE1MSW5wdXRFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdDogZWxlbWVudEZhY3Rvcnk8SFRNTFNlbGVjdEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IG9wdGlvbjogZWxlbWVudEZhY3Rvcnk8SFRNTE9wdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IGZvcm06IGVsZW1lbnRGYWN0b3J5PEhUTUxGb3JtRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZm9ybScpO1xuZXhwb3J0IGNvbnN0IGRpdjogZWxlbWVudEZhY3Rvcnk8SFRNTERpdkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2RpdicpOyIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTpzdHJpbmd7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywnJykuc3BsaXQoJy4nKVswXTtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYWtlOiBzdHJpbmc7XG4gICAgbW9kZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ2FyIGV4dGVuZHMgSVZlaGljbGUsIENhclBhcmFtcyB7XG5cbn1cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xufVxuZXhwb3J0IGNsYXNzIENhciBleHRlbmRzIFZlaGljbGUge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgY2FyUGFyYW1zPzogQ2FyUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIGlmIChjYXJQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBjYXJQYXJhbXMuYm9keVR5cGU7XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLm51bWJlck9mU2VhdHMgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJTZWF0cyBjYW5ub3QgYmUgbmVnYXRpdmVcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IGNhclBhcmFtcy5udW1iZXJPZlNlYXRzO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBjYXJQYXJhbXMudHJhbnNtaXNzaW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IEJvZHlUeXBlcy5zZWRhbjtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IFRyYW5zbWlzc2lvbnMuYXV0b21hdGljO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2sgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIHRydWNrUGFyYW1zPzogVHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IHRydWNrUGFyYW1zLmNhcmdvVHlwZTtcbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkNhcGFjaXR5IGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICAgICAgdGhpcy5jYXBhY2l0eSA9IDI7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zIH0gZnJvbSBcIi4uL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEVkaXRGb3JtKGtleXMpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBrZXlzLm1hcChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBcImJvZHlUeXBlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC5rZXlzKEJvZHlUeXBlcykuZmlsdGVyKHggPT4gaXNOYU4oTnVtYmVyKHgpKSk7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIFwiYm9keSB0eXBlXCIpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IFwiYm9keVR5cGVcIiB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09IFwidHJhbnNtaXNzaW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC5rZXlzKFRyYW5zbWlzc2lvbnMpLmZpbHRlcih4ID0+IGlzTmFOKE51bWJlcih4KSkpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBcInRyYW5zbWlzc2lvblwiKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBcInRyYW5zbWlzc2lvblwiIH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IGlucHV0KHsgdHlwZTogXCJ0ZXh0XCIsIG5hbWU6IGtleSB9KTtcbiAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudElucHV0KTtcbiAgICB9KTtcbiAgICBjb25zdCBlZGl0QnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjb25maXJtXCIsIHR5cGU6IFwic3VibWl0XCIsIGlkOiBcImVkaXRcIiB9LCBcIlNhdmUgQ2FyXCIpO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBlZGl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImVkaXRcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG4iLCJpbXBvcnQgeyBzcGFuLCBpbnB1dCwgbGFiZWwsIHNlbGVjdCwgb3B0aW9uLCBidXR0b24sIGZvcm0sIGRpdiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMgfSBmcm9tIFwiLi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gRm9ybVZpZXcoa2V5cykge1xuICAgIGNvbnN0IGZpZWxkcyA9IGtleXMubWFwKGtleSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IFwiYm9keVR5cGVcIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmtleXMoQm9keVR5cGVzKS5maWx0ZXIoeCA9PiBpc05hTihOdW1iZXIoeCkpKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwgXCJib2R5IHR5cGVcIik7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZTogXCJib2R5VHlwZVwiIH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gXCJ0cmFuc21pc3Npb25cIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmtleXMoVHJhbnNtaXNzaW9ucykuZmlsdGVyKHggPT4gaXNOYU4oTnVtYmVyKHgpKSk7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIFwidHJhbnNtaXNzaW9uXCIpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IFwidHJhbnNtaXNzaW9uXCIgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJjcmVhdGVcIiB9LCBcIkFkZCBDYXJcIik7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIHN1Ym1pdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJjcmVhdGVcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL1N0b3JhZ2VcIjtcbmltcG9ydCB7IEJvZHlUeXBlcywgQ2FyLCBJVmVoaWNsZSwgVHJhbnNtaXNzaW9ucyB9IGZyb20gXCIuL3ZlaGljbGVcIjtcbmltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZG9tL0VkaXRvclwiO1xuaW1wb3J0IHsgRm9ybVZpZXcgfSBmcm9tIFwiLi92aWV3cy9Gb3JtVmlld1wiO1xuaW1wb3J0IHsgRWRpdEZvcm0gfSBmcm9tIFwiLi92aWV3cy9FZGl0Rm9ybVwiO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb24gfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiLi9kb20vVGFibGVcIjtcbmltcG9ydCB7IHRyLCB0ZCwgc3BhbiwgYnV0dG9uIH0gZnJvbSBcIi4vZG9tL2RvbVwiO1xuXG5sZXQgZWRpdElkID0gbnVsbDtcblxuY29uc3QgbHMgPSBuZXcgTG9jYWxTdG9yYWdlKCk7XG5cbmxldCBpc0VkaXRpbmcgPSBmYWxzZTtcblxuY29uc3QgYWN0aW9uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImFjdGlvbiBuZXdcIilbMF0gYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbmluaXRpYWxpemUoKTtcblxuYWN0aW9uQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICBpc0VkaXRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIChlLnRhcmdldCBhcyBIVE1MQnV0dG9uRWxlbWVudCkuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG59KTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgIGxpc3RlbkZvclRhYmxlY2xpY2soZSk7XG59KTtcblxuZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobmV3IENhcihcImFcIiwgXCJiXCIsIFwiY1wiKSkuZmlsdGVyKGtleSA9PiBrZXkgIT09IFwiaWRcIik7XG4gICAgY29uc3QgeyBuZXdFZGl0b3IsIGh0bWwgfSA9IGdldEVkaXRvcihrZXlzLCBGb3JtVmlldywgMSk7XG4gICAgbmV3RWRpdG9yLmFwcGVuZENoaWxkKGh0bWwpXG4gICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICBjcmVhdGVGb3JtLnN0eWxlLmJhY2tncm91bmQgPSBcInJlZFwiO1xuICAgIGxldCBlZGl0b3IgPSBuZXcgRWRpdG9yKGNyZWF0ZUZvcm0sIG9uU3VibWl0LCBrZXlzLCBhY3Rpb25CdXR0b24pO1xuXG4gICAgY29uc3QgeyBuZXdFZGl0b3I6IHVwZGF0ZUVkaXRvciwgaHRtbDogaHRtbDIgfSA9IGdldEVkaXRvcihrZXlzLCBFZGl0Rm9ybSwgMilcbiAgICBjb25zdCByZWZlcmVuY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluJykgYXMgSFRNTEVsZW1lbnQ7XG4gICAgdXBkYXRlRWRpdG9yLmluc2VydEJlZm9yZShodG1sMiwgcmVmZXJlbmNlKTtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgZWRpdEZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwieWVsbG93XCI7XG4gICAgbGV0IGUyID0gbmV3IEVkaXRvcihlZGl0Rm9ybSwgb25FZGl0LCBrZXlzLCBhY3Rpb25CdXR0b24pO1xuICAgIFsuLi4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvciBmb3JtJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pXS5mb3JFYWNoKGVsID0+IGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIik7XG59XG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG5jb25zdCB0YWJsZU1hbmFnZXIgPSBuZXcgVGFibGUodGFibGUsIGNyZWF0ZUNhclJvdywgaWRlbnRpZnkpO1xuXG5oaWRyYXRlKHRhYmxlTWFuYWdlcik7XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSkge1xuICAgIGNvbnN0IGNhcnMgPSBhd2FpdCBscy5nZXRBbGwoJ2NhcnMnKTtcbiAgICBjYXJzLmZvckVhY2goY2FyID0+IHRhYmxlTWFuYWdlci5hZGQoY2FyKSk7XG59XG5cbmZ1bmN0aW9uIGdldEVkaXRvcihrZXlzOiBzdHJpbmdbXSwgdmlldywgaW5kZXgpIHtcbiAgICBjb25zdCBodG1sID0gdmlldyhrZXlzKTtcbiAgICBjb25zdCBuZXdFZGl0b3IgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvcicpW2luZGV4XSBhcyBIVE1MRWxlbWVudCk7XG4gICAgbmV3RWRpdG9yLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgcmV0dXJuIHsgbmV3RWRpdG9yLCBodG1sIH07XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUZvcm1zKGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIGNyZWF0ZUZvcm06IEhUTUxGb3JtRWxlbWVudCkge1xuICAgIGlmIChpc0VkaXRpbmcpIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgY3JlYXRlRm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdEZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGU6IE1vdXNlRXZlbnQpIHtcbiAgICBjb25zdCB0YXJnZXQgPSBlLnRhcmdldDtcbiAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgYnRuVGV4dCA9IHRhcmdldC50ZXh0Q29udGVudDtcbiAgICAgICAgaWYgKGJ0blRleHQgPT0gXCJFZGl0XCIgfHwgYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICBpZiAoYnRuVGV4dCA9PSBcIkVkaXRcIikge1xuICAgICAgICAgICAgICAgIGlzRWRpdGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gKGUudGFyZ2V0IGFzIEhUTUxFbGVtZW50KS5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgICAgICBlZGl0SWQgPSBhY3RpdmF0ZWRSb3cuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQ7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5cyA9IFtcIm1ha2VcIiwgXCJtb2RlbFwiLCBcImJvZHlUeXBlXCIsIFwibnVtYmVyT2ZTZWF0c1wiLCBcInRyYW5zbWlzc2lvblwiLCBcInJlbnRhbFByaWNlXCJdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY29yZCA9IGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdywga2V5cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgc2V0Rm9ybVZhbHVlcyhrZXlzLCBlZGl0Rm9ybSwgcmVjb3JkKTtcbiAgICAgICAgICAgICAgICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJ0blRleHQgPT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgIGxzLmRlbGV0ZSgnY2FycycsIGVkaXRJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNldEZvcm1WYWx1ZXMoa2V5czogc3RyaW5nW10sIGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIHJlY29yZDoge30pIHtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJib2R5VHlwZVwiIHx8IGtleSA9PT0gXCJ0cmFuc21pc3Npb25cIikge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0SXRlbXMgPSBrZXkgPT09IFwiYm9keVR5cGVcIiA/IEJvZHlUeXBlcyA6IFRyYW5zbWlzc2lvbnM7XG4gICAgICAgICAgICAoZWRpdEZvcm1ba2V5XSBhcyBIVE1MU2VsZWN0RWxlbWVudCkuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdEl0ZW1zW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgZWRpdEZvcm1ba2V5XS52YWx1ZSA9IHJlY29yZFtrZXldO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQsIGtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIFsuLi5hY3RpdmF0ZWRSb3cuY2hpbGRyZW5dLnNsaWNlKDEpLnJlZHVjZSgoYSwgYiwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIGlmIChrZXkgPT09IFwicmVudGFsUHJpY2VcIikge1xuICAgICAgICAgICAgY29uc3QgciA9IC8tP1xcZCsvO1xuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBiLnRleHRDb250ZW50Lm1hdGNoKHIpO1xuICAgICAgICAgICAgYVtrZXldID0gTnVtYmVyKHByaWNlWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFba2V5XSA9IGIudGV4dENvbnRlbnQ7XG5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYTtcbiAgICB9LCB7fSk7XG59XG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhclJvdyhjYXI6IENhcikge1xuICAgIGNvbnNvbGUubG9nKGNhcik7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmtleXMoY2FyKSk7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoY2FyKSk7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCBjYXIuaWQpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIEJvZHlUeXBlc1tjYXIuYm9keVR5cGVdKSxcbiAgICAgICAgdGQoe30sIGNhci5udW1iZXJPZlNlYXRzLnRvU3RyaW5nKCkpLFxuICAgICAgICB0ZCh7fSwgVHJhbnNtaXNzaW9uc1tjYXIudHJhbnNtaXNzaW9uXSksXG4gICAgICAgIHRkKHt9LCBgJCR7Y2FyLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBlZGl0XCIgfSwgJ0VkaXQnKSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBkZWxldGVcIiB9LCAnRGVsZXRlJykpXG4gICAgKTtcblxuICAgIHJldHVybiByb3c7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uU3VibWl0KGRhdGEpIHtcbiAgICBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICB0cnkge1xuICAgICAgICBscy5jcmVhdGUodHlwZSwgbmV3IENhcihkYXRhLmlkLCBkYXRhLm1ha2UsIGRhdGEubW9kZWwpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkVkaXQoZGF0YSkge1xuICAgIGFsZXJ0KCdpbiBFZGl0Li4uJylcbiAgICB0cnkge1xuICAgICAgICBkYXRhW1wiYm9keVR5cGVcIl0gPSBCb2R5VHlwZXNbZGF0YVtcImJvZHlUeXBlXCJdXTtcbiAgICAgICAgZGF0YVtcInRyYW5zbWlzc2lvblwiXSA9IFRyYW5zbWlzc2lvbnNbZGF0YVtcInRyYW5zbWlzc2lvblwiXV07XG4gICAgICAgIGNvbnN0IG5ld1JlY29yZCA9IHsgLi4uYXdhaXQgbHMuZ2V0QnlJZCgnY2FycycsIGVkaXRJZCksIC4uLmRhdGEgfTtcbiAgICAgICAgdGFibGVNYW5hZ2VyLnJlcGxhY2UoZWRpdElkLCBuZXdSZWNvcmQpO1xuICAgICAgICBhd2FpdCBscy51cGRhdGUoJ2NhcnMnLCBlZGl0SWQsIGRhdGEpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgIH1cbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=