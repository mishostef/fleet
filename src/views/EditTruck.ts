import { span, input, label, select, option, button, form, div } from "../dom/dom";
import { getEnum } from "../trucks";

export function EditTruck(keys) {
    const enums = getEnum();
    
    const fields = keys.map(key => {
        for (let i = 0; i < enums.length; i++) {
            let en = enums[i];
            const enumKey = Object.keys(en)[0];
            const enumVals = Object.values(en[enumKey]).filter(v => isNaN(Number(v)));
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
    const editBtn = button({ className: "action confirm", type: "submit", id: "edit" }, "Save Car");
    const cancelBtn = button({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = div({}, editBtn, cancelBtn);
    return form({ className: "align", id: "edit" }, ...fields, buttonWrapperDiv)
}



