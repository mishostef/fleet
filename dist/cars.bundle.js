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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixLQUFLLENBQUMsS0FBSyxDQUFDO0tBQ2Y7QUFDTCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vRWRpdG9yLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRWRpdEZvcm0udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmlld3MvRm9ybVZpZXcudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9jYXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuXG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIEVkaXRvciB7XG4gICAgcHJpdmF0ZSByZWNvcmRzOiBhbnlbXSA9IFtdO1xuICAgIHByaXZhdGUgcm93czogTWFwPG9iamVjdCwgSFRNTFRhYmxlUm93RWxlbWVudD4gPSBuZXcgTWFwKCk7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBmb3JtOiBIVE1MRm9ybUVsZW1lbnQsXG4gICAgICAgIHByaXZhdGUgY2FsbGJhY2s6IChkYXRhOiBvYmplY3QpID0+IGFueSxcbiAgICAgICAgcHJpdmF0ZSBwcm9wTmFtZXM6IHN0cmluZ1tdLCBvcmlnaW5hdG9yPzogSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMub25TdWJtaXQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuZm9ybS5hZGRFdmVudExpc3RlbmVyKCdyZXNldCcsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZvcm0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgaWYgKG9yaWdpbmF0b3IpIG9yaWdpbmF0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBvblN1Ym1pdChldmVudDogU3VibWl0RXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEodGhpcy5mb3JtKTtcbiAgICAgICAgY29uc3QgYm9keVR5cGUgPSBmb3JtRGF0YS5nZXQoJ2JvZHlUeXBlJyk7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBPYmplY3QuZnJvbUVudHJpZXModGhpcy5wcm9wTmFtZXMubWFwKG4gPT4gW24sIGZvcm1EYXRhLmdldChuKV0pKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuY2FsbGJhY2soZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH1cblxuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4gey8vL2FkZGVkIGRlbGV0ZSBmdW5jdGlvbmFsaXR5XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChlLnRhcmdldC50ZXh0Q29udGVudCA9PT0gXCJEZWxldGVcIikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSBlLnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgYXMgSFRNTFRhYmxlUm93RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgcm93SW5kZXggPSBhY3RpdmF0ZWRSb3cucm93SW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVSb3cgPSB0aGlzLnJlY29yZHNbcm93SW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGRlbGV0ZVJvd1tcImlkXCJdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29uZmlybShgQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGRlbGV0ZSAke2lkfWApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZShpZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYWRkKHJlY29yZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuY3JlYXRlUm93KHJlY29yZCk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChyb3cpO1xuICAgICAgICB0aGlzLnJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgcm93KTtcbiAgICB9XG5cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID0gaWQpO1xuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBmID0gdGhpcy5jcmVhdGVSb3cuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgbmV3Um93ID0gZihuZXdSZWNvcmQpO1xuICAgICAgICAvLyByb3cucmVwbGFjZVdpdGgobmV3Um93KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChuZXdSb3csIHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzLml0ZW0oaW5kZXggKyAxKSk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxLCBuZXdSZWNvcmQpO1xuICAgIH1cblxuICAgIHJlbW92ZShpZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvdyhpZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnJvd3MuZGVsZXRlKHJlY29yZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbn0iLCJ0eXBlIERvbUNvbnRlbnQgPSBzdHJpbmcgfCBOb2RlO1xuXG50eXBlIGVsZW1lbnRGYWN0b3J5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSAocHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkgPT4gVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbSh0eXBlOiBzdHJpbmcsIHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lID0gcHJvcE5hbWUuc2xpY2UoNCwgNSkudG9Mb3dlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDUpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldFtkYXRhTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgY29uc3QgdGFibGU6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RhYmxlJyk7XG5leHBvcnQgY29uc3QgdGhlYWQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IHRib2R5OiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGJvZHknKTtcbmV4cG9ydCBjb25zdCB0cjogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlUm93RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndHInKTtcbmV4cG9ydCBjb25zdCB0aDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoJyk7XG5leHBvcnQgY29uc3QgdGQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0ZCcpO1xuZXhwb3J0IGNvbnN0IGJ1dHRvbjogZWxlbWVudEZhY3Rvcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IHNwYW46IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3BhbicpOy8vL1xuZXhwb3J0IGNvbnN0IGxhYmVsOiBlbGVtZW50RmFjdG9yeTxIVE1MTGFiZWxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IGlucHV0OiBlbGVtZW50RmFjdG9yeTxIVE1MSW5wdXRFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdDogZWxlbWVudEZhY3Rvcnk8SFRNTFNlbGVjdEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IG9wdGlvbjogZWxlbWVudEZhY3Rvcnk8SFRNTE9wdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IGZvcm06IGVsZW1lbnRGYWN0b3J5PEhUTUxGb3JtRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZm9ybScpO1xuZXhwb3J0IGNvbnN0IGRpdjogZWxlbWVudEZhY3Rvcnk8SFRNTERpdkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2RpdicpOyIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTpzdHJpbmd7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywnJykuc3BsaXQoJy4nKVswXTtcbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYWtlOiBzdHJpbmc7XG4gICAgbW9kZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ2FyIGV4dGVuZHMgSVZlaGljbGUsIENhclBhcmFtc3tcbiAgICAgXG59XG5cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBCb2R5VHlwZXMuc2VkYW47XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSA0O1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBUcmFuc21pc3Npb25zLmF1dG9tYXRpYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgfVxufSIsImltcG9ydCB7IHNwYW4sIGlucHV0LCBsYWJlbCwgc2VsZWN0LCBvcHRpb24sIGJ1dHRvbiwgZm9ybSwgZGl2IH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IEJvZHlUeXBlcywgVHJhbnNtaXNzaW9ucyB9IGZyb20gXCIuLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBFZGl0Rm9ybShrZXlzLCBtb2RlOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBjb25zdCBmaWVsZHMgPSBrZXlzLm1hcChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBcImJvZHlUeXBlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC5rZXlzKEJvZHlUeXBlcykuZmlsdGVyKHggPT4gaXNOYU4oTnVtYmVyKHgpKSk7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdmFsdWVzLm1hcCh2YWwgPT4gb3B0aW9uKHsgdmFsdWU6IHZhbCwgdGV4dENvbnRlbnQ6IHZhbCB9KSk7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U3BhbiA9IHNwYW4oe30sIFwiYm9keSB0eXBlXCIpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdCA9IHNlbGVjdCh7IG5hbWU6IFwiYm9keVR5cGVcIiB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgPT09IFwidHJhbnNtaXNzaW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC5rZXlzKFRyYW5zbWlzc2lvbnMpLmZpbHRlcih4ID0+IGlzTmFOKE51bWJlcih4KSkpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBcInRyYW5zbWlzc2lvblwiKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBcInRyYW5zbWlzc2lvblwiIH0sIC4uLm9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudFNlbGVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBrZXkucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxICQyJykudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbnB1dCA9IGlucHV0KHsgdHlwZTogXCJ0ZXh0XCIsIG5hbWU6IGtleSB9KTtcbiAgICAgICAgcmV0dXJuIGxhYmVsKHt9LCBjdXJyZW50U3BhbiwgY3VycmVudElucHV0KTtcbiAgICB9KTtcbiAgICBjb25zdCBlZGl0QnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjb25maXJtXCIsIHR5cGU6IFwic3VibWl0XCIsIGlkOiBcImVkaXRcIiB9LCBcIlNhdmUgQ2FyXCIpO1xuICAgIGNvbnN0IGNhbmNlbEJ0biA9IGJ1dHRvbih7IGNsYXNzTmFtZTogXCJhY3Rpb24gY2FuY2VsXCIsIHR5cGU6IFwicmVzZXRcIiB9LCBcIkNhbmNlbFwiKTtcbiAgICBjb25zdCBidXR0b25XcmFwcGVyRGl2ID0gZGl2KHt9LCBlZGl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImVkaXRcIiB9LCAuLi5maWVsZHMsIGJ1dHRvbldyYXBwZXJEaXYpXG59XG4iLCJpbXBvcnQgeyBzcGFuLCBpbnB1dCwgbGFiZWwsIHNlbGVjdCwgb3B0aW9uLCBidXR0b24sIGZvcm0sIGRpdiB9IGZyb20gXCIuLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMgfSBmcm9tIFwiLi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gRm9ybVZpZXcoa2V5cywgbW9kZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgY29uc3QgZmllbGRzID0ga2V5cy5tYXAoa2V5ID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJib2R5VHlwZVwiKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3Qua2V5cyhCb2R5VHlwZXMpLmZpbHRlcih4ID0+IGlzTmFOKE51bWJlcih4KSkpO1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHZhbHVlcy5tYXAodmFsID0+IG9wdGlvbih7IHZhbHVlOiB2YWwsIHRleHRDb250ZW50OiB2YWwgfSkpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudFNwYW4gPSBzcGFuKHt9LCBcImJvZHkgdHlwZVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3QgPSBzZWxlY3QoeyBuYW1lOiBcImJvZHlUeXBlXCIgfSwgLi4ub3B0aW9ucyk7XG4gICAgICAgICAgICByZXR1cm4gbGFiZWwoe30sIGN1cnJlbnRTcGFuLCBjdXJyZW50U2VsZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ID09PSBcInRyYW5zbWlzc2lvblwiKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBPYmplY3Qua2V5cyhUcmFuc21pc3Npb25zKS5maWx0ZXIoeCA9PiBpc05hTihOdW1iZXIoeCkpKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB2YWx1ZXMubWFwKHZhbCA9PiBvcHRpb24oeyB2YWx1ZTogdmFsLCB0ZXh0Q29udGVudDogdmFsIH0pKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwgXCJ0cmFuc21pc3Npb25cIik7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0ID0gc2VsZWN0KHsgbmFtZTogXCJ0cmFuc21pc3Npb25cIiB9LCAuLi5vcHRpb25zKTtcbiAgICAgICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRTZWxlY3QpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTcGFuID0gc3Bhbih7fSwga2V5LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMSAkMicpLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5wdXQgPSBpbnB1dCh7IHR5cGU6IFwidGV4dFwiLCBuYW1lOiBrZXkgfSk7XG4gICAgICAgIHJldHVybiBsYWJlbCh7fSwgY3VycmVudFNwYW4sIGN1cnJlbnRJbnB1dCk7XG4gICAgfSk7XG4gICAgY29uc3Qgc3VibWl0QnRuID0gYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiBjb25maXJtXCIsIHR5cGU6IFwic3VibWl0XCIsIGlkOiBcImNyZWF0ZVwiIH0sIFwiQWRkIENhclwiKTtcbiAgICBjb25zdCBjYW5jZWxCdG4gPSBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGNhbmNlbFwiLCB0eXBlOiBcInJlc2V0XCIgfSwgXCJDYW5jZWxcIik7XG4gICAgY29uc3QgYnV0dG9uV3JhcHBlckRpdiA9IGRpdih7fSwgc3VibWl0QnRuLCBjYW5jZWxCdG4pO1xuICAgIHJldHVybiBmb3JtKHsgY2xhc3NOYW1lOiBcImFsaWduXCIsIGlkOiBcImNyZWF0ZVwiIH0sIC4uLmZpZWxkcywgYnV0dG9uV3JhcHBlckRpdilcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4vU3RvcmFnZVwiO1xuaW1wb3J0IHsgQm9keVR5cGVzLCBDYXIsIElWZWhpY2xlLCBUcmFuc21pc3Npb25zIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuaW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwiLi9kb20vRWRpdG9yXCI7XG5pbXBvcnQgeyBGb3JtVmlldyB9IGZyb20gXCIuL3ZpZXdzL0Zvcm1WaWV3XCI7XG5pbXBvcnQgeyBFZGl0Rm9ybSB9IGZyb20gXCIuL3ZpZXdzL0VkaXRGb3JtXCI7XG5pbXBvcnQgeyBnZXRMb2NhdGlvbiB9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCIuL2RvbS9UYWJsZVwiO1xuaW1wb3J0IHsgdHIsIHRkLCBzcGFuLCBidXR0b24gfSBmcm9tIFwiLi9kb20vZG9tXCI7XG5cbmxldCBlZGl0SWQgPSBudWxsO1xuXG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxubGV0IGlzRWRpdGluZyA9IGZhbHNlO1xuXG5jb25zdCBhY3Rpb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYWN0aW9uIG5ld1wiKVswXSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcblxuaW5pdGlhbGl6ZSgpO1xuXG5hY3Rpb25CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIGNvbnN0IGNyZWF0ZUZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNyZWF0ZVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG4gICAgKGUudGFyZ2V0IGFzIEhUTUxCdXR0b25FbGVtZW50KS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgY29uc3QgZWRpdEZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImVkaXRcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcblxuXG59KTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICBsaXN0ZW5Gb3JUYWJsZWNsaWNrKGUpO1xufSk7XG5mdW5jdGlvbiBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhuZXcgQ2FyKFwiYVwiLCBcImJcIiwgXCJjXCIpKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gXCJpZFwiKTtcbiAgICBjb25zdCB7IG5ld0VkaXRvciwgaHRtbCB9ID0gZ2V0RWRpdG9yKGtleXMsIEZvcm1WaWV3LCAxKTtcbiAgICBuZXdFZGl0b3IuYXBwZW5kQ2hpbGQoaHRtbClcbiAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgIGNyZWF0ZUZvcm0uc3R5bGUuYmFja2dyb3VuZCA9IFwicmVkXCI7XG4gICAgbGV0IGVkaXRvciA9IG5ldyBFZGl0b3IoY3JlYXRlRm9ybSwgb25TdWJtaXQsIGtleXMsIGFjdGlvbkJ1dHRvbik7XG5cbiAgICBjb25zdCB7IG5ld0VkaXRvcjogdXBkYXRlRWRpdG9yLCBodG1sOiBodG1sMiB9ID0gZ2V0RWRpdG9yKGtleXMsIEVkaXRGb3JtLCAyKVxuICAgIGNvbnN0IHJlZmVyZW5jZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4nKSBhcyBIVE1MRWxlbWVudDtcbiAgICB1cGRhdGVFZGl0b3IuaW5zZXJ0QmVmb3JlKGh0bWwyLCByZWZlcmVuY2UpO1xuICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICBlZGl0Rm9ybS5zdHlsZS5iYWNrZ3JvdW5kID0gXCJ5ZWxsb3dcIjtcbiAgICBsZXQgZTIgPSBuZXcgRWRpdG9yKGVkaXRGb3JtLCBvbkVkaXQsIGtleXMsIGFjdGlvbkJ1dHRvbik7XG4gICAgWy4uLihkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZWRpdG9yIGZvcm0nKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PildLmZvckVhY2goZWwgPT4gZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKTtcbn1cblxuY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGFibGUnKVswXTtcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlQ2FyUm93LCBpZGVudGlmeSk7XG5cbmhpZHJhdGUodGFibGVNYW5hZ2VyKTtcblxuYXN5bmMgZnVuY3Rpb24gaGlkcmF0ZSh0YWJsZU1hbmFnZXI6IFRhYmxlKSB7XG4gICAgY29uc3QgY2FycyA9IGF3YWl0IGxzLmdldEFsbCgnY2FycycpO1xuICAgIGNhcnMuZm9yRWFjaChjYXIgPT4gdGFibGVNYW5hZ2VyLmFkZChjYXIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0RWRpdG9yKGtleXM6IHN0cmluZ1tdLCB2aWV3LCBpbmRleCkge1xuICAgIGNvbnN0IGh0bWwgPSB2aWV3KGtleXMpO1xuICAgIGNvbnN0IG5ld0VkaXRvciA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZWRpdG9yJylbaW5kZXhdIGFzIEhUTUxFbGVtZW50KTtcbiAgICBuZXdFZGl0b3Iuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICByZXR1cm4geyBuZXdFZGl0b3IsIGh0bWwgfTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlRm9ybXMoZWRpdEZvcm06IEhUTUxGb3JtRWxlbWVudCwgY3JlYXRlRm9ybTogSFRNTEZvcm1FbGVtZW50KSB7XG4gICAgaWYgKGlzRWRpdGluZykge1xuICAgICAgICBlZGl0Rm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICBjcmVhdGVGb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBlZGl0Rm9ybS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGNyZWF0ZUZvcm0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3RlbkZvclRhYmxlY2xpY2soZTogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHRhcmdldCA9IGUudGFyZ2V0O1xuICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MQnV0dG9uRWxlbWVudCkge1xuICAgICAgICBjb25zdCBidG5UZXh0ID0gdGFyZ2V0LnRleHRDb250ZW50O1xuICAgICAgICBpZiAoYnRuVGV4dCA9PSBcIkVkaXRcIiB8fCBidG5UZXh0ID09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgIGlmIChidG5UZXh0ID09IFwiRWRpdFwiKSB7XG4gICAgICAgICAgICAgICAgaXNFZGl0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3RpdmF0ZWRSb3cgPSAoZS50YXJnZXQgYXMgSFRNTEVsZW1lbnQpLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgIGVkaXRJZCA9IGFjdGl2YXRlZFJvdy5jaGlsZHJlblswXS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXlzID0gW1wibWFrZVwiLCBcIm1vZGVsXCIsIFwiYm9keVR5cGVcIiwgXCJudW1iZXJPZlNlYXRzXCIsIFwidHJhbnNtaXNzaW9uXCIsIFwicmVudGFsUHJpY2VcIl07XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjb3JkID0gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93LCBrZXlzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjcmVhdGVcIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuICAgICAgICAgICAgICAgIGNvbnN0IGVkaXRGb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlZGl0XCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgICAgICBzZXRGb3JtVmFsdWVzKGtleXMsIGVkaXRGb3JtLCByZWNvcmQpO1xuICAgICAgICAgICAgICAgIHRvZ2dsZUZvcm1zKGVkaXRGb3JtLCBjcmVhdGVGb3JtKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYnRuVGV4dCA9PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgbHMuZGVsZXRlKCdjYXJzJywgZWRpdElkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0Rm9ybVZhbHVlcyhrZXlzOiBzdHJpbmdbXSwgZWRpdEZvcm06IEhUTUxGb3JtRWxlbWVudCwgcmVjb3JkOiB7fSkge1xuICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBcImJvZHlUeXBlXCIgfHwga2V5ID09PSBcInRyYW5zbWlzc2lvblwiKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RJdGVtcyA9IGtleSA9PT0gXCJib2R5VHlwZVwiID8gQm9keVR5cGVzIDogVHJhbnNtaXNzaW9ucztcbiAgICAgICAgICAgIChlZGl0Rm9ybVtrZXldIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5zZWxlY3RlZEluZGV4ID0gc2VsZWN0SXRlbXNba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlZGl0Rm9ybVtrZXldLnZhbHVlID0gcmVjb3JkW2tleV07XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFRhYmxlUmVjb3JkKGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCwga2V5czogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gWy4uLmFjdGl2YXRlZFJvdy5jaGlsZHJlbl0uc2xpY2UoMSkucmVkdWNlKChhLCBiLCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBrZXkgPSBrZXlzW2luZGV4XTtcbiAgICAgICAgaWYgKGtleSA9PT0gXCJyZW50YWxQcmljZVwiKSB7XG4gICAgICAgICAgICBjb25zdCByID0gLy0/XFxkKy87XG4gICAgICAgICAgICBjb25zdCBwcmljZSA9IGIudGV4dENvbnRlbnQubWF0Y2gocik7XG4gICAgICAgICAgICBhW2tleV0gPSBOdW1iZXIocHJpY2VbMF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYVtrZXldID0gYi50ZXh0Q29udGVudDtcblxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH0sIHt9KTtcbn1cblxuZnVuY3Rpb24gaWRlbnRpZnkoY2FyczogSVZlaGljbGVbXSwgaWQ6IHN0cmluZykge1xuICAgIHJldHVybiBjYXJzLmZpbmQoZSA9PiBlLmlkID09IGlkKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2FyUm93KGNhcjogQ2FyKSB7XG4gICAgY29uc29sZS5sb2coY2FyKTtcbiAgICBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhjYXIpKTtcbiAgICBjb25zb2xlLmxvZyhPYmplY3QuZW50cmllcyhjYXIpKTtcbiAgICBjb25zdCByb3cgPSB0cih7fSxcbiAgICAgICAgdGQoe30sIGNhci5pZCksXG4gICAgICAgIHRkKHt9LCBjYXIubWFrZSksXG4gICAgICAgIHRkKHt9LCBjYXIubW9kZWwpLFxuICAgICAgICB0ZCh7fSwgQm9keVR5cGVzW2Nhci5ib2R5VHlwZV0pLFxuICAgICAgICB0ZCh7fSwgY2FyLm51bWJlck9mU2VhdHMudG9TdHJpbmcoKSksXG4gICAgICAgIHRkKHt9LCBUcmFuc21pc3Npb25zW2Nhci50cmFuc21pc3Npb25dKSxcbiAgICAgICAgdGQoe30sIGAkJHtjYXIucmVudGFsUHJpY2UudG9TdHJpbmcoKX0vZGF5YCksXG4gICAgICAgIHRkKHt9LCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGVkaXRcIiB9LCAnRWRpdCcpLCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGRlbGV0ZVwiIH0sICdEZWxldGUnKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHJvdztcbn1cblxuYXN5bmMgZnVuY3Rpb24gb25TdWJtaXQoZGF0YSkge1xuICAgIGRhdGEuaWQgPSBnZW5lcmF0ZUlkKCk7XG4gICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpO1xuICAgIHRyeSB7XG4gICAgICAgIGxzLmNyZWF0ZSh0eXBlLCBuZXcgQ2FyKGRhdGEuaWQsIGRhdGEubWFrZSwgZGF0YS5tb2RlbCkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGFsZXJ0KGVycm9yKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uRWRpdChkYXRhKSB7XG4gICAgYWxlcnQoJ2luIEVkaXQuLi4nKVxuICAgIHRyeSB7XG4gICAgICAgIGRhdGFbXCJib2R5VHlwZVwiXSA9IEJvZHlUeXBlc1tkYXRhW1wiYm9keVR5cGVcIl1dO1xuICAgICAgICBkYXRhW1widHJhbnNtaXNzaW9uXCJdID0gVHJhbnNtaXNzaW9uc1tkYXRhW1widHJhbnNtaXNzaW9uXCJdXTtcbiAgICAgICAgY29uc3QgbmV3UmVjb3JkID0geyAuLi5hd2FpdCBscy5nZXRCeUlkKCdjYXJzJywgZWRpdElkKSwgLi4uZGF0YSB9O1xuICAgICAgICB0YWJsZU1hbmFnZXIucmVwbGFjZShlZGl0SWQsIG5ld1JlY29yZCk7XG4gICAgICAgIGF3YWl0IGxzLnVwZGF0ZSgnY2FycycsIGVkaXRJZCwgZGF0YSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoZXJyb3IpXG4gICAgfVxufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==