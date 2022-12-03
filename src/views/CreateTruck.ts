import { span, input, label, select, option, button, form, div } from "../dom/dom";
import { BodyTypes, Transmissions } from "../vehicle";
import { getEnum } from "../trucks";

export function CreateTruck(keys) {
    const enumNames = getEnum();
    console.log(enumNames)
    const fields = keys.map(key => {
        enumNames.forEach(en => {
            if (key === en) {
                const values = Object.keys(Transmissions).filter(x => isNaN(Number(x)));
                const options = values.map(val => option({ value: val, textContent: val }));
                const currentSpan = span({}, key);
                const currentSelect = select({ name: key }, ...options);
                return label({}, currentSpan, currentSelect);
            }
        })

        const currentSpan = span({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = input({ type: "text", name: key });
        return label({}, currentSpan, currentInput);
    });
    const submitBtn = button({ className: "action confirm", type: "submit", id: "create" }, "Add Car");
    const cancelBtn = button({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = div({}, submitBtn, cancelBtn);
    return form({ className: "align", id: "create" }, ...fields, buttonWrapperDiv)
}