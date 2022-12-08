import { CargoTypes, BodyTypes, Transmissions, Car, Truck } from "./models/vehicle";

export const tableKeys = {
    "truck": ["make", "model", "cargoType", "capacity", "rentalPrice"],
    "car": ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"]
};
export const enumMap = {
    cargoType: CargoTypes,
    bodyType: BodyTypes,
    transmission: Transmissions
}
export function generateId(): string {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`
}

export function getLocation(): string {
    return window.location.pathname.replace("/", "").split(".")[0];
}
export function getEnum(): any {
    const type = getLocation().slice(0, -1);//truck
    const kvp = {
        "truck": [{ cargoType: CargoTypes }],
        "car": [{ bodyType: BodyTypes }, { transmission: Transmissions }]
    }
    return kvp[type];
}

export function getClass(type: string, data: any) {
    const { id, make, model, ...rest } = data;
    return type === "car" ? new Car(id, make, model, rest) : new Truck(id, make, model, rest);
}

export function mapSelectsToValues(data: any) {
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

export function setFormValues(keys: string[], editForm: HTMLFormElement, record: {}) {
    const enums = getEnum();
    keys.forEach(key => {
        enums.forEach(en => {
            const enumKey = Object.keys(en)[0];
            if (key === enumKey) {
                const enumValsString = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
                const enumValsNumber = Object.values(en[enumKey]).filter(v => !isNaN(Number(v)));
                const currentSelectValue = record[enumKey];
                const index = enumValsString.indexOf(currentSelectValue);

                (editForm[key] as HTMLSelectElement).selectedIndex = Number(enumValsNumber[index]);
            }
        });
        editForm[key].value = record[key];
    });
}

export function getTableRecord(activatedRow: HTMLTableRowElement, keys: string[]) {
    return [...activatedRow.children].slice(1).reduce((a, b, index) => {
        const key = keys[index];
        if (key === "rentalPrice") {
            const r = /-?\d+/;
            const price = b.textContent.match(r);
            a[key] = Number(price[0]);
        } else {
            a[key] = b.textContent;
        }
        return a;
    }, {});
}

export function getNumberFromString(str: string): number {
    const r = /-?\d+/;
    const numbers = str.match(r);
    return Number(numbers[0]);
}