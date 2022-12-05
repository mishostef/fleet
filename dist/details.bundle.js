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
        if (truckParams) {
            this.cargoType = truckParams.cargoType;
            if (truckParams.capacity < 0) {
                throw new RangeError("Capacity cannot be negative");
            }
            this.cargoType = truckParams.cargoType;
            this.capacity = truckParams.capacity;
            if (truckParams.rentedTo) {
                this.rentedTo = truckParams.rentedTo;
            }
            if (truckParams.rentalPrice) {
                this.rentalPrice = truckParams.rentalPrice;
            }
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
/*!************************!*\
  !*** ./src/details.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom/dom */ "./src/dom/dom.ts");
/* harmony import */ var _Storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Storage */ "./src/Storage.ts");
/* harmony import */ var _vehicle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vehicle */ "./src/vehicle.ts");



const enumMap = {
    cargoType: _vehicle__WEBPACK_IMPORTED_MODULE_2__.CargoTypes,
    bodyType: _vehicle__WEBPACK_IMPORTED_MODULE_2__.BodyTypes,
    transmission: _vehicle__WEBPACK_IMPORTED_MODULE_2__.Transmissions
};
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const ls = new _Storage__WEBPACK_IMPORTED_MODULE_1__.LocalStorage();
// <h3>Opel Corsa</h3>
//             <div class="details">
//                 <p><span class="col">ID:</span><strong>0076-5b58</strong></p>
//                 <p><span class="col">Body type:</span><strong>Hatchback</strong></p>
//                 <p><span class="col">Seats:</span><strong>4</strong></p>
//                 <p><span class="col">Transmission:</span><strong>Manual</strong></p>
//                 <p><span class="col">Rental price:</span><strong>$55/day</strong></p>
//             </div>
//             <div class="rental">
//                 <p><span class="col">Status:</span><strong>Available/Rented</strong></p>
//                 <p><span class="col">Rented to:</span><strong>John Smith</strong> <button class="action release">End
//                         contract</button></p>
//                 <form>
//                     <label>
//                         <span>Rent to</span>
//                         <input type="text" name="name">
//                     </label>
//                     <button class="action rent">Confirm</button>
//                 </form>
//             </div>
function createDetailsForm() {
    return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.form)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.label)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({}, "Rent to"), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.input)({ type: "text", name: "name" })), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action rent" }, "Confirm"));
}
async function createDetails() {
    const currentVehicle = await getCurrentVehicle();
    alert(JSON.stringify(currentVehicle));
    const props = Object.entries(currentVehicle).map(kv => {
        let [k, v] = kv;
        if (k in Object.keys(enumMap)) {
            v = enumMap[k];
        }
        return (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.p)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({ className: "col" }, k), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.strong)({ className: "col" }, v === null ? '' : v.toString()));
    });
    const detailsDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({ className: "details" }, ...props);
    const form = createDetailsForm();
    const rentalDiv = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.div)({ className: "rental" }, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.p)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.span)({ classname: "col" }, "Rented to:  "), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.strong)({}, currentVehicle["rentedTo"] ? currentVehicle["rentedTo"] : "noone")), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_0__.button)({ className: "action release", onclick: endContract }, "End contract"), form);
    const main = document.getElementsByTagName("main")[0];
    main.replaceChildren();
    main.appendChild(detailsDiv);
    main.appendChild(rentalDiv);
}
async function getCurrentVehicle() {
    const lsValues = await ls.getAllCollectionsData();
    const allVehicles = [].concat.apply([], lsValues);
    const currentVehicle = allVehicles.find(v => v.id === id);
    return currentVehicle;
}
async function endContract() {
    alert("end contract");
    const data = await getCurrentVehicle();
    const collectionName = `${data.type}s`;
    console.log(data);
    delete data.type;
    console.log(data);
    await ls.update(collectionName, id, { ...data, rentedTo: null });
}
createDetails();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsQ0FBQztJQUN0RCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM3QixJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWhDLENBQUM7QUFDRCxLQUFLLFVBQVUsaUJBQWlCO0lBQzVCLE1BQU0sUUFBUSxHQUFHLE1BQU0sRUFBRSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDbEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzFELE9BQU8sY0FBYyxDQUFDO0FBQzFCLENBQUM7QUFFRCxLQUFLLFVBQVUsV0FBVztJQUN0QixLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxpQkFBaUIsRUFBRSxDQUFDO0lBQ3ZDLE1BQU0sY0FBYyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBQ2pCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDckUsQ0FBQztBQUVELGFBQWEsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL1N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZG9tL2RvbS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy92ZWhpY2xlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvZGV0YWlscy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwidHlwZSBEb21Db250ZW50ID0gc3RyaW5nIHwgTm9kZTtcblxudHlwZSBlbGVtZW50RmFjdG9yeTxUIGV4dGVuZHMgSFRNTEVsZW1lbnQ+ID0gKHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pID0+IFQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBkb20odHlwZTogc3RyaW5nLCBwcm9wcz86IG9iamVjdCwgLi4uY29udGVudDogRG9tQ29udGVudFtdKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodHlwZSk7XG5cbiAgICBpZiAocHJvcHMpIHtcbiAgICAgICAgZm9yIChsZXQgcHJvcE5hbWUgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gcHJvcE5hbWUuc2xpY2UoMikudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBwcm9wc1twcm9wTmFtZV0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wTmFtZS5zdGFydHNXaXRoKCdkYXRhJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhTmFtZSA9IHByb3BOYW1lLnNsaWNlKDQsIDUpLnRvTG93ZXJDYXNlKCkgKyBwcm9wTmFtZS5zbGljZSg1KTtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmRhdGFzZXRbZGF0YU5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50W3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICBlbGVtZW50LmFwcGVuZChpdGVtKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGNvbnN0IHRhYmxlOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0YWJsZScpO1xuZXhwb3J0IGNvbnN0IHRoZWFkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGhlYWQnKTtcbmV4cG9ydCBjb25zdCB0Ym9keTogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlU2VjdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3Rib2R5Jyk7XG5leHBvcnQgY29uc3QgdHI6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVJvd0VsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RyJyk7XG5leHBvcnQgY29uc3QgdGg6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aCcpO1xuZXhwb3J0IGNvbnN0IHRkOiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVDZWxsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGQnKTtcbmV4cG9ydCBjb25zdCBidXR0b246IGVsZW1lbnRGYWN0b3J5PEhUTUxCdXR0b25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdidXR0b24nKTtcbmV4cG9ydCBjb25zdCBzcGFuOiBlbGVtZW50RmFjdG9yeTxIVE1MU3BhbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NwYW4nKTsvLy9cbmV4cG9ydCBjb25zdCBsYWJlbDogZWxlbWVudEZhY3Rvcnk8SFRNTExhYmVsRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnbGFiZWwnKTtcbmV4cG9ydCBjb25zdCBpbnB1dDogZWxlbWVudEZhY3Rvcnk8SFRNTElucHV0RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaW5wdXQnKTtcbmV4cG9ydCBjb25zdCBzZWxlY3Q6IGVsZW1lbnRGYWN0b3J5PEhUTUxTZWxlY3RFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdzZWxlY3QnKTtcbmV4cG9ydCBjb25zdCBvcHRpb246IGVsZW1lbnRGYWN0b3J5PEhUTUxPcHRpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdvcHRpb24nKTtcbmV4cG9ydCBjb25zdCBmb3JtOiBlbGVtZW50RmFjdG9yeTxIVE1MRm9ybUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2Zvcm0nKTtcbmV4cG9ydCBjb25zdCBkaXY6IGVsZW1lbnRGYWN0b3J5PEhUTUxEaXZFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdkaXYnKTtcbmV4cG9ydCBjb25zdCBhOiBlbGVtZW50RmFjdG9yeTxIVE1MQW5jaG9yRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnYScpO1xuZXhwb3J0IGNvbnN0IHA6IGVsZW1lbnRGYWN0b3J5PEhUTUxQYXJhZ3JhcGhFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdwJyk7XG5leHBvcnQgY29uc3QgaDM6IGVsZW1lbnRGYWN0b3J5PEhUTUxIZWFkaW5nRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnaDMnKTtcbmV4cG9ydCBjb25zdCBzdHJvbmc6IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3Ryb25nJyk7IiwiZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlSWQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTY3NzcyMTUpLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gYCR7ZnVuYygpfS0ke2Z1bmMoKX1gXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhdGlvbigpOnN0cmluZ3tcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoJy8nLCcnKS5zcGxpdCgnLicpWzBdO1xufVxuIiwiZXhwb3J0IGludGVyZmFjZSBJVmVoaWNsZSB7XG4gICAgcmVudGFsUHJpY2U6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICBpZDogc3RyaW5nO1xuICAgIG1ha2U6IHN0cmluZztcbiAgICBtb2RlbDogc3RyaW5nO1xufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVmVoaWNsZSBpbXBsZW1lbnRzIElWZWhpY2xlIHtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xuICAgIHJlbnRlZFRvOiBzdHJpbmcgfCBudWxsO1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBpZDogc3RyaW5nLCBwdWJsaWMgbWFrZTogc3RyaW5nLCBwdWJsaWMgbW9kZWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLnJlbnRlZFRvID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZW50YWxQcmljZSA9IC0xO1xuICAgIH1cbn1cbmV4cG9ydCBlbnVtIEJvZHlUeXBlcyB7XG4gICAgXCJzZWRhblwiLCBcInN1dlwiLCBcImhhdGNoYmFja1wiXG59XG5leHBvcnQgZW51bSBUcmFuc21pc3Npb25zIHtcbiAgICBcIm1hbnVhbFwiLCBcImF1dG9tYXRpY1wiXG59XG5leHBvcnQgZW51bSBDYXJnb1R5cGVzIHtcbiAgICBcImJveFwiLCBcImZsYXRiZWRcIiwgXCJ2YW5cIlxufVxuZXhwb3J0IGludGVyZmFjZSBDYXJQYXJhbXMge1xuICAgIGJvZHlUeXBlOiBCb2R5VHlwZXM7XG4gICAgbnVtYmVyT2ZTZWF0czogbnVtYmVyO1xuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9ucztcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xufVxuZXhwb3J0IGludGVyZmFjZSBJQ2FyIGV4dGVuZHMgSVZlaGljbGUsIENhclBhcmFtcyB7XG5cbn1cbmV4cG9ydCBpbnRlcmZhY2UgSVRydWNrIGV4dGVuZHMgSVZlaGljbGUsIFRydWNrUGFyYW1zIHsgfVxuXG5leHBvcnQgaW50ZXJmYWNlIFRydWNrUGFyYW1zIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICByZW50ZWRUbzogc3RyaW5nIHwgbnVsbDtcbiAgICByZW50YWxQcmljZTogbnVtYmVyO1xufVxuXG5leHBvcnQgY2xhc3MgQ2FyIGV4dGVuZHMgVmVoaWNsZSB7XG4gICAgYm9keVR5cGU6IEJvZHlUeXBlcztcbiAgICBudW1iZXJPZlNlYXRzOiBudW1iZXI7XG4gICAgdHJhbnNtaXNzaW9uOiBUcmFuc21pc3Npb25zO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGlkOiBzdHJpbmcsIHB1YmxpYyBtYWtlOiBzdHJpbmcsIHB1YmxpYyBtb2RlbDogc3RyaW5nLCBjYXJQYXJhbXM/OiBDYXJQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKGNhclBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IGNhclBhcmFtcy5ib2R5VHlwZTtcbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMubnVtYmVyT2ZTZWF0cyA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlNlYXRzIGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5udW1iZXJPZlNlYXRzID0gY2FyUGFyYW1zLm51bWJlck9mU2VhdHM7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IGNhclBhcmFtcy50cmFuc21pc3Npb247XG4gICAgICAgICAgICBpZiAoY2FyUGFyYW1zLnJlbnRlZFRvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW50ZWRUbyA9IGNhclBhcmFtcy5yZW50ZWRUbztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjYXJQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gY2FyUGFyYW1zLnJlbnRhbFByaWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ib2R5VHlwZSA9IEJvZHlUeXBlcy5zZWRhbjtcbiAgICAgICAgICAgIHRoaXMubnVtYmVyT2ZTZWF0cyA9IDQ7XG4gICAgICAgICAgICB0aGlzLnRyYW5zbWlzc2lvbiA9IFRyYW5zbWlzc2lvbnMuYXV0b21hdGljO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJ1Y2sgZXh0ZW5kcyBWZWhpY2xlIHtcbiAgICBjYXJnb1R5cGU6IENhcmdvVHlwZXM7XG4gICAgY2FwYWNpdHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgaWQ6IHN0cmluZywgcHVibGljIG1ha2U6IHN0cmluZywgcHVibGljIG1vZGVsOiBzdHJpbmcsIHRydWNrUGFyYW1zPzogVHJ1Y2tQYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoaWQsIG1ha2UsIG1vZGVsKTtcbiAgICAgICAgaWYgKHRydWNrUGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IHRydWNrUGFyYW1zLmNhcmdvVHlwZTtcbiAgICAgICAgICAgIGlmICh0cnVja1BhcmFtcy5jYXBhY2l0eSA8IDApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIkNhcGFjaXR5IGNhbm5vdCBiZSBuZWdhdGl2ZVwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYXJnb1R5cGUgPSB0cnVja1BhcmFtcy5jYXJnb1R5cGU7XG4gICAgICAgICAgICB0aGlzLmNhcGFjaXR5ID0gdHJ1Y2tQYXJhbXMuY2FwYWNpdHk7XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGVkVG8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRlZFRvID0gdHJ1Y2tQYXJhbXMucmVudGVkVG87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHJ1Y2tQYXJhbXMucmVudGFsUHJpY2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbnRhbFByaWNlID0gdHJ1Y2tQYXJhbXMucmVudGFsUHJpY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNhcmdvVHlwZSA9IENhcmdvVHlwZXMuYm94O1xuICAgICAgICAgICAgdGhpcy5jYXBhY2l0eSA9IDI7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzcGFuLCBwLCBkaXYsIGZvcm0sIGxhYmVsLCBzdHJvbmcsIGlucHV0LCBidXR0b24gfSBmcm9tIFwiLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBMb2NhbFN0b3JhZ2UgfSBmcm9tIFwiLi9TdG9yYWdlXCI7XG5pbXBvcnQgeyBDYXJnb1R5cGVzLCBCb2R5VHlwZXMsIFRyYW5zbWlzc2lvbnMgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5jb25zdCBlbnVtTWFwID0ge1xuICAgIGNhcmdvVHlwZTogQ2FyZ29UeXBlcyxcbiAgICBib2R5VHlwZTogQm9keVR5cGVzLFxuICAgIHRyYW5zbWlzc2lvbjogVHJhbnNtaXNzaW9uc1xufVxuY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbmNvbnN0IGlkID0gdXJsUGFyYW1zLmdldCgnaWQnKTtcbmNvbnN0IGxzID0gbmV3IExvY2FsU3RvcmFnZSgpO1xuLy8gPGgzPk9wZWwgQ29yc2E8L2gzPlxuLy8gICAgICAgICAgICAgPGRpdiBjbGFzcz1cImRldGFpbHNcIj5cbi8vICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImNvbFwiPklEOjwvc3Bhbj48c3Ryb25nPjAwNzYtNWI1ODwvc3Ryb25nPjwvcD5cbi8vICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImNvbFwiPkJvZHkgdHlwZTo8L3NwYW4+PHN0cm9uZz5IYXRjaGJhY2s8L3N0cm9uZz48L3A+XG4vLyAgICAgICAgICAgICAgICAgPHA+PHNwYW4gY2xhc3M9XCJjb2xcIj5TZWF0czo8L3NwYW4+PHN0cm9uZz40PC9zdHJvbmc+PC9wPlxuLy8gICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwiY29sXCI+VHJhbnNtaXNzaW9uOjwvc3Bhbj48c3Ryb25nPk1hbnVhbDwvc3Ryb25nPjwvcD5cbi8vICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImNvbFwiPlJlbnRhbCBwcmljZTo8L3NwYW4+PHN0cm9uZz4kNTUvZGF5PC9zdHJvbmc+PC9wPlxuLy8gICAgICAgICAgICAgPC9kaXY+XG5cbi8vICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyZW50YWxcIj5cbi8vICAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cImNvbFwiPlN0YXR1czo8L3NwYW4+PHN0cm9uZz5BdmFpbGFibGUvUmVudGVkPC9zdHJvbmc+PC9wPlxuLy8gICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVwiY29sXCI+UmVudGVkIHRvOjwvc3Bhbj48c3Ryb25nPkpvaG4gU21pdGg8L3N0cm9uZz4gPGJ1dHRvbiBjbGFzcz1cImFjdGlvbiByZWxlYXNlXCI+RW5kXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBjb250cmFjdDwvYnV0dG9uPjwvcD5cbi8vICAgICAgICAgICAgICAgICA8Zm9ybT5cbi8vICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+UmVudCB0bzwvc3Bhbj5cbi8vICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJuYW1lXCI+XG4vLyAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XG4vLyAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJhY3Rpb24gcmVudFwiPkNvbmZpcm08L2J1dHRvbj5cbi8vICAgICAgICAgICAgICAgICA8L2Zvcm0+XG4vLyAgICAgICAgICAgICA8L2Rpdj5cbmZ1bmN0aW9uIGNyZWF0ZURldGFpbHNGb3JtKCkge1xuICAgIHJldHVybiBmb3JtKHt9LFxuICAgICAgICBsYWJlbCh7fSxcbiAgICAgICAgICAgIHNwYW4oe30sIFwiUmVudCB0b1wiKSxcbiAgICAgICAgICAgIGlucHV0KHsgdHlwZTogXCJ0ZXh0XCIsIG5hbWU6IFwibmFtZVwiIH0pKSxcbiAgICAgICAgYnV0dG9uKHsgY2xhc3NOYW1lOiBcImFjdGlvbiByZW50XCIgfSwgXCJDb25maXJtXCIpXG4gICAgKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZURldGFpbHMoKSB7XG4gICAgY29uc3QgY3VycmVudFZlaGljbGUgPSBhd2FpdCBnZXRDdXJyZW50VmVoaWNsZSgpO1xuICAgIGFsZXJ0KEpTT04uc3RyaW5naWZ5KGN1cnJlbnRWZWhpY2xlKSk7XG4gICAgY29uc3QgcHJvcHMgPSBPYmplY3QuZW50cmllcyhjdXJyZW50VmVoaWNsZSkubWFwKGt2ID0+IHtcbiAgICAgICAgbGV0IFtrLCB2XSA9IGt2O1xuICAgICAgICBpZiAoayBpbiBPYmplY3Qua2V5cyhlbnVtTWFwKSkge1xuICAgICAgICAgICAgdiA9IGVudW1NYXBba107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHAoe30sIHNwYW4oeyBjbGFzc05hbWU6IFwiY29sXCIgfSwgayksIHN0cm9uZyh7IGNsYXNzTmFtZTogXCJjb2xcIiB9LCB2ID09PSBudWxsID8gJycgOiB2LnRvU3RyaW5nKCkpKVxuICAgIH0pO1xuICAgIGNvbnN0IGRldGFpbHNEaXYgPSBkaXYoeyBjbGFzc05hbWU6IFwiZGV0YWlsc1wiIH0sIC4uLnByb3BzKTtcbiAgICBjb25zdCBmb3JtID0gY3JlYXRlRGV0YWlsc0Zvcm0oKTtcbiAgICBjb25zdCByZW50YWxEaXYgPSBkaXYoeyBjbGFzc05hbWU6IFwicmVudGFsXCIgfSxcbiAgICAgICAgcCh7fSwgc3Bhbih7IGNsYXNzbmFtZTogXCJjb2xcIiB9LCBcIlJlbnRlZCB0bzogIFwiKSxcbiAgICAgICAgICAgIHN0cm9uZyh7fSwgY3VycmVudFZlaGljbGVbXCJyZW50ZWRUb1wiXSA/IGN1cnJlbnRWZWhpY2xlW1wicmVudGVkVG9cIl0gOiBcIm5vb25lXCIpKSxcblxuICAgICAgICBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIHJlbGVhc2VcIiwgb25jbGljazogZW5kQ29udHJhY3QgfSwgXCJFbmQgY29udHJhY3RcIiksXG4gICAgICAgIGZvcm1cbiAgICApO1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcIm1haW5cIilbMF07XG4gICAgbWFpbi5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICBtYWluLmFwcGVuZENoaWxkKGRldGFpbHNEaXYpO1xuICAgIG1haW4uYXBwZW5kQ2hpbGQocmVudGFsRGl2KTtcblxufVxuYXN5bmMgZnVuY3Rpb24gZ2V0Q3VycmVudFZlaGljbGUoKSB7XG4gICAgY29uc3QgbHNWYWx1ZXMgPSBhd2FpdCBscy5nZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTtcbiAgICBjb25zdCBhbGxWZWhpY2xlcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbHNWYWx1ZXMpO1xuICAgIGNvbnN0IGN1cnJlbnRWZWhpY2xlID0gYWxsVmVoaWNsZXMuZmluZCh2ID0+IHYuaWQgPT09IGlkKTtcbiAgICByZXR1cm4gY3VycmVudFZlaGljbGU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGVuZENvbnRyYWN0KCkge1xuICAgIGFsZXJ0KFwiZW5kIGNvbnRyYWN0XCIpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBnZXRDdXJyZW50VmVoaWNsZSgpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gYCR7ZGF0YS50eXBlfXNgO1xuICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgZGVsZXRlIGRhdGEudHlwZTtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBhd2FpdCBscy51cGRhdGUoY29sbGVjdGlvbk5hbWUsIGlkLCB7IC4uLmRhdGEsIHJlbnRlZFRvOiBudWxsIH0pO1xufVxuXG5jcmVhdGVEZXRhaWxzKClcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==