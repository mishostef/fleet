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
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "overviewOptions": () => (/* binding */ overviewOptions)
/* harmony export */ });
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vehicle */ "./src/vehicle.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dom/dom */ "./src/dom/dom.ts");




const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
const id = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.generateId)();
const car = new _vehicle__WEBPACK_IMPORTED_MODULE_1__.Car(id, "golf", "VW");
const form = document.getElementById("overviewForm");
var overviewOptions;
(function (overviewOptions) {
    overviewOptions[overviewOptions["all"] = 0] = "all";
    overviewOptions[overviewOptions["cars"] = 1] = "cars";
    overviewOptions[overviewOptions["trucks"] = 2] = "trucks";
})(overviewOptions || (overviewOptions = {}));
form.addEventListener("submit", async function (e) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    alert(JSON.stringify(data));
    const showAvailable = data["availableOnly"];
    console.log(showAvailable);
    console.log(showAvailable && data["availableOnly"]);
    const selectedCollection = data.type;
    console.log(overviewOptions[Number(selectedCollection)]);
    if (overviewOptions[Number(selectedCollection)] == "all") {
        const lsValues = await ls.getAllCollectionsData();
        console.log('v=', lsValues);
        const allVehicles = [].concat.apply([], lsValues);
        console.log('x=', allVehicles);
        const tableRecords = allVehicles.map(getTableRecord);
        console.log('tablerecords: ', tableRecords);
    }
    if (showAvailable) {
    }
});
function getTableRecord(vehicle) {
    return {
        id: vehicle.id,
        type: vehicle.type,
        make: vehicle.make,
        model: vehicle.model,
        rentalPrice: vehicle.rentalPrice,
        status: vehicle.rentedTo ? "Rented" : "Available"
    };
}
const table = document.getElementsByTagName('table')[0];
// console.log(table);
// const tableManager = new Table(table, createCarRow, identify);
// tableManager.add(car)
function identify(cars, id) {
    return cars.find(e => e.id == id);
}
function createCarRow(car) {
    console.log(car);
    console.log(Object.keys(car));
    console.log(Object.entries(car));
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, car.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, car.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, car.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, _vehicle__WEBPACK_IMPORTED_MODULE_1__.BodyTypes[car.bodyType]), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, car.numberOfSeats.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, car.transmission.toString()), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, `$${car.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_3__.button)({ className: "action delete" }, 'Delete')));
    return row;
}
async function onSubmit(data) {
    // data.id = generateId();
    // alert(JSON.stringify(data));
    // const type = getLocation();
    // ls.create(type, new Car(data.id, data.make, data.model));
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ3pHLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFJRCxLQUFLLFVBQVUsUUFBUSxDQUFDLElBQUk7SUFDeEIsMEJBQTBCO0lBQzFCLCtCQUErQjtJQUMvQiw4QkFBOEI7SUFDOUIsNERBQTREO0FBQ2hFLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9kb20udHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvdmVoaWNsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2VuZXJhdGVJZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgdHlwZSBSZWNvcmRJZCA9IHN0cmluZztcblxuZXhwb3J0IGludGVyZmFjZSBSZWNvcmQge1xuICAgIGlkOiBSZWNvcmRJZFxufTtcblxuZXhwb3J0IGludGVyZmFjZSBTdG9yYWdlIHtcbiAgICBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+O1xuICAgIGdldEJ5SWQoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkKTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIGNyZWF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgdXBkYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCwgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+O1xuICAgIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgTG9jYWxTdG9yYWdlIGltcGxlbWVudHMgU3RvcmFnZSB7XG4gICAgYXN5bmMgZ2V0QWxsKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcpOiBQcm9taXNlPFJlY29yZFtdPiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGNvbGxlY3Rpb25OYW1lKSB8fCBudWxsKSB8fCBbXTtcbiAgICB9XG4gICAgYXN5bmMgZ2V0QWxsQ29sbGVjdGlvbnNEYXRhKCk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmtleXMobG9jYWxTdG9yYWdlKVxuICAgICAgICAgICAgLnJlZHVjZSgob2JqLCBrKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgLi4ub2JqLCBba106IChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGspKSkubWFwKHggPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeC50eXBlID0gay5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCA7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge30pO1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyhvYmopO1xuXG4gICAgfVxuICAgIGFzeW5jIGdldEJ5SWQoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBpdGVtcy5maW5kKGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgYXN5bmMgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCByZWNvcmQgPSBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGlkOiBnZW5lcmF0ZUlkKCkgfSk7XG4gICAgICAgIGl0ZW1zLnB1c2gocmVjb3JkKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oY29sbGVjdGlvbk5hbWUsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9XG5cbiAgICBhc3luYyB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gaXRlbXMuZmluZEluZGV4KGkgPT4gaS5pZCA9PSBpZCk7XG4gICAgICAgIGlmIChpbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBSZWNvcmQgJHtpZH0gbm90IGZvdW5kIGluIFwiJHtjb2xsZWN0aW9uTmFtZX1cImApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQgfSk7XG4gICAgICAgIGl0ZW1zW2luZGV4XSA9IHJlY29yZDtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oY29sbGVjdGlvbk5hbWUsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XG5cbiAgICAgICAgcmV0dXJuIHJlY29yZDtcbiAgICB9XG5cbiAgICBhc3luYyBkZWxldGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgaXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oY29sbGVjdGlvbk5hbWUsIEpTT04uc3RyaW5naWZ5KGl0ZW1zKSk7XG4gICAgfVxufSIsInR5cGUgRG9tQ29udGVudCA9IHN0cmluZyB8IE5vZGU7XG5cbnR5cGUgZWxlbWVudEZhY3Rvcnk8VCBleHRlbmRzIEhUTUxFbGVtZW50PiA9IChwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSA9PiBUO1xuXG5leHBvcnQgZnVuY3Rpb24gZG9tKHR5cGU6IHN0cmluZywgcHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuXG4gICAgaWYgKHByb3BzKSB7XG4gICAgICAgIGZvciAobGV0IHByb3BOYW1lIGluIHByb3BzKSB7XG4gICAgICAgICAgICBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IHByb3BOYW1lLnNsaWNlKDIpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgcHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcE5hbWUuc3RhcnRzV2l0aCgnZGF0YScpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YU5hbWUgPSBwcm9wTmFtZS5zbGljZSg0LCA1KS50b0xvd2VyQ2FzZSgpICsgcHJvcE5hbWUuc2xpY2UoNSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5kYXRhc2V0W2RhdGFOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudFtwcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpdGVtIG9mIGNvbnRlbnQpIHtcbiAgICAgICAgZWxlbWVudC5hcHBlbmQoaXRlbSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBjb25zdCB0YWJsZTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGFibGUnKTtcbmV4cG9ydCBjb25zdCB0aGVhZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoZWFkJyk7XG5leHBvcnQgY29uc3QgdGJvZHk6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0Ym9keScpO1xuZXhwb3J0IGNvbnN0IHRyOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVSb3dFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0cicpO1xuZXhwb3J0IGNvbnN0IHRoOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGgnKTtcbmV4cG9ydCBjb25zdCB0ZDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RkJyk7XG5leHBvcnQgY29uc3QgYnV0dG9uOiBlbGVtZW50RmFjdG9yeTxIVE1MQnV0dG9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYnV0dG9uJyk7XG5leHBvcnQgY29uc3Qgc3BhbjogZWxlbWVudEZhY3Rvcnk8SFRNTFNwYW5FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzcGFuJyk7Ly8vXG5leHBvcnQgY29uc3QgbGFiZWw6IGVsZW1lbnRGYWN0b3J5PEhUTUxMYWJlbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2xhYmVsJyk7XG5leHBvcnQgY29uc3QgaW5wdXQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxJbnB1dEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2lucHV0Jyk7XG5leHBvcnQgY29uc3Qgc2VsZWN0OiBlbGVtZW50RmFjdG9yeTxIVE1MU2VsZWN0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc2VsZWN0Jyk7XG5leHBvcnQgY29uc3Qgb3B0aW9uOiBlbGVtZW50RmFjdG9yeTxIVE1MT3B0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnb3B0aW9uJyk7XG5leHBvcnQgY29uc3QgZm9ybTogZWxlbWVudEZhY3Rvcnk8SFRNTEZvcm1FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdmb3JtJyk7XG5leHBvcnQgY29uc3QgZGl2OiBlbGVtZW50RmFjdG9yeTxIVE1MRGl2RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZGl2Jyk7IiwiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gYCR7ZnVuYygpfS0ke2Z1bmMoKX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOnN0cmluZ3tcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoJy8nLCcnKS5zcGxpdCgnLicpWzBdO1xufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJVmVoaWNsZSB7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICBpZDogc3RyaW5nO1xuICAgIG1ha2U6IHN0cmluZztcbiAgICBtb2RlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmVoaWNsZSBpbXBsZW1lbnRzIElWZWhpY2xle1xuICAgIHJlbnRhbFByaWNlOiBudW1iZXI7XG4gICAgcmVudGVkVG86IHN0cmluZyB8IG51bGw7XG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMucmVudGVkVG8gPSBudWxsO1xuICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gLTE7XG4gICAgfVxufVxuZXhwb3J0IGVudW0gQm9keVR5cGVzIHtcbiAgICBcInNlZGFuXCIsIFwic3V2XCIsIFwiaGF0Y2hiYWNrXCJcbn1cbmV4cG9ydCBlbnVtIFRyYW5zbWlzc2lvbnMge1xuICAgIFwibWFudWFsXCIsIFwiYXV0b21hdGljXCJcbn1cbmV4cG9ydCBlbnVtIENhcmdvVHlwZXMge1xuICAgIFwiYm94XCIsIFwiZmxhdGJlZFwiLCBcInZhblwiXG59XG5leHBvcnQgaW50ZXJmYWNlIENhclBhcmFtcyB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ2FyIGV4dGVuZHMgSVZlaGljbGUsIENhclBhcmFtcyB7XG5cbn1cbmV4cG9ydCBpbnRlcmZhY2UgVHJ1Y2tQYXJhbXMge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcztcbiAgICBjYXBhY2l0eTogbnVtYmVyO1xufVxuZXhwb3J0IGNsYXNzIENhciBleHRlbmRzIFZlaGljbGUge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZywgY2FyUGFyYW1zPzogQ2FyUGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKGlkLCBtYWtlLCBtb2RlbCk7XG4gICAgICAgIGlmIChjYXJQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMuYm9keVR5cGUgPSBjYXJQYXJhbXMuYm9keVR5cGU7XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLm51bWJlck9mU2VhdHMgPCAwKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJTZWF0cyBjYW5ub3QgYmUgbmVnYXRpdmVcIilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IGNhclBhcmFtcy5udW1iZXJPZlNlYXRzO1xuICAgICAgICAgICAgdGhpcy50cmFuc21pc3Npb24gPSBjYXJQYXJhbXMudHJhbnNtaXNzaW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IEJvZHlUeXBlcy5zZWRhbjtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IFRyYW5zbWlzc2lvbnMuYXV0b21hdGljO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2sgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIHRydWNrUGFyYW1zPzogVHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IHRydWNrUGFyYW1zLmNhcmdvVHlwZTtcbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkNhcGFjaXR5IGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICAgICAgdGhpcy5jYXBhY2l0eSA9IDI7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9TdG9yYWdlXCI7XG5pbXBvcnQgeyBCb2R5VHlwZXMsIENhciwgSVZlaGljbGUsIFZlaGljbGUgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5pbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IEVkaXRvciB9IGZyb20gXCIuL2RvbS9FZGl0b3JcIjtcbmltcG9ydCB7IEZvcm1WaWV3IH0gZnJvbSBcIi4vdmlld3MvRm9ybVZpZXdcIjtcbmltcG9ydCB7IGdldExvY2F0aW9uIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7IFRhYmxlIH0gZnJvbSBcIi4vZG9tL1RhYmxlXCI7XG5pbXBvcnQgeyB0ciwgdGQsIHNwYW4sIGJ1dHRvbiB9IGZyb20gXCIuL2RvbS9kb21cIjtcbmNvbnN0IGxzID0gbmV3IExvY2FsU3RvcmFnZSgpO1xuY29uc3QgaWQgPSBnZW5lcmF0ZUlkKCk7XG5jb25zdCBjYXIgPSBuZXcgQ2FyKGlkLCBcImdvbGZcIiwgXCJWV1wiKTtcbmNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm92ZXJ2aWV3Rm9ybVwiKSBhcyBIVE1MRm9ybUVsZW1lbnQ7XG5cbmV4cG9ydCBlbnVtIG92ZXJ2aWV3T3B0aW9ucyB7XG4gICAgXCJhbGxcIixcbiAgICBcImNhcnNcIixcbiAgICBcInRydWNrc1wiXG59XG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YShmb3JtKTtcbiAgICBjb25zdCBkYXRhID0gT2JqZWN0LmZyb21FbnRyaWVzKGZvcm1EYXRhKTtcbiAgICBhbGVydChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgY29uc3Qgc2hvd0F2YWlsYWJsZSA9IGRhdGFbXCJhdmFpbGFibGVPbmx5XCJdO1xuICAgIGNvbnNvbGUubG9nKHNob3dBdmFpbGFibGUpO1xuICAgIGNvbnNvbGUubG9nKHNob3dBdmFpbGFibGUgJiYgZGF0YVtcImF2YWlsYWJsZU9ubHlcIl0pXG4gICAgY29uc3Qgc2VsZWN0ZWRDb2xsZWN0aW9uID0gZGF0YS50eXBlO1xuICAgIGNvbnNvbGUubG9nKG92ZXJ2aWV3T3B0aW9uc1tOdW1iZXIoc2VsZWN0ZWRDb2xsZWN0aW9uKV0pO1xuICAgIGlmIChvdmVydmlld09wdGlvbnNbTnVtYmVyKHNlbGVjdGVkQ29sbGVjdGlvbildID09IFwiYWxsXCIpIHtcbiAgICAgICAgY29uc3QgbHNWYWx1ZXMgPSBhd2FpdCBscy5nZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3Y9JywgbHNWYWx1ZXMpO1xuICAgICAgICBjb25zdCBhbGxWZWhpY2xlcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbHNWYWx1ZXMpO1xuICAgICAgICBjb25zb2xlLmxvZygneD0nLCBhbGxWZWhpY2xlcylcbiAgICAgICAgY29uc3QgdGFibGVSZWNvcmRzID0gYWxsVmVoaWNsZXMubWFwKGdldFRhYmxlUmVjb3JkKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RhYmxlcmVjb3JkczogJywgdGFibGVSZWNvcmRzKVxuICAgIH1cbiAgICBpZiAoc2hvd0F2YWlsYWJsZSkge1xuXG4gICAgfVxufSk7XG5pbnRlcmZhY2UgSVR5cGUge1xuICAgIHR5cGU6IHN0cmluZztcbn1cblxuZnVuY3Rpb24gZ2V0VGFibGVSZWNvcmQodmVoaWNsZTogSVZlaGljbGUgJiBJVHlwZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGlkOiB2ZWhpY2xlLmlkLFxuICAgICAgICB0eXBlOiB2ZWhpY2xlLnR5cGUsXG4gICAgICAgIG1ha2U6IHZlaGljbGUubWFrZSxcbiAgICAgICAgbW9kZWw6IHZlaGljbGUubW9kZWwsXG4gICAgICAgIHJlbnRhbFByaWNlOiB2ZWhpY2xlLnJlbnRhbFByaWNlLFxuICAgICAgICBzdGF0dXM6IHZlaGljbGUucmVudGVkVG8gPyBcIlJlbnRlZFwiIDogXCJBdmFpbGFibGVcIlxuICAgIH1cbn1cbmNvbnN0IHRhYmxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3RhYmxlJylbMF07XG4vLyBjb25zb2xlLmxvZyh0YWJsZSk7XG4vLyBjb25zdCB0YWJsZU1hbmFnZXIgPSBuZXcgVGFibGUodGFibGUsIGNyZWF0ZUNhclJvdywgaWRlbnRpZnkpO1xuLy8gdGFibGVNYW5hZ2VyLmFkZChjYXIpXG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhclJvdyhjYXI6IENhcikge1xuICAgIGNvbnNvbGUubG9nKGNhcik7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmtleXMoY2FyKSk7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmVudHJpZXMoY2FyKSk7XG4gICAgY29uc3Qgcm93ID0gdHIoe30sXG4gICAgICAgIHRkKHt9LCBjYXIuaWQpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1ha2UpLFxuICAgICAgICB0ZCh7fSwgY2FyLm1vZGVsKSxcbiAgICAgICAgdGQoe30sIEJvZHlUeXBlc1tjYXIuYm9keVR5cGVdKSxcbiAgICAgICAgdGQoe30sIGNhci5udW1iZXJPZlNlYXRzLnRvU3RyaW5nKCkpLFxuICAgICAgICB0ZCh7fSwgY2FyLnRyYW5zbWlzc2lvbi50b1N0cmluZygpKSxcbiAgICAgICAgdGQoe30sIGAkJHtjYXIucmVudGFsUHJpY2UudG9TdHJpbmcoKX0vZGF5YCksXG4gICAgICAgIHRkKHt9LCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGVkaXRcIiB9LCAnRWRpdCcpLCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGRlbGV0ZVwiIH0sICdEZWxldGUnKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHJvdztcbn1cblxuXG5cbmFzeW5jIGZ1bmN0aW9uIG9uU3VibWl0KGRhdGEpIHtcbiAgICAvLyBkYXRhLmlkID0gZ2VuZXJhdGVJZCgpO1xuICAgIC8vIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAvLyBjb25zdCB0eXBlID0gZ2V0TG9jYXRpb24oKTtcbiAgICAvLyBscy5jcmVhdGUodHlwZSwgbmV3IENhcihkYXRhLmlkLCBkYXRhLm1ha2UsIGRhdGEubW9kZWwpKTtcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==