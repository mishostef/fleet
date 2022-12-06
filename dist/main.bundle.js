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

/***/ "./src/maintypes.ts":
/*!**************************!*\
  !*** ./src/maintypes.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "overviewOptions": () => (/* binding */ overviewOptions)
/* harmony export */ });
var overviewOptions;
(function (overviewOptions) {
    overviewOptions[overviewOptions["all"] = 0] = "all";
    overviewOptions[overviewOptions["cars"] = 1] = "cars";
    overviewOptions[overviewOptions["trucks"] = 2] = "trucks";
})(overviewOptions || (overviewOptions = {}));


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

/***/ "./src/views/createOverviewRow.ts":
/*!****************************************!*\
  !*** ./src/views/createOverviewRow.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createOverviewRow": () => (/* binding */ createOverviewRow)
/* harmony export */ });
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom/dom */ "./src/dom/dom.ts");

function createOverviewRow(extendedVehicle) {
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, extendedVehicle.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, extendedVehicle.type), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, extendedVehicle.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, extendedVehicle.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, `$${extendedVehicle.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, extendedVehicle.status), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.a)({ href: `/details.html?id=${extendedVehicle.id}` }, "Details")));
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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _dom_Table__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom/Table */ "./src/dom/Table.ts");
/* harmony import */ var _views_createOverviewRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./views/createOverviewRow */ "./src/views/createOverviewRow.ts");
/* harmony import */ var _maintypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./maintypes */ "./src/maintypes.ts");




const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
const form = document.getElementById("overviewForm");
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const selectedCollection = isNaN(Number(type)) ? type : _maintypes__WEBPACK_IMPORTED_MODULE_3__.overviewOptions[Number(type)];
const showAvailable = (urlParams.get("availableOnly"));
const table = document.getElementsByTagName('table')[0];
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_1__.Table(table, _views_createOverviewRow__WEBPACK_IMPORTED_MODULE_2__.createOverviewRow, identify);
(async function initialize() {
    const records = await getRecordsByQuery();
    hidrate(tableManager, records);
    form.addEventListener("submit", async function (e) {
        let records = await getRecordsByQuery();
        tableManager.clear();
        hidrate(tableManager, records);
    });
}());
async function getRecordsByQuery() {
    let records = selectedCollection === "all" || selectedCollection === null || selectedCollection === "0" ?
        await getAllTableRecords() :
        (await ls.getAll(selectedCollection)).map(vehicle => {
            vehicle.type = selectedCollection.slice(0, -1);
            return vehicle;
        }).map(createOverviewTableRecord);
    if (showAvailable) {
        records = records.filter(rec => rec.status === "Available");
    }
    return records;
}
async function getAllTableRecords() {
    const lsValues = await ls.getAllCollectionsData();
    const allVehicles = [].concat.apply([], lsValues);
    const tableRecords = allVehicles.map(createOverviewTableRecord);
    return tableRecords;
}
function createOverviewTableRecord(vehicle) {
    return {
        id: vehicle.id,
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        rentalPrice: vehicle.rentalPrice,
        status: vehicle.rentedTo ? "Rented" : "Available"
    };
}
async function hidrate(tableManager, records) {
    const vehicles = records ? records : await getAllTableRecords();
    vehicles.forEach(vehicle => tableManager.add(vehicle));
}
function identify(cars, id) {
    return cars.find(e => e.id == id);
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVcsRUFBRSxPQUFPLENBQUMsV0FBVztRQUNoQyxNQUFNLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXO0tBQ3BEO0FBQ0wsQ0FBQztBQUVELEtBQUssVUFBVSxPQUFPLENBQUMsWUFBbUIsRUFBRSxPQUEwQjtJQUNsRSxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxrQkFBa0IsRUFBRSxDQUFDO0lBQ2hFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUdELFNBQVMsUUFBUSxDQUFDLElBQWdCLEVBQUUsRUFBVTtJQUMxQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL21haW50eXBlcy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92ZWhpY2xlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZpZXdzL2NyZWF0ZU92ZXJ2aWV3Um93LnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICAvL3B1YmxpYyBhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogSFRNTFRhYmxlRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVSb3c6IChyZWNvcmQ6IGFueSkgPT4gSFRNTFRhYmxlUm93RWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmeT86IChyZWNvcmRzOiBhbnlbXSwgaWQ6IGFueSkgPT4gYW55LFxuICAgICAgICByZWNvcmRzPzogYW55W11cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICBpZiAocmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZHMuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGFjdGl2YXRlZFJvdy5yb3dJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJvdyA9IHRoaXMucmVjb3Jkc1tyb3dJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gZGVsZXRlUm93W1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlICR7aWR9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQocmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVSb3cocmVjb3JkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCByb3cpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB9XG4gICAgZ2V0KGlkOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpZnkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pZGVudGlmeSh0aGlzLnJlY29yZHMsIGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbmRldGl0eSBmdW5jdGlvbiBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgZ2V0Um93KGlkOiBhbnkpOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzLmdldChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJlcGxhY2UoaWQ6IGFueSwgbmV3UmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICAvL2NvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBbLi4udGhpcy5yb3dzLmtleXMoKV0uZmluZEluZGV4KHggPT4geFsnaWQnXSA9PT0gaWQpO1xuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBmID0gdGhpcy5jcmVhdGVSb3cuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgbmV3Um93ID0gZihuZXdSZWNvcmQpO1xuICAgICAgICAvLyByb3cucmVwbGFjZVdpdGgobmV3Um93KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChuZXdSb3csIHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzLml0ZW0oaW5kZXggKyAxKSk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxLCBuZXdSZWNvcmQpO1xuICAgIH1cblxuICAgIHJlbW92ZShpZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvdyhpZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnJvd3MuZGVsZXRlKHJlY29yZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbn0iLCJ0eXBlIERvbUNvbnRlbnQgPSBzdHJpbmcgfCBOb2RlO1xuXG50eXBlIGVsZW1lbnRGYWN0b3J5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSAocHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkgPT4gVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbSh0eXBlOiBzdHJpbmcsIHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lID0gcHJvcE5hbWUuc2xpY2UoNCwgNSkudG9Mb3dlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDUpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldFtkYXRhTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgY29uc3QgdGFibGU6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RhYmxlJyk7XG5leHBvcnQgY29uc3QgdGhlYWQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IHRib2R5OiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGJvZHknKTtcbmV4cG9ydCBjb25zdCB0cjogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlUm93RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndHInKTtcbmV4cG9ydCBjb25zdCB0aDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoJyk7XG5leHBvcnQgY29uc3QgdGQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0ZCcpO1xuZXhwb3J0IGNvbnN0IGJ1dHRvbjogZWxlbWVudEZhY3Rvcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IHNwYW46IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3BhbicpOy8vL1xuZXhwb3J0IGNvbnN0IGxhYmVsOiBlbGVtZW50RmFjdG9yeTxIVE1MTGFiZWxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IGlucHV0OiBlbGVtZW50RmFjdG9yeTxIVE1MSW5wdXRFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdDogZWxlbWVudEZhY3Rvcnk8SFRNTFNlbGVjdEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IG9wdGlvbjogZWxlbWVudEZhY3Rvcnk8SFRNTE9wdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IGZvcm06IGVsZW1lbnRGYWN0b3J5PEhUTUxGb3JtRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZm9ybScpO1xuZXhwb3J0IGNvbnN0IGRpdjogZWxlbWVudEZhY3Rvcnk8SFRNTERpdkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2RpdicpO1xuZXhwb3J0IGNvbnN0IGE6IGVsZW1lbnRGYWN0b3J5PEhUTUxBbmNob3JFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdhJyk7XG5leHBvcnQgY29uc3QgcDogZWxlbWVudEZhY3Rvcnk8SFRNTFBhcmFncmFwaEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3AnKTtcbmV4cG9ydCBjb25zdCBoMzogZWxlbWVudEZhY3Rvcnk8SFRNTEhlYWRpbmdFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdoMycpO1xuZXhwb3J0IGNvbnN0IHN0cm9uZzogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzdHJvbmcnKTsiLCJleHBvcnQgaW50ZXJmYWNlIElUeXBlIHtcbiAgICB0eXBlOiBzdHJpbmc7XG59XG5leHBvcnQgZW51bSBvdmVydmlld09wdGlvbnMge1xuICAgIFwiYWxsXCIsXG4gICAgXCJjYXJzXCIsXG4gICAgXCJ0cnVja3NcIlxufVxuZXhwb3J0IGludGVyZmFjZSBJU3RhdHVzIHtcbiAgICBzdGF0dXM6IFwiUmVudGVkXCIgfCBcIkF2YWlsYWJsZVwiXG59IiwiaW1wb3J0IHsgQ2FyZ29UeXBlcywgQm9keVR5cGVzLCBUcmFuc21pc3Npb25zLCBDYXIsIFRydWNrIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVJZCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGZ1bmMgPSAoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNjc3NzIxNSkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiBgJHtmdW5jKCl9LSR7ZnVuYygpfWBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvY2F0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywgJycpLnNwbGl0KCcuJylbMF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbnVtKCk6IGFueSB7XG4gICAgY29uc3QgdHlwZSA9IGdldExvY2F0aW9uKCkuc2xpY2UoMCwgLTEpOy8vdHJ1Y2tcbiAgICBjb25zdCBrdnAgPSB7XG4gICAgICAgIFwidHJ1Y2tcIjogW3sgY2FyZ29UeXBlOiBDYXJnb1R5cGVzIH1dLFxuICAgICAgICBcImNhclwiOiBbeyBib2R5VHlwZTogQm9keVR5cGVzIH0sIHsgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zIH1dXG4gICAgfVxuICAgIHJldHVybiBrdnBbdHlwZV07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDbGFzcyh0eXBlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHsgaWQsIG1ha2UsIG1vZGVsLCAuLi5yZXN0IH0gPSBkYXRhO1xuICAgIHJldHVybiB0eXBlID09PSBcImNhclwiID8gbmV3IENhcihpZCwgbWFrZSwgbW9kZWwsIHJlc3QpIDogbmV3IFRydWNrKGlkLCBtYWtlLCBtb2RlbCwgcmVzdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBTZWxlY3RzVG9WYWx1ZXMoZGF0YTogYW55KSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAgZW51bXMuZm9yRWFjaChlbiA9PiB7XG4gICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgIGNvbnN0IGVudW1WYWxzU3RyaW5nID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgIGNvbnN0IGVudW1WYWxzTnVtYmVyID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gIWlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0VmFsdWUgPSBkYXRhW2VudW1LZXldO1xuICAgICAgICBjb25zdCBpbmRleCA9IGVudW1WYWxzU3RyaW5nLmluZGV4T2YoY3VycmVudFNlbGVjdFZhbHVlKTtcbiAgICAgICAgZGF0YVtlbnVtS2V5XSA9IGVudW1WYWxzTnVtYmVyW2luZGV4XTtcblxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Rm9ybVZhbHVlcyhrZXlzOiBzdHJpbmdbXSwgZWRpdEZvcm06IEhUTUxGb3JtRWxlbWVudCwgcmVjb3JkOiB7fSkge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuICAgIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBlbnVtcy5mb3JFYWNoKGVuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVudW1LZXkgPSBPYmplY3Qua2V5cyhlbilbMF07XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBlbnVtS2V5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bVZhbHNTdHJpbmcgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnVtVmFsc051bWJlciA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+ICFpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0VmFsdWUgPSByZWNvcmRbZW51bUtleV07XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBlbnVtVmFsc1N0cmluZy5pbmRleE9mKGN1cnJlbnRTZWxlY3RWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAoZWRpdEZvcm1ba2V5XSBhcyBIVE1MU2VsZWN0RWxlbWVudCkuc2VsZWN0ZWRJbmRleCA9IE51bWJlcihlbnVtVmFsc051bWJlcltpbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZWRpdEZvcm1ba2V5XS52YWx1ZSA9IHJlY29yZFtrZXldO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGFibGVSZWNvcmQoYWN0aXZhdGVkUm93OiBIVE1MVGFibGVSb3dFbGVtZW50LCBrZXlzOiBzdHJpbmdbXSkge1xuICAgIHJldHVybiBbLi4uYWN0aXZhdGVkUm93LmNoaWxkcmVuXS5zbGljZSgxKS5yZWR1Y2UoKGEsIGIsIGluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgICBpZiAoa2V5ID09PSBcInJlbnRhbFByaWNlXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSAvLT9cXGQrLztcbiAgICAgICAgICAgIGNvbnN0IHByaWNlID0gYi50ZXh0Q29udGVudC5tYXRjaChyKTtcbiAgICAgICAgICAgIGFba2V5XSA9IE51bWJlcihwcmljZVswXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhW2tleV0gPSBiLnRleHRDb250ZW50O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhO1xuICAgIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWJlckZyb21TdHJpbmcoc3RyOiBzdHJpbmcpIDpudW1iZXJ7XG4gICAgY29uc3QgciA9IC8tP1xcZCsvO1xuICAgIGNvbnN0IG51bWJlcnMgPSBzdHIubWF0Y2gocik7XG4gICAgcmV0dXJuIE51bWJlcihudW1iZXJzWzBdKTtcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWFrZTogc3RyaW5nO1xuICAgIG1vZGVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWhpY2xlIGltcGxlbWVudHMgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIElDYXIgZXh0ZW5kcyBJVmVoaWNsZSwgQ2FyUGFyYW1zIHtcblxufVxuZXhwb3J0IGludGVyZmFjZSBJVHJ1Y2sgZXh0ZW5kcyBJVmVoaWNsZSwgVHJ1Y2tQYXJhbXMgeyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gY2FyUGFyYW1zLnJlbnRlZFRvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSBjYXJQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gQm9keVR5cGVzLnNlZGFuO1xuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gNDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gVHJhbnNtaXNzaW9ucy5hdXRvbWF0aWM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnVjayBleHRlbmRzIFZlaGljbGUge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgdHJ1Y2tQYXJhbXM/OiBUcnVja1BhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gMjtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQ2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FyZ29UeXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gdHJ1Y2tQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gdHJ1Y2tQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgdHIsIHRkLCBhIH0gZnJvbSBcIi4uL2RvbS9kb21cIjtcbmltcG9ydCB7IElWZWhpY2xlIH0gZnJvbSBcIi4uL3ZlaGljbGVcIjtcbmltcG9ydCB7IElUeXBlLCBJU3RhdHVzIH0gZnJvbSBcIi4uL21haW50eXBlc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT3ZlcnZpZXdSb3coZXh0ZW5kZWRWZWhpY2xlOiBJVmVoaWNsZSAmIElUeXBlICYgSVN0YXR1cykge1xuICAgIGNvbnN0IHJvdyA9IHRyKHt9LFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLmlkKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS50eXBlKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5tYWtlKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5tb2RlbCksXG4gICAgICAgIHRkKHt9LCBgJCR7ZXh0ZW5kZWRWZWhpY2xlLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLnN0YXR1cyksXG4gICAgICAgIHRkKHt9LCBhKHsgaHJlZjogYC9kZXRhaWxzLmh0bWw/aWQ9JHtleHRlbmRlZFZlaGljbGUuaWR9YCB9LCBcIkRldGFpbHNcIikpXG4gICAgKTtcblxuICAgIHJldHVybiByb3c7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9TdG9yYWdlXCI7XG5pbXBvcnQgeyBJVmVoaWNsZSB9IGZyb20gXCIuL3ZlaGljbGVcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyBjcmVhdGVPdmVydmlld1JvdyB9IGZyb20gXCIuL3ZpZXdzL2NyZWF0ZU92ZXJ2aWV3Um93XCI7XG5pbXBvcnQgeyBJVHlwZSwgb3ZlcnZpZXdPcHRpb25zIH0gZnJvbSBcIi4vbWFpbnR5cGVzXCI7XG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnZpZXdGb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbmNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5jb25zdCB0eXBlID0gdXJsUGFyYW1zLmdldCgndHlwZScpO1xuY29uc3Qgc2VsZWN0ZWRDb2xsZWN0aW9uID0gaXNOYU4oTnVtYmVyKHR5cGUpKSA/IHR5cGUgOiBvdmVydmlld09wdGlvbnNbTnVtYmVyKHR5cGUpXTtcbmNvbnN0IHNob3dBdmFpbGFibGUgPSAodXJsUGFyYW1zLmdldChcImF2YWlsYWJsZU9ubHlcIikpO1xuXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWJsZScpWzBdO1xuY29uc3QgdGFibGVNYW5hZ2VyID0gbmV3IFRhYmxlKHRhYmxlLCBjcmVhdGVPdmVydmlld1JvdywgaWRlbnRpZnkpO1xuXG4oYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCByZWNvcmRzID0gYXdhaXQgZ2V0UmVjb3Jkc0J5UXVlcnkoKTtcbiAgICBoaWRyYXRlKHRhYmxlTWFuYWdlciwgcmVjb3Jkcyk7XG4gICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGxldCByZWNvcmRzID0gYXdhaXQgZ2V0UmVjb3Jkc0J5UXVlcnkoKTtcbiAgICAgICAgdGFibGVNYW5hZ2VyLmNsZWFyKCk7XG4gICAgICAgIGhpZHJhdGUodGFibGVNYW5hZ2VyLCByZWNvcmRzKTtcbiAgICB9KTtcbn0oKSlcblxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJlY29yZHNCeVF1ZXJ5KCkge1xuICAgIGxldCByZWNvcmRzID0gc2VsZWN0ZWRDb2xsZWN0aW9uID09PSBcImFsbFwiIHx8IHNlbGVjdGVkQ29sbGVjdGlvbiA9PT0gbnVsbCB8fCBzZWxlY3RlZENvbGxlY3Rpb24gPT09IFwiMFwiID9cbiAgICAgICAgYXdhaXQgZ2V0QWxsVGFibGVSZWNvcmRzKCkgOlxuICAgICAgICAoYXdhaXQgbHMuZ2V0QWxsKHNlbGVjdGVkQ29sbGVjdGlvbikpLm1hcCh2ZWhpY2xlID0+IHtcbiAgICAgICAgICAgICh2ZWhpY2xlIGFzIGFueSkudHlwZSA9IHNlbGVjdGVkQ29sbGVjdGlvbi5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICByZXR1cm4gdmVoaWNsZTtcbiAgICAgICAgfSkubWFwKGNyZWF0ZU92ZXJ2aWV3VGFibGVSZWNvcmQpO1xuICAgIGlmIChzaG93QXZhaWxhYmxlKSB7XG4gICAgICAgIHJlY29yZHMgPSAocmVjb3JkcyBhcyBhbnkpLmZpbHRlcihyZWMgPT4gcmVjLnN0YXR1cyA9PT0gXCJBdmFpbGFibGVcIik7XG4gICAgfVxuICAgIHJldHVybiByZWNvcmRzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxUYWJsZVJlY29yZHMoKSB7XG4gICAgY29uc3QgbHNWYWx1ZXMgPSBhd2FpdCBscy5nZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTtcbiAgICBjb25zdCBhbGxWZWhpY2xlcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbHNWYWx1ZXMpO1xuICAgIGNvbnN0IHRhYmxlUmVjb3JkcyA9IGFsbFZlaGljbGVzLm1hcChjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKTtcbiAgICByZXR1cm4gdGFibGVSZWNvcmRzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKHZlaGljbGU6IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogdmVoaWNsZS5pZCxcbiAgICAgICAgdHlwZTogdmVoaWNsZS50eXBlLFxuICAgICAgICBtYWtlOiB2ZWhpY2xlLm1ha2UsXG4gICAgICAgIG1vZGVsOiB2ZWhpY2xlLm1vZGVsLFxuICAgICAgICByZW50YWxQcmljZTogdmVoaWNsZS5yZW50YWxQcmljZSxcbiAgICAgICAgc3RhdHVzOiB2ZWhpY2xlLnJlbnRlZFRvID8gXCJSZW50ZWRcIiA6IFwiQXZhaWxhYmxlXCJcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSwgcmVjb3Jkcz86IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICBjb25zdCB2ZWhpY2xlcyA9IHJlY29yZHMgPyByZWNvcmRzIDogYXdhaXQgZ2V0QWxsVGFibGVSZWNvcmRzKCk7XG4gICAgdmVoaWNsZXMuZm9yRWFjaCh2ZWhpY2xlID0+IHRhYmxlTWFuYWdlci5hZGQodmVoaWNsZSkpO1xufVxuXG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9