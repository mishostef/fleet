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
                    console.log(activatedRow);
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
        const index = this.records.findIndex(r => r == record);
        const row = this.getRow(id);
        // Update row in DOM and collection
        const newRow = this.createRow(newRecord);
        row.replaceWith(newRow);
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
    constructor(id, make, model) {
        super(id, make, model);
        this.id = id;
        this.make = make;
        this.model = model;
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


function EditForm(keys, mode = false) {
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


function FormView(keys, mode = false) {
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
    const createForm = document.getElementById("create");
    e.target.style.display = "none";
    const editForm = document.getElementById("edit");
    toggleForms(editForm, createForm);
    document.addEventListener('click', (e) => {
        listenForTableclick(e);
    });
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
    editor = new _dom_Editor__WEBPACK_IMPORTED_MODULE_3__.Editor(editForm, onEdit, keys, actionButton);
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
        if (btnText == "Edit") {
            isEditing = true;
            const activatedRow = e.target.parentElement.parentElement;
            editId = activatedRow.children[0].textContent;
            const keys = ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"];
            const record = getTableRecord(activatedRow, keys);
            const createForm = document.getElementById("create");
            const editForm = document.getElementById("edit");
            keys.forEach(key => editForm[key].value = record[key]);
            toggleForms(editForm, createForm);
        }
    }
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
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[car.bodyType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.numberOfSeats.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, car.transmission.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, `$${car.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_7__.button)({ className: "action delete" }, 'Delete')));
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
        await ls.update('cars', editId, data);
        const newRecord = await ls.getById('cars', editId);
        tableManager.replace(editId, newRecord);
    }
    catch (error) {
        alert(error);
    }
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMvRSxNQUFNLEtBQUssR0FBNEMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0UsTUFBTSxFQUFFLEdBQXdDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JFLE1BQU0sRUFBRSxHQUF5QyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RSxNQUFNLEVBQUUsR0FBeUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEUsTUFBTSxNQUFNLEdBQXNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sSUFBSSxHQUFvQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFHO0FBQ3hFLE1BQU0sS0FBSyxHQUFxQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RSxNQUFNLEtBQUssR0FBcUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEUsTUFBTSxNQUFNLEdBQXNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sTUFBTSxHQUFzQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzRSxNQUFNLElBQUksR0FBb0MsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDckUsTUFBTSxHQUFHLEdBQW1DLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDekNsRSxTQUFTLFVBQVU7SUFDdEIsTUFBTSxJQUFJLEdB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QUN0QixLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ25CLElBQUk7UUFDQSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN0QyxNQUFNLFNBQVMsR0FBRSxNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vRWRpdG9yLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdEZvcm0udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRm9ybVZpZXcudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9jYXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEVkaXRvciB7XG4gICAgcHJpdmF0ZSByZWNvcmRzOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgcm93czogTWFwPG9iamVjdCwgSFRNTFRhYmxlUm93RWxlbWVudD4gPSBuZXcgTWFwKCk7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IChkYXRhOiBvYmplY3QpID0+IGFueSxcbiAgICAgICAgcHJpdmF0ZSBwcm9wTmFtZXM6IHN0cmluZ1tdLCBvcmlnaW5hdG9yPzogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmF0b3IpIG9yaWdpbmF0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBvblN1Ym1pdChldmVudDogU3VibWl0RXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEodGhpcy5mb3JtKTtcbiAgICAgICAgY29uc3QgYm9keVR5cGUgPSBmb3JtRGF0YS5nZXQoJ2JvZHlUeXBlJyk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXModGhpcy5wcm9wTmFtZXMubWFwKG4gPT4gW24sIGZvcm1EYXRhLmdldChuKV0pKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gey8vL2FkZGVkIGRlbGV0ZSBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWN0aXZhdGVkUm93KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBhY3RpdmF0ZWRSb3cucm93SW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVSb3cgPSB0aGlzLnJlY29yZHNbcm93SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGRlbGV0ZVJvd1tcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlybShgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSAke2lkfWApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkKHJlY29yZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuY3JlYXRlUm93KHJlY29yZCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB0aGlzLnJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgcm93KTtcbiAgICB9XG5cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3coaWQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IHRoaXMuY3JlYXRlUm93KG5ld1JlY29yZCk7XG4gICAgICAgIHJvdy5yZXBsYWNlV2l0aChuZXdSb3cpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgbmV3Um93KTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSwgbmV3UmVjb3JkKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaWQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3coaWQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5yb3dzLmRlbGV0ZShyZWNvcmQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59IiwidHlwZSBEb21Db250ZW50ID0gc3RyaW5nIHwgTm9kZTtcblxudHlwZSBlbGVtZW50RmFjdG9yeTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gKHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb20odHlwZTogc3RyaW5nLCBwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhTmFtZSA9IHByb3BOYW1lLnNsaWNlKDQsIDUpLnRvTG93ZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSg1KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXRbZGF0YU5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IHRhYmxlOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IHRoZWFkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGhlYWQnKTtcbmV4cG9ydCBjb25zdCB0Ym9keTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3Rib2R5Jyk7XG5leHBvcnQgY29uc3QgdHI6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RyJyk7XG5leHBvcnQgY29uc3QgdGg6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aCcpO1xuZXhwb3J0IGNvbnN0IHRkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGQnKTtcbmV4cG9ydCBjb25zdCBidXR0b246IGVsZW1lbnRGYWN0b3J5PEhUTUxCdXR0b25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdidXR0b24nKTtcbmV4cG9ydCBjb25zdCBzcGFuOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NwYW4nKTsvLy9cbmV4cG9ydCBjb25zdCBsYWJlbDogZWxlbWVudEZhY3Rvcnk8SFRNTExhYmVsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnbGFiZWwnKTtcbmV4cG9ydCBjb25zdCBpbnB1dDogZWxlbWVudEZhY3Rvcnk8SFRNTElucHV0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBzZWxlY3Q6IGVsZW1lbnRGYWN0b3J5PEhUTUxTZWxlY3RFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzZWxlY3QnKTtcbmV4cG9ydCBjb25zdCBvcHRpb246IGVsZW1lbnRGYWN0b3J5PEhUTUxPcHRpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdvcHRpb24nKTtcbmV4cG9ydCBjb25zdCBmb3JtOiBlbGVtZW50RmFjdG9yeTxIVE1MRm9ybUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBkaXY6IGVsZW1lbnRGYWN0b3J5PEhUTUxEaXZFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdkaXYnKTsiLCJleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJZCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZ1bmMgPSAoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBgJHtmdW5jKCl9LSR7ZnVuYygpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKCk6c3RyaW5ne1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgnLycsJycpLnNwbGl0KCcuJylbMF07XG59XG4iLCJleHBvcnQgaW50ZXJmYWNlIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWFrZTogc3RyaW5nO1xuICAgIG1vZGVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlbnRlZFRvID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IC0xO1xuICAgIH1cbn1cbmV4cG9ydCBlbnVtIEJvZHlUeXBlcyB7XG4gICAgXCJzZWRhblwiLCBcInN1dlwiLCBcImhhdGNoYmFja1wiXG59XG5leHBvcnQgZW51bSBUcmFuc21pc3Npb25zIHtcbiAgICBcIm1hbnVhbFwiLCBcImF1dG9tYXRpY1wiXG59XG5leHBvcnQgZW51bSBDYXJnb1R5cGVzIHtcbiAgICBcImJveFwiLCBcImZsYXRiZWRcIiwgXCJ2YW5cIlxufVxuZXhwb3J0IGludGVyZmFjZSBDYXJQYXJhbXMge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNhciBleHRlbmRzIElWZWhpY2xlLCBDYXJQYXJhbXN7XG4gICAgIFxufVxuXG5leHBvcnQgY2xhc3MgQ2FyIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCBjYXJQYXJhbXM/OiBDYXJQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKGNhclBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IGNhclBhcmFtcy5ib2R5VHlwZTtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cyA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlNlYXRzIGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gY2FyUGFyYW1zLm51bWJlck9mU2VhdHM7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IGNhclBhcmFtcy50cmFuc21pc3Npb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gQm9keVR5cGVzLnNlZGFuO1xuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gNDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gVHJhbnNtaXNzaW9ucy5hdXRvbWF0aWM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnVjayBleHRlbmRzIFZlaGljbGUge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBzcGFuLCBpbnB1dCwgbGFiZWwsIHNlbGVjdCwgb3B0aW9uLCBidXR0b24sIGZvcm0sIGRpdiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMgfSBmcm9tIFwiLi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gRWRpdEZvcm0oa2V5cywgbW9kZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJib2R5VHlwZVwiKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3Qua2V5cyhCb2R5VHlwZXMpLmZpbHRlcih4ID0+IGlzTmFOKE51bWJlcih4KSkpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBcImJvZHkgdHlwZVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBcImJvZHlUeXBlXCIgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09PSBcInRyYW5zbWlzc2lvblwiKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3Qua2V5cyhUcmFuc21pc3Npb25zKS5maWx0ZXIoeCA9PiBpc05hTihOdW1iZXIoeCkpKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwgXCJ0cmFuc21pc3Npb25cIik7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZTogXCJ0cmFuc21pc3Npb25cIiB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5wdXQgPSBpbnB1dCh7IHR5cGU6IFwidGV4dFwiLCBuYW1lOiBrZXkgfSk7XG4gICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRJbnB1dCk7XG4gICAgfSk7XG4gICAgY29uc3QgZWRpdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJlZGl0XCIgfSwgXCJTYXZlIENhclwiKTtcbiAgICBjb25zdCBjYW5jZWxCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNhbmNlbFwiLCB0eXBlOiBcInJlc2V0XCIgfSwgXCJDYW5jZWxcIik7XG4gICAgY29uc3QgYnV0dG9uV3JhcHBlckRpdiA9IGRpdih7fSwgZWRpdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJlZGl0XCIgfSwgLi4uZmllbGRzLCBidXR0b25XcmFwcGVyRGl2KVxufVxuIiwiaW1wb3J0IHsgc3BhbiwgaW5wdXQsIGxhYmVsLCBzZWxlY3QsIG9wdGlvbiwgYnV0dG9uLCBmb3JtLCBkaXYgfSBmcm9tIFwiLi4vZG9tL2RvbVwiO1xuaW1wb3J0IHsgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zIH0gZnJvbSBcIi4uL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIEZvcm1WaWV3KGtleXMsIG1vZGU6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IGZpZWxkcyA9IGtleXMubWFwKGtleSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IFwiYm9keVR5cGVcIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmtleXMoQm9keVR5cGVzKS5maWx0ZXIoeCA9PiBpc05hTihOdW1iZXIoeCkpKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwgXCJib2R5IHR5cGVcIik7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZTogXCJib2R5VHlwZVwiIH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSA9PT0gXCJ0cmFuc21pc3Npb25cIikge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gT2JqZWN0LmtleXMoVHJhbnNtaXNzaW9ucykuZmlsdGVyKHggPT4gaXNOYU4oTnVtYmVyKHgpKSk7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIFwidHJhbnNtaXNzaW9uXCIpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IFwidHJhbnNtaXNzaW9uXCIgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIGtleS5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCAnJDEgJDInKS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgY29uc3QgY3VycmVudElucHV0ID0gaW5wdXQoeyB0eXBlOiBcInRleHRcIiwgbmFtZToga2V5IH0pO1xuICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50SW5wdXQpO1xuICAgIH0pO1xuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY29uZmlybVwiLCB0eXBlOiBcInN1Ym1pdFwiLCBpZDogXCJjcmVhdGVcIiB9LCBcIkFkZCBDYXJcIik7XG4gICAgY29uc3QgY2FuY2VsQnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjYW5jZWxcIiwgdHlwZTogXCJyZXNldFwiIH0sIFwiQ2FuY2VsXCIpO1xuICAgIGNvbnN0IGJ1dHRvbldyYXBwZXJEaXYgPSBkaXYoe30sIHN1Ym1pdEJ0biwgY2FuY2VsQnRuKTtcbiAgICByZXR1cm4gZm9ybSh7IGNsYXNzTmFtZTogXCJhbGlnblwiLCBpZDogXCJjcmVhdGVcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL1N0b3JhZ2VcIjtcbmltcG9ydCB7IEJvZHlUeXBlcywgQ2FyLCBJVmVoaWNsZSB9IGZyb20gXCIuL3ZlaGljbGVcIjtcbmltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgRWRpdG9yIH0gZnJvbSBcIi4vZG9tL0VkaXRvclwiO1xuaW1wb3J0IHsgRm9ybVZpZXcgfSBmcm9tIFwiLi92aWV3cy9Gb3JtVmlld1wiO1xuaW1wb3J0IHsgRWRpdEZvcm0gfSBmcm9tIFwiLi92aWV3cy9FZGl0Rm9ybVwiO1xuaW1wb3J0IHsgZ2V0TG9jYXRpb24gfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiLi9kb20vVGFibGVcIjtcbmltcG9ydCB7IHRyLCB0ZCwgc3BhbiwgYnV0dG9uIH0gZnJvbSBcIi4vZG9tL2RvbVwiO1xuXG5sZXQgZWRpdElkID0gbnVsbDtcblxuY29uc3QgbHMgPSBuZXcgTG9jYWxTdG9yYWdlKCk7XG5cbmxldCBpc0VkaXRpbmcgPSBmYWxzZTtcblxuY29uc3QgYWN0aW9uQnV0dG9uID1kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aW9uIG5ld1wiKVswXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuaW5pdGlhbGl6ZSgpO1xuXG5hY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAoZS50YXJnZXQgYXMgSFRNTEJ1dHRvbkVsZW1lbnQpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICBjb25zdCBlZGl0Rm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZWRpdFwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICB0b2dnbGVGb3JtcyhlZGl0Rm9ybSwgY3JlYXRlRm9ybSk7XG5cbiAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGUpO1xuICAgfSlcbn0pO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKCl7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5ldyBDYXIoXCJhXCIsIFwiYlwiLCBcImNcIikpLmZpbHRlcihrZXkgPT4ga2V5ICE9PSBcImlkXCIpO1xuICAgIGNvbnN0IHsgbmV3RWRpdG9yLCBodG1sIH0gPSBnZXRFZGl0b3Ioa2V5cywgRm9ybVZpZXcsIDEpO1xuICAgIG5ld0VkaXRvci5hcHBlbmRDaGlsZChodG1sKVxuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgY3JlYXRlRm9ybS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJyZWRcIjtcbiAgICBsZXQgZWRpdG9yID0gbmV3IEVkaXRvcihjcmVhdGVGb3JtLCBvblN1Ym1pdCwga2V5cyxhY3Rpb25CdXR0b24pOyBcblxuICAgIGNvbnN0IHsgbmV3RWRpdG9yOiB1cGRhdGVFZGl0b3IsIGh0bWw6IGh0bWwyIH0gPSBnZXRFZGl0b3Ioa2V5cywgRWRpdEZvcm0sIDIpXG4gICAgY29uc3QgcmVmZXJlbmNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpIGFzIEhUTUxFbGVtZW50O1xuICAgIHVwZGF0ZUVkaXRvci5pbnNlcnRCZWZvcmUoaHRtbDIsIHJlZmVyZW5jZSk7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIGVkaXRGb3JtLnN0eWxlLmJhY2tncm91bmQgPSBcInllbGxvd1wiO1xuICAgIGVkaXRvciA9IG5ldyBFZGl0b3IoZWRpdEZvcm0sIG9uRWRpdCwga2V5cyxhY3Rpb25CdXR0b24pO1xuICAgIFsuLi4oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmVkaXRvciBmb3JtJykgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4pXS5mb3JFYWNoKGVsPT5lbC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiKTtcbn1cblxuY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGFibGUnKVswXTtcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlQ2FyUm93LCBpZGVudGlmeSk7XG5cbmhpZHJhdGUodGFibGVNYW5hZ2VyKTtcblxuYXN5bmMgZnVuY3Rpb24gaGlkcmF0ZSh0YWJsZU1hbmFnZXI6IFRhYmxlKSB7XG4gICAgY29uc3QgY2FycyA9IGF3YWl0IGxzLmdldEFsbCgnY2FycycpO1xuICAgIGNhcnMuZm9yRWFjaChjYXIgPT4gdGFibGVNYW5hZ2VyLmFkZChjYXIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdG9yKGtleXM6IHN0cmluZ1tdLCB2aWV3LCBpbmRleCkge1xuICAgIGNvbnN0IGh0bWwgPSB2aWV3KGtleXMpO1xuICAgIGNvbnN0IG5ld0VkaXRvciA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZWRpdG9yJylbaW5kZXhdIGFzIEhUTUxFbGVtZW50KTtcbiAgICBuZXdFZGl0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICByZXR1cm4geyBuZXdFZGl0b3IsIGh0bWwgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlRm9ybXMoZWRpdEZvcm06IEhUTUxGb3JtRWxlbWVudCwgY3JlYXRlRm9ybTogSFRNTEZvcm1FbGVtZW50KSB7XG4gICAgaWYgKGlzRWRpdGluZykge1xuICAgICAgICBlZGl0Rm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlZGl0Rm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNyZWF0ZUZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3RlbkZvclRhYmxlY2xpY2soZTogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICBjb25zdCBidG5UZXh0ID0gdGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICBpZiAoYnRuVGV4dCA9PSBcIkVkaXRcIikge1xuICAgICAgICAgICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IChlLnRhcmdldCBhcyBIVE1MRWxlbWVudCkucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG4gICAgICAgICAgICBlZGl0SWQgPSBhY3RpdmF0ZWRSb3cuY2hpbGRyZW5bMF0udGV4dENvbnRlbnQ7XG4gICAgICAgICAgICBjb25zdCBrZXlzID0gW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwiYm9keVR5cGVcIiwgXCJudW1iZXJPZlNlYXRzXCIsIFwidHJhbnNtaXNzaW9uXCIsIFwicmVudGFsUHJpY2VcIl07XG4gICAgICAgICAgICBjb25zdCByZWNvcmQgPSBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3csIGtleXMpO1xuICAgICAgICAgICAgY29uc3QgY3JlYXRlRm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3JlYXRlXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgIGtleXMuZm9yRWFjaChrZXkgPT4gZWRpdEZvcm1ba2V5XS52YWx1ZSA9IHJlY29yZFtrZXldKTtcbiAgICAgICAgICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBrZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBbLi4uYWN0aXZhdGVkUm93LmNoaWxkcmVuXS5zbGljZSgxKS5yZWR1Y2UoKGEsIGIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICBpZiAoa2V5ID09PSBcInJlbnRhbFByaWNlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gYi50ZXh0Q29udGVudC5tYXRjaChyKTtcbiAgICAgICAgICAgIGFba2V5XSA9IE51bWJlcihwcmljZVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiLnRleHRDb250ZW50O1xuXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSwge30pO1xufVxuXG5mdW5jdGlvbiBpZGVudGlmeShjYXJzOiBJVmVoaWNsZVtdLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNhcnMuZmluZChlID0+IGUuaWQgPT0gaWQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDYXJSb3coY2FyOiBDYXIpIHtcbiAgICBjb25zb2xlLmxvZyhjYXIpO1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKGNhcikpO1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5lbnRyaWVzKGNhcikpO1xuICAgIGNvbnN0IHJvdyA9IHRyKHt9LFxuICAgICAgICB0ZCh7fSwgY2FyLmlkKSxcbiAgICAgICAgdGQoe30sIGNhci5tYWtlKSxcbiAgICAgICAgdGQoe30sIGNhci5tb2RlbCksXG4gICAgICAgIHRkKHt9LCBCb2R5VHlwZXNbY2FyLmJvZHlUeXBlXSksXG4gICAgICAgIHRkKHt9LCBjYXIubnVtYmVyT2ZTZWF0cy50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGNhci50cmFuc21pc3Npb24udG9TdHJpbmcoKSksXG4gICAgICAgIHRkKHt9LCBgJCR7Y2FyLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBlZGl0XCIgfSwgJ0VkaXQnKSwgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBkZWxldGVcIiB9LCAnRGVsZXRlJykpXG4gICAgKTtcblxuICAgIHJldHVybiByb3c7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uU3VibWl0KGRhdGEpIHtcbiAgICBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICB0cnkge1xuICAgICAgICBscy5jcmVhdGUodHlwZSwgbmV3IENhcihkYXRhLmlkLCBkYXRhLm1ha2UsIGRhdGEubW9kZWwpKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBhbGVydChlcnJvcik7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBvbkVkaXQoZGF0YSkge1xuICAgIGFsZXJ0KCdpbiBFZGl0Li4uJylcbiAgICB0cnkge1xuICAgICAgICBhd2FpdCBscy51cGRhdGUoJ2NhcnMnLCBlZGl0SWQsIGRhdGEpO1xuICAgICAgICBjb25zdCBuZXdSZWNvcmQgPWF3YWl0IGxzLmdldEJ5SWQoJ2NhcnMnLGVkaXRJZCk7XG4gICAgICAgIHRhYmxlTWFuYWdlci5yZXBsYWNlKGVkaXRJZCxuZXdSZWNvcmQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKVxuICAgIH0gICBcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=