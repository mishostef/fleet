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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDdEMsQ0FBQztBQUVELFNBQVMsaUJBQWlCLENBQUMsZUFBMkM7SUFDbEUsTUFBTSxHQUFHLEdBQUcsNENBQUUsQ0FBQyxFQUFFLEVBQ2IsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLEVBQUUsQ0FBQyxFQUMxQiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQzVCLDRDQUFFLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFDNUIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUM3Qiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxJQUFJLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUN4RCw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsTUFBTSxDQUFDLEVBQzlCLDRDQUFFLENBQUMsRUFBRSxFQUFFLDJDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLGVBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQzNFLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL21haW50eXBlcy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92ZWhpY2xlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICAvL3B1YmxpYyBhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogSFRNTFRhYmxlRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVSb3c6IChyZWNvcmQ6IGFueSkgPT4gSFRNTFRhYmxlUm93RWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmeT86IChyZWNvcmRzOiBhbnlbXSwgaWQ6IGFueSkgPT4gYW55LFxuICAgICAgICByZWNvcmRzPzogYW55W11cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICBpZiAocmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZHMuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxCdXR0b25FbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0LnRleHRDb250ZW50ID09PSBcIkRlbGV0ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFjdGl2YXRlZFJvdyA9IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCBhcyBIVE1MVGFibGVSb3dFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByb3dJbmRleCA9IGFjdGl2YXRlZFJvdy5yb3dJbmRleCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZVJvdyA9IHRoaXMucmVjb3Jkc1tyb3dJbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gZGVsZXRlUm93W1wiaWRcIl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb25maXJtKGBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlICR7aWR9YCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhZGQocmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5jcmVhdGVSb3cocmVjb3JkKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHJvdyk7XG4gICAgICAgIHRoaXMucmVjb3Jkcy5wdXNoKHJlY29yZCk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCByb3cpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICB0aGlzLnJlY29yZHMgPSBbXTtcbiAgICB9XG4gICAgZ2V0KGlkOiBhbnkpOiBhbnkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaWRlbnRpZnkgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5pZGVudGlmeSh0aGlzLnJlY29yZHMsIGlkKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdJbmRldGl0eSBmdW5jdGlvbiBub3Qgc3BlY2lmaWVkJyk7XG4gICAgfVxuXG4gICAgZ2V0Um93KGlkOiBhbnkpOiBIVE1MVGFibGVSb3dFbGVtZW50IHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5yb3dzLmdldChyZWNvcmQpO1xuICAgIH1cblxuICAgIHJlcGxhY2UoaWQ6IGFueSwgbmV3UmVjb3JkOiBhbnkpIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gdGhpcy5nZXQoaWQpO1xuICAgICAgICAvL2NvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBbLi4udGhpcy5yb3dzLmtleXMoKV0uZmluZEluZGV4KHggPT4geFsnaWQnXSA9IGlkKTtcbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgY29uc3QgZiA9IHRoaXMuY3JlYXRlUm93LmJpbmQodGhpcyk7XG4gICAgICAgIGNvbnN0IG5ld1JvdyA9IGYobmV3UmVjb3JkKTtcbiAgICAgICAgLy8gcm93LnJlcGxhY2VXaXRoKG5ld1Jvdyk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZXBsYWNlQ2hpbGQobmV3Um93LCB0aGlzLmVsZW1lbnQuY2hpbGROb2Rlcy5pdGVtKGluZGV4ICsgMSkpO1xuICAgICAgICB0aGlzLnJvd3Muc2V0KHJlY29yZCwgbmV3Um93KTtcblxuICAgICAgICAvLyBVcGRhdGUgcmVjb3JkIGluIGNvbGxlY3Rpb25cbiAgICAgICAgdGhpcy5yZWNvcmRzLnNwbGljZShpbmRleCwgMSwgbmV3UmVjb3JkKTtcbiAgICB9XG5cbiAgICByZW1vdmUoaWQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZWNvcmRzLmZpbmRJbmRleChyID0+IHIgPT0gcmVjb3JkKTtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5nZXRSb3coaWQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByb3cgaW4gRE9NIGFuZCBjb2xsZWN0aW9uXG4gICAgICAgIHJvdy5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5yb3dzLmRlbGV0ZShyZWNvcmQpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG59IiwidHlwZSBEb21Db250ZW50ID0gc3RyaW5nIHwgTm9kZTtcblxudHlwZSBlbGVtZW50RmFjdG9yeTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gKHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb20odHlwZTogc3RyaW5nLCBwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhTmFtZSA9IHByb3BOYW1lLnNsaWNlKDQsIDUpLnRvTG93ZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSg1KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXRbZGF0YU5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IHRhYmxlOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IHRoZWFkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGhlYWQnKTtcbmV4cG9ydCBjb25zdCB0Ym9keTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3Rib2R5Jyk7XG5leHBvcnQgY29uc3QgdHI6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RyJyk7XG5leHBvcnQgY29uc3QgdGg6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aCcpO1xuZXhwb3J0IGNvbnN0IHRkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGQnKTtcbmV4cG9ydCBjb25zdCBidXR0b246IGVsZW1lbnRGYWN0b3J5PEhUTUxCdXR0b25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdidXR0b24nKTtcbmV4cG9ydCBjb25zdCBzcGFuOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NwYW4nKTsvLy9cbmV4cG9ydCBjb25zdCBsYWJlbDogZWxlbWVudEZhY3Rvcnk8SFRNTExhYmVsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnbGFiZWwnKTtcbmV4cG9ydCBjb25zdCBpbnB1dDogZWxlbWVudEZhY3Rvcnk8SFRNTElucHV0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBzZWxlY3Q6IGVsZW1lbnRGYWN0b3J5PEhUTUxTZWxlY3RFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzZWxlY3QnKTtcbmV4cG9ydCBjb25zdCBvcHRpb246IGVsZW1lbnRGYWN0b3J5PEhUTUxPcHRpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdvcHRpb24nKTtcbmV4cG9ydCBjb25zdCBmb3JtOiBlbGVtZW50RmFjdG9yeTxIVE1MRm9ybUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBkaXY6IGVsZW1lbnRGYWN0b3J5PEhUTUxEaXZFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdkaXYnKTtcbmV4cG9ydCBjb25zdCBhOiBlbGVtZW50RmFjdG9yeTxIVE1MQW5jaG9yRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYScpO1xuZXhwb3J0IGNvbnN0IHA6IGVsZW1lbnRGYWN0b3J5PEhUTUxQYXJhZ3JhcGhFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdwJyk7XG5leHBvcnQgY29uc3QgaDM6IGVsZW1lbnRGYWN0b3J5PEhUTUxIZWFkaW5nRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaDMnKTtcbmV4cG9ydCBjb25zdCBzdHJvbmc6IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3Ryb25nJyk7IiwiZXhwb3J0IGludGVyZmFjZSBJVHlwZSB7XG4gICAgdHlwZTogc3RyaW5nO1xufVxuZXhwb3J0IGVudW0gb3ZlcnZpZXdPcHRpb25zIHtcbiAgICBcImFsbFwiLFxuICAgIFwiY2Fyc1wiLFxuICAgIFwidHJ1Y2tzXCJcbn1cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YXR1cyB7XG4gICAgc3RhdHVzOiBcIlJlbnRlZFwiIHwgXCJBdmFpbGFibGVcIlxufSIsImltcG9ydCB7IENhcmdvVHlwZXMsIEJvZHlUeXBlcywgVHJhbnNtaXNzaW9ucywgQ2FyLCBUcnVjayB9IGZyb20gXCIuL3ZlaGljbGVcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gYCR7ZnVuYygpfS0ke2Z1bmMoKX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgnLycsICcnKS5zcGxpdCgnLicpWzBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW51bSgpOiBhbnkge1xuICAgIGNvbnN0IHR5cGUgPSBnZXRMb2NhdGlvbigpLnNsaWNlKDAsIC0xKTsvL3RydWNrXG4gICAgY29uc3Qga3ZwID0ge1xuICAgICAgICBcInRydWNrXCI6IFt7IGNhcmdvVHlwZTogQ2FyZ29UeXBlcyB9XSxcbiAgICAgICAgXCJjYXJcIjogW3sgYm9keVR5cGU6IEJvZHlUeXBlcyB9LCB7IHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucyB9XVxuICAgIH1cbiAgICByZXR1cm4ga3ZwW3R5cGVdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2xhc3ModHlwZTogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBjb25zdCB7IGlkLCBtYWtlLCBtb2RlbCwgLi4ucmVzdCB9ID0gZGF0YTtcbiAgICByZXR1cm4gdHlwZSA9PT0gXCJjYXJcIiA/IG5ldyBDYXIoaWQsIG1ha2UsIG1vZGVsLCByZXN0KSA6IG5ldyBUcnVjayhpZCwgbWFrZSwgbW9kZWwsIHJlc3QpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwU2VsZWN0c1RvVmFsdWVzKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IGVudW1zID0gZ2V0RW51bSgpO1xuICAgIGVudW1zLmZvckVhY2goZW4gPT4ge1xuICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICBjb25zdCBlbnVtVmFsc1N0cmluZyA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+IGlzTmFOKE51bWJlcih2KSkpO1xuICAgICAgICBjb25zdCBlbnVtVmFsc051bWJlciA9IE9iamVjdC52YWx1ZXMoZW5bZW51bUtleV0pLmZpbHRlcih2ID0+ICFpc05hTihOdW1iZXIodikpKTtcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gZGF0YVtlbnVtS2V5XTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBlbnVtVmFsc1N0cmluZy5pbmRleE9mKGN1cnJlbnRTZWxlY3RWYWx1ZSk7XG4gICAgICAgIGRhdGFbZW51bUtleV0gPSBlbnVtVmFsc051bWJlcltpbmRleF07XG5cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZvcm1WYWx1ZXMoa2V5czogc3RyaW5nW10sIGVkaXRGb3JtOiBIVE1MRm9ybUVsZW1lbnQsIHJlY29yZDoge30pIHtcbiAgICBjb25zdCBlbnVtcyA9IGdldEVudW0oKTtcbiAgICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgZW51bXMuZm9yRWFjaChlbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBlbnVtS2V5ID0gT2JqZWN0LmtleXMoZW4pWzBdO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gZW51bUtleSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudW1WYWxzU3RyaW5nID0gT2JqZWN0LnZhbHVlcyhlbltlbnVtS2V5XSkuZmlsdGVyKHYgPT4gaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZW51bVZhbHNOdW1iZXIgPSBPYmplY3QudmFsdWVzKGVuW2VudW1LZXldKS5maWx0ZXIodiA9PiAhaXNOYU4oTnVtYmVyKHYpKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdFZhbHVlID0gcmVjb3JkW2VudW1LZXldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZW51bVZhbHNTdHJpbmcuaW5kZXhPZihjdXJyZW50U2VsZWN0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgKGVkaXRGb3JtW2tleV0gYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnNlbGVjdGVkSW5kZXggPSBOdW1iZXIoZW51bVZhbHNOdW1iZXJbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGVkaXRGb3JtW2tleV0udmFsdWUgPSByZWNvcmRba2V5XTtcbiAgICB9KTtcbn0iLCJleHBvcnQgaW50ZXJmYWNlIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgbWFrZTogc3RyaW5nO1xuICAgIG1vZGVsOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWZWhpY2xlIGltcGxlbWVudHMgSVZlaGljbGUge1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5leHBvcnQgaW50ZXJmYWNlIElDYXIgZXh0ZW5kcyBJVmVoaWNsZSwgQ2FyUGFyYW1zIHtcblxufVxuZXhwb3J0IGludGVyZmFjZSBJVHJ1Y2sgZXh0ZW5kcyBJVmVoaWNsZSwgVHJ1Y2tQYXJhbXMgeyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBDYXIgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBib2R5VHlwZTogQm9keVR5cGVzO1xuICAgIG51bWJlck9mU2VhdHM6IG51bWJlcjtcbiAgICB0cmFuc21pc3Npb246IFRyYW5zbWlzc2lvbnM7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIGNhclBhcmFtcz86IENhclBhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICBpZiAoY2FyUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gY2FyUGFyYW1zLmJvZHlUeXBlO1xuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5udW1iZXJPZlNlYXRzIDwgMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiU2VhdHMgY2Fubm90IGJlIG5lZ2F0aXZlXCIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm51bWJlck9mU2VhdHMgPSBjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cztcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gY2FyUGFyYW1zLnRyYW5zbWlzc2lvbjtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gY2FyUGFyYW1zLnJlbnRlZFRvO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNhclBhcmFtcy5yZW50YWxQcmljZSkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVudGFsUHJpY2UgPSBjYXJQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHlUeXBlID0gQm9keVR5cGVzLnNlZGFuO1xuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gNDtcbiAgICAgICAgICAgIHRoaXMudHJhbnNtaXNzaW9uID0gVHJhbnNtaXNzaW9ucy5hdXRvbWF0aWM7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBUcnVjayBleHRlbmRzIFZlaGljbGUge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgdHJ1Y2tQYXJhbXM/OiBUcnVja1BhcmFtcykge1xuICAgICAgICBzdXBlcihpZCwgbWFrZSwgbW9kZWwpO1xuICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gMjtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FwYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiQ2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMuY2FyZ29UeXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gdHJ1Y2tQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gdHJ1Y2tQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9TdG9yYWdlXCI7XG5pbXBvcnQgeyBJVmVoaWNsZSwgVmVoaWNsZSB9IGZyb20gXCIuL3ZlaGljbGVcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyB0ciwgdGQsIGEgfSBmcm9tIFwiLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBJVHlwZSwgb3ZlcnZpZXdPcHRpb25zLCBJU3RhdHVzIH0gZnJvbSBcIi4vbWFpbnR5cGVzXCI7XG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnZpZXdGb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbmNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5jb25zdCB0eXBlID0gdXJsUGFyYW1zLmdldCgndHlwZScpO1xuY29uc3Qgc2VsZWN0ZWRDb2xsZWN0aW9uID0gaXNOYU4oTnVtYmVyKHR5cGUpKSA/IHR5cGUgOiBvdmVydmlld09wdGlvbnNbTnVtYmVyKHR5cGUpXTtcbmNvbnN0IHNob3dBdmFpbGFibGUgPSAodXJsUGFyYW1zLmdldChcImF2YWlsYWJsZU9ubHlcIikpO1xuXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCd0YWJsZScpWzBdO1xuXG5jb25zdCB0YWJsZU1hbmFnZXIgPSBuZXcgVGFibGUodGFibGUsIGNyZWF0ZU92ZXJ2aWV3Um93LCBpZGVudGlmeSk7XG4oYXN5bmMgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBhd2FpdCBnZXRSZWNvcmRzQnlRdWVyeSgpO1xuICAgIGhpZHJhdGUodGFibGVNYW5hZ2VyLCByZWNvcmRzKTtcbn0oKSlcblxuZm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIGFzeW5jIGZ1bmN0aW9uIChlKSB7XG4gICAgbGV0IHJlY29yZHMgPSBhd2FpdCBnZXRSZWNvcmRzQnlRdWVyeSgpO1xuICAgIHRhYmxlTWFuYWdlci5jbGVhcigpO1xuICAgIGhpZHJhdGUodGFibGVNYW5hZ2VyLCByZWNvcmRzKTtcbn0pO1xuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldFJlY29yZHNCeVF1ZXJ5KCkge1xuICAgIGxldCByZWNvcmRzID0gc2VsZWN0ZWRDb2xsZWN0aW9uID09PSBcImFsbFwiIHx8IHNlbGVjdGVkQ29sbGVjdGlvbiA9PT0gbnVsbCA/XG4gICAgICAgIGdldEFsbFRhYmxlUmVjb3JkcygpIDpcbiAgICAgICAgKGF3YWl0IGxzLmdldEFsbChzZWxlY3RlZENvbGxlY3Rpb24pKS5tYXAodmVoaWNsZSA9PiB7XG4gICAgICAgICAgICAodmVoaWNsZSBhcyBhbnkpLnR5cGUgPSBzZWxlY3RlZENvbGxlY3Rpb24uc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgcmV0dXJuIHZlaGljbGU7XG4gICAgICAgIH0pLm1hcChjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKTtcbiAgICBpZiAoc2hvd0F2YWlsYWJsZSkge1xuICAgICAgICByZWNvcmRzID0gKHJlY29yZHMgYXMgYW55KS5maWx0ZXIocmVjID0+IHJlYy5zdGF0dXMgPT09IFwiQXZhaWxhYmxlXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcmVjb3Jkcztcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0QWxsVGFibGVSZWNvcmRzKCkge1xuICAgIGNvbnN0IGxzVmFsdWVzID0gYXdhaXQgbHMuZ2V0QWxsQ29sbGVjdGlvbnNEYXRhKCk7XG4gICAgY29uc3QgYWxsVmVoaWNsZXMgPSBbXS5jb25jYXQuYXBwbHkoW10sIGxzVmFsdWVzKTtcbiAgICBjb25zdCB0YWJsZVJlY29yZHMgPSBhbGxWZWhpY2xlcy5tYXAoY3JlYXRlT3ZlcnZpZXdUYWJsZVJlY29yZCk7XG4gICAgcmV0dXJuIHRhYmxlUmVjb3Jkcztcbn1cblxuZnVuY3Rpb24gY3JlYXRlT3ZlcnZpZXdUYWJsZVJlY29yZCh2ZWhpY2xlOiBJVmVoaWNsZSAmIElUeXBlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQ6IHZlaGljbGUuaWQsXG4gICAgICAgIHR5cGU6IHZlaGljbGUudHlwZSxcbiAgICAgICAgbWFrZTogdmVoaWNsZS5tYWtlLFxuICAgICAgICBtb2RlbDogdmVoaWNsZS5tb2RlbCxcbiAgICAgICAgcmVudGFsUHJpY2U6IHZlaGljbGUucmVudGFsUHJpY2UsXG4gICAgICAgIHN0YXR1czogdmVoaWNsZS5yZW50ZWRUbyA/IFwiUmVudGVkXCIgOiBcIkF2YWlsYWJsZVwiXG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBoaWRyYXRlKHRhYmxlTWFuYWdlcjogVGFibGUsIHJlY29yZHM/OiBJVmVoaWNsZSAmIElUeXBlKSB7XG4gICAgY29uc3QgdmVoaWNsZXMgPSByZWNvcmRzID8gcmVjb3JkcyA6IGF3YWl0IGdldEFsbFRhYmxlUmVjb3JkcygpO1xuICAgIHZlaGljbGVzLmZvckVhY2godmVoaWNsZSA9PiB0YWJsZU1hbmFnZXIuYWRkKHZlaGljbGUpKTtcbn1cblxuXG5mdW5jdGlvbiBpZGVudGlmeShjYXJzOiBJVmVoaWNsZVtdLCBpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNhcnMuZmluZChlID0+IGUuaWQgPT0gaWQpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPdmVydmlld1JvdyhleHRlbmRlZFZlaGljbGU6IElWZWhpY2xlICYgSVR5cGUgJiBJU3RhdHVzKSB7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCBleHRlbmRlZFZlaGljbGUuaWQpLFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLnR5cGUpLFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIGAkJHtleHRlbmRlZFZlaGljbGUucmVudGFsUHJpY2UudG9TdHJpbmcoKX0vZGF5YCksXG4gICAgICAgIHRkKHt9LCBleHRlbmRlZFZlaGljbGUuc3RhdHVzKSxcbiAgICAgICAgdGQoe30sIGEoeyBocmVmOiBgL2RldGFpbHMuaHRtbD9pZD0ke2V4dGVuZGVkVmVoaWNsZS5pZH1gIH0sIFwiRGV0YWlsc1wiKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHJvdztcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=