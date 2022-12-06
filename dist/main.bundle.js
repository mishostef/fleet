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
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _maintypes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./maintypes */ "./src/maintypes.ts");




const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
const form = document.getElementById("overviewForm");
const urlParams = new URLSearchParams(window.location.search);
const type = urlParams.get('type');
const selectedCollection = isNaN(Number(type)) ? type : _maintypes__WEBPACK_IMPORTED_MODULE_3__.overviewOptions[Number(type)];
const showAvailable = (urlParams.get("availableOnly"));
const table = document.getElementsByTagName('table')[0];
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_1__.Table(table, createOverviewRow, identify);
(async function () {
    const records = await getRecordsByQuery();
    hidrate(tableManager, records);
}());
form.addEventListener("submit", async function (e) {
    let records = await getRecordsByQuery();
    tableManager.clear();
    hidrate(tableManager, records);
});
async function getRecordsByQuery() {
    let records = selectedCollection === "all" || selectedCollection === null ?
        getAllTableRecords() :
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
function createOverviewRow(extendedVehicle) {
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.type), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, `$${extendedVehicle.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.status), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.a)({ href: `/details.html?id=${extendedVehicle.id}` }, "Details")));
    return row;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QzFCLDRDQUFFLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFDNUIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUM1Qiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQzdCLDRDQUFFLENBQUMsRUFBRSxFQUFFLElBQUksZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQ3hELDRDQUFFLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFDOUIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsMkNBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBb0IsZUFBZSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDM0UsQ0FBQztJQUVGLE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL1N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZG9tL1RhYmxlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9kb20udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbWFpbnR5cGVzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3ZlaGljbGUudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9tYWluLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGdlbmVyYXRlSWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuZXhwb3J0IHR5cGUgUmVjb3JkSWQgPSBzdHJpbmc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVjb3JkIHtcbiAgICBpZDogUmVjb3JkSWRcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmFnZSB7XG4gICAgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPjtcbiAgICBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSBpbXBsZW1lbnRzIFN0b3JhZ2Uge1xuICAgIGFzeW5jIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShjb2xsZWN0aW9uTmFtZSkgfHwgbnVsbCkgfHwgW107XG4gICAgfVxuICAgIGFzeW5jIGdldEFsbENvbGxlY3Rpb25zRGF0YSgpOiBQcm9taXNlPFJlY29yZFtdPiB7XG4gICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5rZXlzKGxvY2FsU3RvcmFnZSlcbiAgICAgICAgICAgIC5yZWR1Y2UoKG9iaiwgaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIC4uLm9iaiwgW2tdOiAoSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrKSkpLm1hcCh4ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHgudHlwZSA9IGsuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHggO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHt9KTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXMob2JqKTtcblxuICAgIH1cbiAgICBhc3luYyBnZXRCeUlkKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gaXRlbXMuZmluZChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGFzeW5jIGNyZWF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZDogZ2VuZXJhdGVJZCgpIH0pO1xuICAgICAgICBpdGVtcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgdXBkYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWNvcmQgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGlkIH0pO1xuICAgICAgICBpdGVtc1tpbmRleF0gPSByZWNvcmQ7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuXG4gICAgICAgIHJldHVybiByZWNvcmQ7XG4gICAgfVxuXG4gICAgYXN5bmMgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBSZWNvcmQgJHtpZH0gbm90IGZvdW5kIGluIFwiJHtjb2xsZWN0aW9uTmFtZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW1zLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGNvbGxlY3Rpb25OYW1lLCBKU09OLnN0cmluZ2lmeShpdGVtcykpO1xuICAgIH1cbn0iLCJleHBvcnQgY2xhc3MgVGFibGUge1xuICAgIHByaXZhdGUgcmVjb3JkczogYW55W10gPSBbXTtcbiAgICBwcml2YXRlIHJvd3M6IE1hcDxvYmplY3QsIEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gbmV3IE1hcCgpO1xuICAgIC8vcHVibGljIGFjdGl2YXRlZFJvdzogSFRNTFRhYmxlUm93RWxlbWVudCA9IG51bGw7XG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHB1YmxpYyBlbGVtZW50OiBIVE1MVGFibGVFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGNyZWF0ZVJvdzogKHJlY29yZDogYW55KSA9PiBIVE1MVGFibGVSb3dFbGVtZW50LFxuICAgICAgICBwcml2YXRlIGlkZW50aWZ5PzogKHJlY29yZHM6IGFueVtdLCBpZDogYW55KSA9PiBhbnksXG4gICAgICAgIHJlY29yZHM/OiBhbnlbXVxuICAgICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIGlmIChyZWNvcmRzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZHMgPSByZWNvcmRzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjb3Jkcy5mb3JFYWNoKHRoaXMuYWRkLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gYWN0aXZhdGVkUm93LnJvd0luZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlUm93ID0gdGhpcy5yZWNvcmRzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBkZWxldGVSb3dbXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgJHtpZH1gKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZChyZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmNyZWF0ZVJvdyhyZWNvcmQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIHJvdyk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIH1cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID09PSBpZCk7XG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmNyZWF0ZVJvdy5iaW5kKHRoaXMpO1xuICAgICAgICBjb25zdCBuZXdSb3cgPSBmKG5ld1JlY29yZCk7XG4gICAgICAgIC8vIHJvdy5yZXBsYWNlV2l0aChuZXdSb3cpO1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkKG5ld1JvdywgdGhpcy5lbGVtZW50LmNoaWxkTm9kZXMuaXRlbShpbmRleCArIDEpKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIG5ld1Jvdyk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEsIG5ld1JlY29yZCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGlkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMucmVjb3Jkcy5maW5kSW5kZXgociA9PiByID09IHJlY29yZCk7XG4gICAgICAgIGNvbnN0IHJvdyA9IHRoaXMuZ2V0Um93KGlkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICByb3cucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMucm93cy5kZWxldGUocmVjb3JkKTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufSIsInR5cGUgRG9tQ29udGVudCA9IHN0cmluZyB8IE5vZGU7XG5cbnR5cGUgZWxlbWVudEZhY3Rvcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IChwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSA9PiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tKHR5cGU6IHN0cmluZywgcHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3BOYW1lLnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnZGF0YScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YU5hbWUgPSBwcm9wTmFtZS5zbGljZSg0LCA1KS50b0xvd2VyQ2FzZSgpICsgcHJvcE5hbWUuc2xpY2UoNSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhc2V0W2RhdGFOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGNvbnRlbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCB0YWJsZTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGFibGUnKTtcbmV4cG9ydCBjb25zdCB0aGVhZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoZWFkJyk7XG5leHBvcnQgY29uc3QgdGJvZHk6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IHRyOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVSb3dFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0cicpO1xuZXhwb3J0IGNvbnN0IHRoOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGgnKTtcbmV4cG9ydCBjb25zdCB0ZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RkJyk7XG5leHBvcnQgY29uc3QgYnV0dG9uOiBlbGVtZW50RmFjdG9yeTxIVE1MQnV0dG9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYnV0dG9uJyk7XG5leHBvcnQgY29uc3Qgc3BhbjogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzcGFuJyk7Ly8vXG5leHBvcnQgY29uc3QgbGFiZWw6IGVsZW1lbnRGYWN0b3J5PEhUTUxMYWJlbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgaW5wdXQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxJbnB1dEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2lucHV0Jyk7XG5leHBvcnQgY29uc3Qgc2VsZWN0OiBlbGVtZW50RmFjdG9yeTxIVE1MU2VsZWN0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3Qgb3B0aW9uOiBlbGVtZW50RmFjdG9yeTxIVE1MT3B0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgZm9ybTogZWxlbWVudEZhY3Rvcnk8SFRNTEZvcm1FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdmb3JtJyk7XG5leHBvcnQgY29uc3QgZGl2OiBlbGVtZW50RmFjdG9yeTxIVE1MRGl2RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZGl2Jyk7XG5leHBvcnQgY29uc3QgYTogZWxlbWVudEZhY3Rvcnk8SFRNTEFuY2hvckVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2EnKTtcbmV4cG9ydCBjb25zdCBwOiBlbGVtZW50RmFjdG9yeTxIVE1MUGFyYWdyYXBoRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAncCcpO1xuZXhwb3J0IGNvbnN0IGgzOiBlbGVtZW50RmFjdG9yeTxIVE1MSGVhZGluZ0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2gzJyk7XG5leHBvcnQgY29uc3Qgc3Ryb25nOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3N0cm9uZycpOyIsImV4cG9ydCBpbnRlcmZhY2UgSVR5cGUge1xuICAgIHR5cGU6IHN0cmluZztcbn1cbmV4cG9ydCBlbnVtIG92ZXJ2aWV3T3B0aW9ucyB7XG4gICAgXCJhbGxcIixcbiAgICBcImNhcnNcIixcbiAgICBcInRydWNrc1wiXG59XG5leHBvcnQgaW50ZXJmYWNlIElTdGF0dXMge1xuICAgIHN0YXR1czogXCJSZW50ZWRcIiB8IFwiQXZhaWxhYmxlXCJcbn0iLCJpbXBvcnQgeyBDYXJnb1R5cGVzLCBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMsIENhciwgVHJ1Y2sgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoJy8nLCAnJykuc3BsaXQoJy4nKVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVudW0oKTogYW55IHtcbiAgICBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKS5zbGljZSgwLCAtMSk7Ly90cnVja1xuICAgIGNvbnN0IGt2cCA9IHtcbiAgICAgICAgXCJ0cnVja1wiOiBbeyBjYXJnb1R5cGU6IENhcmdvVHlwZXMgfV0sXG4gICAgICAgIFwiY2FyXCI6IFt7IGJvZHlUeXBlOiBCb2R5VHlwZXMgfSwgeyB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnMgfV1cbiAgICB9XG4gICAgcmV0dXJuIGt2cFt0eXBlXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENsYXNzKHR5cGU6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgY29uc3QgeyBpZCwgbWFrZSwgbW9kZWwsIC4uLnJlc3QgfSA9IGRhdGE7XG4gICAgcmV0dXJuIHR5cGUgPT09IFwiY2FyXCIgPyBuZXcgQ2FyKGlkLCBtYWtlLCBtb2RlbCwgcmVzdCkgOiBuZXcgVHJ1Y2soaWQsIG1ha2UsIG1vZGVsLCByZXN0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hcFNlbGVjdHNUb1ZhbHVlcyhkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBlbnVtcy5mb3JFYWNoKGVuID0+IHtcbiAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgY29uc3QgZW51bVZhbHNTdHJpbmcgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiBpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgY29uc3QgZW51bVZhbHNOdW1iZXIgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiAhaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RWYWx1ZSA9IGRhdGFbZW51bUtleV07XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZW51bVZhbHNTdHJpbmcuaW5kZXhPZihjdXJyZW50U2VsZWN0VmFsdWUpO1xuICAgICAgICBkYXRhW2VudW1LZXldID0gZW51bVZhbHNOdW1iZXJbaW5kZXhdO1xuXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRGb3JtVmFsdWVzKGtleXM6IHN0cmluZ1tdLCBlZGl0Rm9ybTogSFRNTEZvcm1FbGVtZW50LCByZWNvcmQ6IHt9KSB7XG4gICAgY29uc3QgZW51bXMgPSBnZXRFbnVtKCk7XG4gICAga2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICAgICAgY29uc3QgZW51bUtleSA9IE9iamVjdC5rZXlzKGVuKVswXTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IGVudW1LZXkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnVtVmFsc1N0cmluZyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzTnVtYmVyID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gIWlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RWYWx1ZSA9IHJlY29yZFtlbnVtS2V5XTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGVudW1WYWxzU3RyaW5nLmluZGV4T2YoY3VycmVudFNlbGVjdFZhbHVlKTtcblxuICAgICAgICAgICAgICAgIChlZGl0Rm9ybVtrZXldIGFzIEhUTUxTZWxlY3RFbGVtZW50KS5zZWxlY3RlZEluZGV4ID0gTnVtYmVyKGVudW1WYWxzTnVtYmVyW2luZGV4XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlZGl0Rm9ybVtrZXldLnZhbHVlID0gcmVjb3JkW2tleV07XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUYWJsZVJlY29yZChhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQsIGtleXM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIFsuLi5hY3RpdmF0ZWRSb3cuY2hpbGRyZW5dLnNsaWNlKDEpLnJlZHVjZSgoYSwgYiwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICAgIGlmIChrZXkgPT09IFwicmVudGFsUHJpY2VcIikge1xuICAgICAgICAgICAgY29uc3QgciA9IC8tP1xcZCsvO1xuICAgICAgICAgICAgY29uc3QgcHJpY2UgPSBiLnRleHRDb250ZW50Lm1hdGNoKHIpO1xuICAgICAgICAgICAgYVtrZXldID0gTnVtYmVyKHByaWNlWzBdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFba2V5XSA9IGIudGV4dENvbnRlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGE7XG4gICAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtYmVyRnJvbVN0cmluZyhzdHI6IHN0cmluZykgOm51bWJlcntcbiAgICBjb25zdCByID0gLy0/XFxkKy87XG4gICAgY29uc3QgbnVtYmVycyA9IHN0ci5tYXRjaChyKTtcbiAgICByZXR1cm4gTnVtYmVyKG51bWJlcnNbMF0pO1xufSIsImV4cG9ydCBpbnRlcmZhY2UgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgaWQ6IHN0cmluZztcbiAgICBtYWtlOiBzdHJpbmc7XG4gICAgbW9kZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZlaGljbGUgaW1wbGVtZW50cyBJVmVoaWNsZSB7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5yZW50ZWRUbyA9IG51bGw7XG4gICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSAtMTtcbiAgICB9XG59XG5leHBvcnQgZW51bSBCb2R5VHlwZXMge1xuICAgIFwic2VkYW5cIiwgXCJzdXZcIiwgXCJoYXRjaGJhY2tcIlxufVxuZXhwb3J0IGVudW0gVHJhbnNtaXNzaW9ucyB7XG4gICAgXCJtYW51YWxcIiwgXCJhdXRvbWF0aWNcIlxufVxuZXhwb3J0IGVudW0gQ2FyZ29UeXBlcyB7XG4gICAgXCJib3hcIiwgXCJmbGF0YmVkXCIsIFwidmFuXCJcbn1cbmV4cG9ydCBpbnRlcmZhY2UgQ2FyUGFyYW1zIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSUNhciBleHRlbmRzIElWZWhpY2xlLCBDYXJQYXJhbXMge1xuXG59XG5leHBvcnQgaW50ZXJmYWNlIElUcnVjayBleHRlbmRzIElWZWhpY2xlLCBUcnVja1BhcmFtcyB7IH1cblxuZXhwb3J0IGludGVyZmFjZSBUcnVja1BhcmFtcyB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIENhciBleHRlbmRzIFZlaGljbGUge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgY2FyUGFyYW1zPzogQ2FyUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIGlmIChjYXJQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBjYXJQYXJhbXMuYm9keVR5cGU7XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLm51bWJlck9mU2VhdHMgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJTZWF0cyBjYW5ub3QgYmUgbmVnYXRpdmVcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IGNhclBhcmFtcy5udW1iZXJPZlNlYXRzO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBjYXJQYXJhbXMudHJhbnNtaXNzaW9uO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50ZWRUbykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGVkVG8gPSBjYXJQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLnJlbnRhbFByaWNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IGNhclBhcmFtcy5yZW50YWxQcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBCb2R5VHlwZXMuc2VkYW47XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSA0O1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBUcmFuc21pc3Npb25zLmF1dG9tYXRpYztcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFRydWNrIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgY2FyZ29UeXBlOiBDYXJnb1R5cGVzO1xuICAgIGNhcGFjaXR5OiBudW1iZXI7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCB0cnVja1BhcmFtcz86IFRydWNrUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIHRoaXMuY2FyZ29UeXBlID0gQ2FyZ29UeXBlcy5ib3g7XG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSAyO1xuICAgICAgICBpZiAodHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSkge1xuICAgICAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJDYXBhY2l0eSBjYW5ub3QgYmUgbmVnYXRpdmVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2FwYWNpdHkgPSB0cnVja1BhcmFtcy5jYXBhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXJnb1R5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IHRydWNrUGFyYW1zLmNhcmdvVHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5yZW50ZWRUbykge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGVkVG8gPSB0cnVja1BhcmFtcy5yZW50ZWRUbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSB0cnVja1BhcmFtcy5yZW50YWxQcmljZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL1N0b3JhZ2VcIjtcbmltcG9ydCB7IElWZWhpY2xlLCBWZWhpY2xlIH0gZnJvbSBcIi4vdmVoaWNsZVwiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiLi9kb20vVGFibGVcIjtcbmltcG9ydCB7IHRyLCB0ZCwgYSB9IGZyb20gXCIuL2RvbS9kb21cIjtcbmltcG9ydCB7IElUeXBlLCBvdmVydmlld09wdGlvbnMsIElTdGF0dXMgfSBmcm9tIFwiLi9tYWludHlwZXNcIjtcbmNvbnN0IGxzID0gbmV3IExvY2FsU3RvcmFnZSgpO1xuXG5jb25zdCBmb3JtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvdmVydmlld0Zvcm1cIikgYXMgSFRNTEZvcm1FbGVtZW50O1xuY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbmNvbnN0IHR5cGUgPSB1cmxQYXJhbXMuZ2V0KCd0eXBlJyk7XG5jb25zdCBzZWxlY3RlZENvbGxlY3Rpb24gPSBpc05hTihOdW1iZXIodHlwZSkpID8gdHlwZSA6IG92ZXJ2aWV3T3B0aW9uc1tOdW1iZXIodHlwZSldO1xuY29uc3Qgc2hvd0F2YWlsYWJsZSA9ICh1cmxQYXJhbXMuZ2V0KFwiYXZhaWxhYmxlT25seVwiKSk7XG5cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG5cbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlT3ZlcnZpZXdSb3csIGlkZW50aWZ5KTtcbihhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IGdldFJlY29yZHNCeVF1ZXJ5KCk7XG4gICAgaGlkcmF0ZSh0YWJsZU1hbmFnZXIsIHJlY29yZHMpO1xufSgpKVxuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgICBsZXQgcmVjb3JkcyA9IGF3YWl0IGdldFJlY29yZHNCeVF1ZXJ5KCk7XG4gICAgdGFibGVNYW5hZ2VyLmNsZWFyKCk7XG4gICAgaGlkcmF0ZSh0YWJsZU1hbmFnZXIsIHJlY29yZHMpO1xufSk7XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjb3Jkc0J5UXVlcnkoKSB7XG4gICAgbGV0IHJlY29yZHMgPSBzZWxlY3RlZENvbGxlY3Rpb24gPT09IFwiYWxsXCIgfHwgc2VsZWN0ZWRDb2xsZWN0aW9uID09PSBudWxsID9cbiAgICAgICAgZ2V0QWxsVGFibGVSZWNvcmRzKCkgOlxuICAgICAgICAoYXdhaXQgbHMuZ2V0QWxsKHNlbGVjdGVkQ29sbGVjdGlvbikpLm1hcCh2ZWhpY2xlID0+IHtcbiAgICAgICAgICAgICh2ZWhpY2xlIGFzIGFueSkudHlwZSA9IHNlbGVjdGVkQ29sbGVjdGlvbi5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICByZXR1cm4gdmVoaWNsZTtcbiAgICAgICAgfSkubWFwKGNyZWF0ZU92ZXJ2aWV3VGFibGVSZWNvcmQpO1xuICAgIGlmIChzaG93QXZhaWxhYmxlKSB7XG4gICAgICAgIHJlY29yZHMgPSAocmVjb3JkcyBhcyBhbnkpLmZpbHRlcihyZWMgPT4gcmVjLnN0YXR1cyA9PT0gXCJBdmFpbGFibGVcIik7XG4gICAgfVxuICAgIHJldHVybiByZWNvcmRzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxUYWJsZVJlY29yZHMoKSB7XG4gICAgY29uc3QgbHNWYWx1ZXMgPSBhd2FpdCBscy5nZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTtcbiAgICBjb25zdCBhbGxWZWhpY2xlcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbHNWYWx1ZXMpO1xuICAgIGNvbnN0IHRhYmxlUmVjb3JkcyA9IGFsbFZlaGljbGVzLm1hcChjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKTtcbiAgICByZXR1cm4gdGFibGVSZWNvcmRzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKHZlaGljbGU6IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogdmVoaWNsZS5pZCxcbiAgICAgICAgdHlwZTogdmVoaWNsZS50eXBlLFxuICAgICAgICBtYWtlOiB2ZWhpY2xlLm1ha2UsXG4gICAgICAgIG1vZGVsOiB2ZWhpY2xlLm1vZGVsLFxuICAgICAgICByZW50YWxQcmljZTogdmVoaWNsZS5yZW50YWxQcmljZSxcbiAgICAgICAgc3RhdHVzOiB2ZWhpY2xlLnJlbnRlZFRvID8gXCJSZW50ZWRcIiA6IFwiQXZhaWxhYmxlXCJcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSwgcmVjb3Jkcz86IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICBjb25zdCB2ZWhpY2xlcyA9IHJlY29yZHMgPyByZWNvcmRzIDogYXdhaXQgZ2V0QWxsVGFibGVSZWNvcmRzKCk7XG4gICAgdmVoaWNsZXMuZm9yRWFjaCh2ZWhpY2xlID0+IHRhYmxlTWFuYWdlci5hZGQodmVoaWNsZSkpO1xufVxuXG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU92ZXJ2aWV3Um93KGV4dGVuZGVkVmVoaWNsZTogSVZlaGljbGUgJiBJVHlwZSAmIElTdGF0dXMpIHtcbiAgICBjb25zdCByb3cgPSB0cih7fSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5pZCksXG4gICAgICAgIHRkKHt9LCBleHRlbmRlZFZlaGljbGUudHlwZSksXG4gICAgICAgIHRkKHt9LCBleHRlbmRlZFZlaGljbGUubWFrZSksXG4gICAgICAgIHRkKHt9LCBleHRlbmRlZFZlaGljbGUubW9kZWwpLFxuICAgICAgICB0ZCh7fSwgYCQke2V4dGVuZGVkVmVoaWNsZS5yZW50YWxQcmljZS50b1N0cmluZygpfS9kYXlgKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5zdGF0dXMpLFxuICAgICAgICB0ZCh7fSwgYSh7IGhyZWY6IGAvZGV0YWlscy5odG1sP2lkPSR7ZXh0ZW5kZWRWZWhpY2xlLmlkfWAgfSwgXCJEZXRhaWxzXCIpKVxuICAgICk7XG5cbiAgICByZXR1cm4gcm93O1xufSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==