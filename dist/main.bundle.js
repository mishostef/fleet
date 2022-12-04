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



const ls = new _Storage__WEBPACK_IMPORTED_MODULE_0__.LocalStorage();
const form = document.getElementById("overviewForm");
const urlParams = new URLSearchParams(window.location.search);
const selectedCollection = urlParams.get('type');
const showAvailable = (urlParams.get("availableOnly"));
const table = document.getElementsByTagName('table')[0];
console.log(table);
const tableManager = new _dom_Table__WEBPACK_IMPORTED_MODULE_1__.Table(table, createOverviewRow, identify);
(async function () {
    const records = await getRecordsByQuery();
    hidrate(tableManager, records);
}());
form.addEventListener("submit", async function (e) {
    let records = await getRecordsByQuery();
    console.log('in event records=', records);
    tableManager.clear();
    hidrate(tableManager, records);
});
async function getRecordsByQuery() {
    // const urlParams = new URLSearchParams(window.location.search);
    // const selectedCollection = urlParams.get('type');
    // const showAvailable = (urlParams.get("availableOnly"));
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
    console.log(extendedVehicle);
    console.log(Object.keys(extendedVehicle));
    console.log(Object.entries(extendedVehicle));
    const row = (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.tr)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.id), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.type), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.make), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.model), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, `$${extendedVehicle.rentalPrice.toString()}/day`), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, extendedVehicle.status), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.td)({}, (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.button)({ className: "action edit" }, 'Edit'), (0,_dom_dom__WEBPACK_IMPORTED_MODULE_2__.button)({ className: "action delete" }, 'Delete')));
    return row;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM3QyxNQUFNLEdBQUcsR0FBRyw0Q0FBRSxDQUFDLEVBQUUsRUFDYiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsRUFBRSxDQUFDLEVBQzFCLDRDQUFFLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFDNUIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUM1Qiw0Q0FBRSxDQUFDLEVBQUUsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQzdCLDRDQUFFLENBQUMsRUFBRSxFQUFFLElBQUksZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQ3hELDRDQUFFLENBQUMsRUFBRSxFQUFFLGVBQWUsQ0FBQyxNQUFNLENBQUMsRUFDOUIsNENBQUUsQ0FBQyxFQUFFLEVBQUUsZ0RBQU0sQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxnREFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQ3pHLENBQUM7SUFFRixPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9TdG9yYWdlLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL2RvbS9UYWJsZS50cyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci8uL3NyYy9kb20vZG9tLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9mbGVldC1tYW5hZ2VyLW1hc3Rlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2ZsZWV0LW1hbmFnZXItbWFzdGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZmxlZXQtbWFuYWdlci1tYXN0ZXIvLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHNcIjtcbmV4cG9ydCB0eXBlIFJlY29yZElkID0gc3RyaW5nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZCB7XG4gICAgaWQ6IFJlY29yZElkXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JhZ2Uge1xuICAgIGdldEFsbChjb2xsZWN0aW9uTmFtZTogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmRbXT47XG4gICAgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogUmVjb3JkSWQpOiBQcm9taXNlPFJlY29yZD47XG4gICAgY3JlYXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGRhdGE6IGFueSk6IFByb21pc2U8UmVjb3JkPjtcbiAgICB1cGRhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgaWQ6IFJlY29yZElkLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD47XG4gICAgZGVsZXRlKGNvbGxlY3Rpb25OYW1lOiBzdHJpbmcsIGlkOiBSZWNvcmRJZCk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBMb2NhbFN0b3JhZ2UgaW1wbGVtZW50cyBTdG9yYWdlIHtcbiAgICBhc3luYyBnZXRBbGwoY29sbGVjdGlvbk5hbWU6IHN0cmluZyk6IFByb21pc2U8UmVjb3JkW10+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oY29sbGVjdGlvbk5hbWUpIHx8IG51bGwpIHx8IFtdO1xuICAgIH1cbiAgICBhc3luYyBnZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTogUHJvbWlzZTxSZWNvcmRbXT4ge1xuICAgICAgICBjb25zdCBvYmogPSBPYmplY3Qua2V5cyhsb2NhbFN0b3JhZ2UpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGspID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5vYmosIFtrXTogKEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oaykpKS5tYXAoeCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4LnR5cGUgPSBrLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB4IDtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG5cbiAgICB9XG4gICAgYXN5bmMgZ2V0QnlJZChjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGl0ZW1zLmZpbmQoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBhc3luYyBjcmVhdGUoY29sbGVjdGlvbk5hbWU6IHN0cmluZywgZGF0YTogYW55KTogUHJvbWlzZTxSZWNvcmQ+IHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCB0aGlzLmdldEFsbChjb2xsZWN0aW9uTmFtZSk7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IE9iamVjdC5hc3NpZ24oe30sIGRhdGEsIHsgaWQ6IGdlbmVyYXRlSWQoKSB9KTtcbiAgICAgICAgaXRlbXMucHVzaChyZWNvcmQpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIHVwZGF0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBkYXRhOiBhbnkpOiBQcm9taXNlPFJlY29yZD4ge1xuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IHRoaXMuZ2V0QWxsKGNvbGxlY3Rpb25OYW1lKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBpdGVtcy5maW5kSW5kZXgoaSA9PiBpLmlkID09IGlkKTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYFJlY29yZCAke2lkfSBub3QgZm91bmQgaW4gXCIke2NvbGxlY3Rpb25OYW1lfVwiYCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVjb3JkID0gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBpZCB9KTtcbiAgICAgICAgaXRlbXNbaW5kZXhdID0gcmVjb3JkO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcblxuICAgICAgICByZXR1cm4gcmVjb3JkO1xuICAgIH1cblxuICAgIGFzeW5jIGRlbGV0ZShjb2xsZWN0aW9uTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgdGhpcy5nZXRBbGwoY29sbGVjdGlvbk5hbWUpO1xuICAgICAgICBjb25zdCBpbmRleCA9IGl0ZW1zLmZpbmRJbmRleChpID0+IGkuaWQgPT0gaWQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihgUmVjb3JkICR7aWR9IG5vdCBmb3VuZCBpbiBcIiR7Y29sbGVjdGlvbk5hbWV9XCJgKTtcbiAgICAgICAgfVxuICAgICAgICBpdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShjb2xsZWN0aW9uTmFtZSwgSlNPTi5zdHJpbmdpZnkoaXRlbXMpKTtcbiAgICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlIHtcbiAgICBwcml2YXRlIHJlY29yZHM6IGFueVtdID0gW107XG4gICAgcHJpdmF0ZSByb3dzOiBNYXA8b2JqZWN0LCBIVE1MVGFibGVSb3dFbGVtZW50PiA9IG5ldyBNYXAoKTtcbiAgICAvL3B1YmxpYyBhY3RpdmF0ZWRSb3c6IEhUTUxUYWJsZVJvd0VsZW1lbnQgPSBudWxsO1xuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwdWJsaWMgZWxlbWVudDogSFRNTFRhYmxlRWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVSb3c6IChyZWNvcmQ6IGFueSkgPT4gSFRNTFRhYmxlUm93RWxlbWVudCxcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmeT86IChyZWNvcmRzOiBhbnlbXSwgaWQ6IGFueSkgPT4gYW55LFxuICAgICAgICByZWNvcmRzPzogYW55W11cbiAgICApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZHJlbih0aGlzLmVsZW1lbnQuY2hpbGRyZW5bMF0pO1xuICAgICAgICBpZiAocmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRzID0gcmVjb3JkcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY29yZHMuZm9yRWFjaCh0aGlzLmFkZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHsvLy9hZGRlZCBkZWxldGUgZnVuY3Rpb25hbGl0eVxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEJ1dHRvbkVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQudGV4dENvbnRlbnQgPT09IFwiRGVsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0aXZhdGVkUm93ID0gZS50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50IGFzIEhUTUxUYWJsZVJvd0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJvd0luZGV4ID0gYWN0aXZhdGVkUm93LnJvd0luZGV4IC0gMTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVsZXRlUm93ID0gdGhpcy5yZWNvcmRzW3Jvd0luZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSBkZWxldGVSb3dbXCJpZFwiXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpcm0oYEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgJHtpZH1gKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmUoaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGFkZChyZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmNyZWF0ZVJvdyhyZWNvcmQpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgdGhpcy5yZWNvcmRzLnB1c2gocmVjb3JkKTtcbiAgICAgICAgdGhpcy5yb3dzLnNldChyZWNvcmQsIHJvdyk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKHRoaXMuZWxlbWVudC5jaGlsZHJlblswXSk7XG4gICAgICAgIHRoaXMucmVjb3JkcyA9IFtdO1xuICAgIH1cbiAgICBnZXQoaWQ6IGFueSk6IGFueSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pZGVudGlmeSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmlkZW50aWZ5KHRoaXMucmVjb3JkcywgaWQpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0luZGV0aXR5IGZ1bmN0aW9uIG5vdCBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBnZXRSb3coaWQ6IGFueSk6IEhUTUxUYWJsZVJvd0VsZW1lbnQge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIHJldHVybiB0aGlzLnJvd3MuZ2V0KHJlY29yZCk7XG4gICAgfVxuXG4gICAgcmVwbGFjZShpZDogYW55LCBuZXdSZWNvcmQ6IGFueSkge1xuICAgICAgICBjb25zdCByZWNvcmQgPSB0aGlzLmdldChpZCk7XG4gICAgICAgIC8vY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCBpbmRleCA9IFsuLi50aGlzLnJvd3Mua2V5cygpXS5maW5kSW5kZXgoeCA9PiB4WydpZCddID0gaWQpO1xuICAgICAgICAvLyBVcGRhdGUgcm93IGluIERPTSBhbmQgY29sbGVjdGlvblxuICAgICAgICBjb25zdCBmID0gdGhpcy5jcmVhdGVSb3cuYmluZCh0aGlzKTtcbiAgICAgICAgY29uc3QgbmV3Um93ID0gZihuZXdSZWNvcmQpO1xuICAgICAgICAvLyByb3cucmVwbGFjZVdpdGgobmV3Um93KTtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlcGxhY2VDaGlsZChuZXdSb3csIHRoaXMuZWxlbWVudC5jaGlsZE5vZGVzLml0ZW0oaW5kZXggKyAxKSk7XG4gICAgICAgIHRoaXMucm93cy5zZXQocmVjb3JkLCBuZXdSb3cpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSByZWNvcmQgaW4gY29sbGVjdGlvblxuICAgICAgICB0aGlzLnJlY29yZHMuc3BsaWNlKGluZGV4LCAxLCBuZXdSZWNvcmQpO1xuICAgIH1cblxuICAgIHJlbW92ZShpZDogYW55KSB7XG4gICAgICAgIGNvbnN0IHJlY29yZCA9IHRoaXMuZ2V0KGlkKTtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnJlY29yZHMuZmluZEluZGV4KHIgPT4gciA9PSByZWNvcmQpO1xuICAgICAgICBjb25zdCByb3cgPSB0aGlzLmdldFJvdyhpZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJvdyBpbiBET00gYW5kIGNvbGxlY3Rpb25cbiAgICAgICAgcm93LnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnJvd3MuZGVsZXRlKHJlY29yZCk7XG5cbiAgICAgICAgLy8gVXBkYXRlIHJlY29yZCBpbiBjb2xsZWN0aW9uXG4gICAgICAgIHRoaXMucmVjb3Jkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbn0iLCJ0eXBlIERvbUNvbnRlbnQgPSBzdHJpbmcgfCBOb2RlO1xuXG50eXBlIGVsZW1lbnRGYWN0b3J5PFQgZXh0ZW5kcyBIVE1MRWxlbWVudD4gPSAocHJvcHM/OiBvYmplY3QsIC4uLmNvbnRlbnQ6IERvbUNvbnRlbnRbXSkgPT4gVDtcblxuZXhwb3J0IGZ1bmN0aW9uIGRvbSh0eXBlOiBzdHJpbmcsIHByb3BzPzogb2JqZWN0LCAuLi5jb250ZW50OiBEb21Db250ZW50W10pIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcblxuICAgIGlmIChwcm9wcykge1xuICAgICAgICBmb3IgKGxldCBwcm9wTmFtZSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBwcm9wTmFtZS5zbGljZSgyKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHByb3BzW3Byb3BOYW1lXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BOYW1lLnN0YXJ0c1dpdGgoJ2RhdGEnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFOYW1lID0gcHJvcE5hbWUuc2xpY2UoNCwgNSkudG9Mb3dlckNhc2UoKSArIHByb3BOYW1lLnNsaWNlKDUpO1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuZGF0YXNldFtkYXRhTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaXRlbSBvZiBjb250ZW50KSB7XG4gICAgICAgIGVsZW1lbnQuYXBwZW5kKGl0ZW0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgY29uc3QgdGFibGU6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RhYmxlJyk7XG5leHBvcnQgY29uc3QgdGhlYWQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZVNlY3Rpb25FbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0aGVhZCcpO1xuZXhwb3J0IGNvbnN0IHRib2R5OiBlbGVtZW50RmFjdG9yeTxIVE1MVGFibGVTZWN0aW9uRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndGJvZHknKTtcbmV4cG9ydCBjb25zdCB0cjogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlUm93RWxlbWVudD4gPSBkb20uYmluZChudWxsLCAndHInKTtcbmV4cG9ydCBjb25zdCB0aDogZWxlbWVudEZhY3Rvcnk8SFRNTFRhYmxlQ2VsbEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3RoJyk7XG5leHBvcnQgY29uc3QgdGQ6IGVsZW1lbnRGYWN0b3J5PEhUTUxUYWJsZUNlbGxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICd0ZCcpO1xuZXhwb3J0IGNvbnN0IGJ1dHRvbjogZWxlbWVudEZhY3Rvcnk8SFRNTEJ1dHRvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2J1dHRvbicpO1xuZXhwb3J0IGNvbnN0IHNwYW46IGVsZW1lbnRGYWN0b3J5PEhUTUxTcGFuRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnc3BhbicpOy8vL1xuZXhwb3J0IGNvbnN0IGxhYmVsOiBlbGVtZW50RmFjdG9yeTxIVE1MTGFiZWxFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdsYWJlbCcpO1xuZXhwb3J0IGNvbnN0IGlucHV0OiBlbGVtZW50RmFjdG9yeTxIVE1MSW5wdXRFbGVtZW50PiA9IGRvbS5iaW5kKG51bGwsICdpbnB1dCcpO1xuZXhwb3J0IGNvbnN0IHNlbGVjdDogZWxlbWVudEZhY3Rvcnk8SFRNTFNlbGVjdEVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ3NlbGVjdCcpO1xuZXhwb3J0IGNvbnN0IG9wdGlvbjogZWxlbWVudEZhY3Rvcnk8SFRNTE9wdGlvbkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ29wdGlvbicpO1xuZXhwb3J0IGNvbnN0IGZvcm06IGVsZW1lbnRGYWN0b3J5PEhUTUxGb3JtRWxlbWVudD4gPSBkb20uYmluZChudWxsLCAnZm9ybScpO1xuZXhwb3J0IGNvbnN0IGRpdjogZWxlbWVudEZhY3Rvcnk8SFRNTERpdkVsZW1lbnQ+ID0gZG9tLmJpbmQobnVsbCwgJ2RpdicpOyIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2Nzc3MjE1KS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuIGAke2Z1bmMoKX0tJHtmdW5jKCl9YFxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9jYXRpb24oKTpzdHJpbmd7XG4gICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKCcvJywnJykuc3BsaXQoJy4nKVswXTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgTG9jYWxTdG9yYWdlIH0gZnJvbSBcIi4vU3RvcmFnZVwiO1xuaW1wb3J0IHsgSVZlaGljbGUsIFZlaGljbGUgfSBmcm9tIFwiLi92ZWhpY2xlXCI7XG5pbXBvcnQgeyBFZGl0b3IgfSBmcm9tIFwiLi9kb20vRWRpdG9yXCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCIuL2RvbS9UYWJsZVwiO1xuaW1wb3J0IHsgdHIsIHRkLCBzcGFuLCBidXR0b24gfSBmcm9tIFwiLi9kb20vZG9tXCI7XG5pbXBvcnQgeyBJVHlwZSwgb3ZlcnZpZXdPcHRpb25zLCBJU3RhdHVzIH0gZnJvbSBcIi4vbWFpbnR5cGVzXCI7XG5jb25zdCBscyA9IG5ldyBMb2NhbFN0b3JhZ2UoKTtcblxuY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3ZlcnZpZXdGb3JtXCIpIGFzIEhUTUxGb3JtRWxlbWVudDtcbmNvbnN0IHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMod2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG5jb25zdCBzZWxlY3RlZENvbGxlY3Rpb24gPSB1cmxQYXJhbXMuZ2V0KCd0eXBlJyk7XG5jb25zdCBzaG93QXZhaWxhYmxlID0gKHVybFBhcmFtcy5nZXQoXCJhdmFpbGFibGVPbmx5XCIpKTtcblxuY29uc3QgdGFibGUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndGFibGUnKVswXTtcbmNvbnNvbGUubG9nKHRhYmxlKTtcbmNvbnN0IHRhYmxlTWFuYWdlciA9IG5ldyBUYWJsZSh0YWJsZSwgY3JlYXRlT3ZlcnZpZXdSb3csIGlkZW50aWZ5KTtcbihhc3luYyBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgcmVjb3JkcyA9IGF3YWl0IGdldFJlY29yZHNCeVF1ZXJ5KCk7XG4gICAgaGlkcmF0ZSh0YWJsZU1hbmFnZXIsIHJlY29yZHMpO1xufSgpKVxuXG5mb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgYXN5bmMgZnVuY3Rpb24gKGUpIHtcbiAgICBsZXQgcmVjb3JkcyA9IGF3YWl0IGdldFJlY29yZHNCeVF1ZXJ5KCk7XG4gICAgY29uc29sZS5sb2coJ2luIGV2ZW50IHJlY29yZHM9JywgcmVjb3Jkcyk7XG4gICAgdGFibGVNYW5hZ2VyLmNsZWFyKCk7XG4gICAgaGlkcmF0ZSh0YWJsZU1hbmFnZXIsIHJlY29yZHMpO1xufSk7XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjb3Jkc0J5UXVlcnkoKSB7XG4gICAgLy8gY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAvLyBjb25zdCBzZWxlY3RlZENvbGxlY3Rpb24gPSB1cmxQYXJhbXMuZ2V0KCd0eXBlJyk7XG4gICAgLy8gY29uc3Qgc2hvd0F2YWlsYWJsZSA9ICh1cmxQYXJhbXMuZ2V0KFwiYXZhaWxhYmxlT25seVwiKSk7XG4gICAgbGV0IHJlY29yZHMgPSBzZWxlY3RlZENvbGxlY3Rpb24gPT09IFwiYWxsXCIgfHwgc2VsZWN0ZWRDb2xsZWN0aW9uID09PSBudWxsID9cbiAgICAgICAgZ2V0QWxsVGFibGVSZWNvcmRzKCkgOlxuICAgICAgICAoYXdhaXQgbHMuZ2V0QWxsKHNlbGVjdGVkQ29sbGVjdGlvbikpLm1hcCh2ZWhpY2xlID0+IHtcbiAgICAgICAgICAgICh2ZWhpY2xlIGFzIGFueSkudHlwZSA9IHNlbGVjdGVkQ29sbGVjdGlvbi5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICByZXR1cm4gdmVoaWNsZTtcbiAgICAgICAgfSkubWFwKGNyZWF0ZU92ZXJ2aWV3VGFibGVSZWNvcmQpO1xuICAgIGlmIChzaG93QXZhaWxhYmxlKSB7XG4gICAgICAgIHJlY29yZHMgPSAocmVjb3JkcyBhcyBhbnkpLmZpbHRlcihyZWMgPT4gcmVjLnN0YXR1cyA9PT0gXCJBdmFpbGFibGVcIik7XG4gICAgfVxuICAgIHJldHVybiByZWNvcmRzO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRBbGxUYWJsZVJlY29yZHMoKSB7XG4gICAgY29uc3QgbHNWYWx1ZXMgPSBhd2FpdCBscy5nZXRBbGxDb2xsZWN0aW9uc0RhdGEoKTtcbiAgICBjb25zdCBhbGxWZWhpY2xlcyA9IFtdLmNvbmNhdC5hcHBseShbXSwgbHNWYWx1ZXMpO1xuICAgIGNvbnN0IHRhYmxlUmVjb3JkcyA9IGFsbFZlaGljbGVzLm1hcChjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKTtcbiAgICByZXR1cm4gdGFibGVSZWNvcmRzO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPdmVydmlld1RhYmxlUmVjb3JkKHZlaGljbGU6IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpZDogdmVoaWNsZS5pZCxcbiAgICAgICAgdHlwZTogdmVoaWNsZS50eXBlLFxuICAgICAgICBtYWtlOiB2ZWhpY2xlLm1ha2UsXG4gICAgICAgIG1vZGVsOiB2ZWhpY2xlLm1vZGVsLFxuICAgICAgICByZW50YWxQcmljZTogdmVoaWNsZS5yZW50YWxQcmljZSxcbiAgICAgICAgc3RhdHVzOiB2ZWhpY2xlLnJlbnRlZFRvID8gXCJSZW50ZWRcIiA6IFwiQXZhaWxhYmxlXCJcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGhpZHJhdGUodGFibGVNYW5hZ2VyOiBUYWJsZSwgcmVjb3Jkcz86IElWZWhpY2xlICYgSVR5cGUpIHtcbiAgICBjb25zdCB2ZWhpY2xlcyA9IHJlY29yZHMgPyByZWNvcmRzIDogYXdhaXQgZ2V0QWxsVGFibGVSZWNvcmRzKCk7XG4gICAgdmVoaWNsZXMuZm9yRWFjaCh2ZWhpY2xlID0+IHRhYmxlTWFuYWdlci5hZGQodmVoaWNsZSkpO1xufVxuXG5cbmZ1bmN0aW9uIGlkZW50aWZ5KGNhcnM6IElWZWhpY2xlW10sIGlkOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gY2Fycy5maW5kKGUgPT4gZS5pZCA9PSBpZCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU92ZXJ2aWV3Um93KGV4dGVuZGVkVmVoaWNsZTogSVZlaGljbGUgJiBJVHlwZSAmIElTdGF0dXMpIHtcbiAgICBjb25zb2xlLmxvZyhleHRlbmRlZFZlaGljbGUpO1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5rZXlzKGV4dGVuZGVkVmVoaWNsZSkpO1xuICAgIGNvbnNvbGUubG9nKE9iamVjdC5lbnRyaWVzKGV4dGVuZGVkVmVoaWNsZSkpO1xuICAgIGNvbnN0IHJvdyA9IHRyKHt9LFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLmlkKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS50eXBlKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5tYWtlKSxcbiAgICAgICAgdGQoe30sIGV4dGVuZGVkVmVoaWNsZS5tb2RlbCksXG4gICAgICAgIHRkKHt9LCBgJCR7ZXh0ZW5kZWRWZWhpY2xlLnJlbnRhbFByaWNlLnRvU3RyaW5nKCl9L2RheWApLFxuICAgICAgICB0ZCh7fSwgZXh0ZW5kZWRWZWhpY2xlLnN0YXR1cyksXG4gICAgICAgIHRkKHt9LCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGVkaXRcIiB9LCAnRWRpdCcpLCBidXR0b24oeyBjbGFzc05hbWU6IFwiYWN0aW9uIGRlbGV0ZVwiIH0sICdEZWxldGUnKSlcbiAgICApO1xuXG4gICAgcmV0dXJuIHJvdztcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==