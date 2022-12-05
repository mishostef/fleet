import { CargoTypes, BodyTypes, Transmissions, Car, Truck } from "./vehicle";

export function generateId(): string {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`
}

export function getLocation(): string {
    return window.location.pathname.replace('/', '').split('.')[0];
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