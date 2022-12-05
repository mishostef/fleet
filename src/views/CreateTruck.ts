import { span, input, label, select, option, button, form, div } from "../dom/dom";
import { getEnum } from "../trucks";
import { getLocation } from "../utils";


export function CreateTruck(keys) {
    const enums = getEnum();
    console.log(enums);

    const fields = keys.map(key => {
        for (let i = 0; i < enums.length; i++) {
            let en = enums[i];
            const enumKey = Object.keys(en)[0];
            console.log(key);
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
            console.log(enumVals);
            if (key === enumKey) {
                const values = enumVals;
                const options = values.map(val => option({ value: val, textContent: val }));
                const currentSpan = span({}, key);
                const currentSelect = select({ name: key }, ...options);
                return label({}, currentSpan, currentSelect);
            }
        }

        const currentSpan = span({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = input({ type: "text", name: key });
        return label({}, currentSpan, currentInput);
    });
    const type = getLocation().slice(0, -1);
    const capitalizedType = type[0].toLocaleUpperCase() + type.slice(1);
    const submitBtn = button({ className: "action confirm", type: "submit", id: "create" }, `Add ${capitalizedType}`);
    const cancelBtn = button({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = div({}, submitBtn, cancelBtn);
    return form({ className: "align", id: "create" }, ...fields, buttonWrapperDiv)
}