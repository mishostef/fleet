import { span, input, label, select, option, button, form, div } from "./dom/dom";
import { BodyTypes, Transmissions } from "./vehicle";
export function FormView(keys, mode = false) {
    const fields = keys.map(key => {
        if (key === "bodyType") {
            const values = Object.keys(BodyTypes).filter(x => isNaN(Number(x)));
            const options = values.map(val => option({ value: val, textContent: val }));
            const currentSpan = span({}, "body type");
            const currentSelect = select({ name: "bodyType" }, ...options);
            return label({}, currentSpan, currentSelect);
        }
        if (key === "transmission") {
            const values = Object.keys(Transmissions).filter(x => isNaN(Number(x)));
            const options = values.map(val => option({ value: val, textContent: val }));
            const currentSpan = span({}, "transmission");
            const currentSelect = select({ name: "transmission" }, ...options);
            return label({}, currentSpan, currentSelect);
        }
        const currentSpan = span({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = input({ type: "text", name: key });
        return label({}, currentSpan, currentInput);
    });
    const editBtn = button({ className: "action confirm", type: "submit", id: "edit" }, "Save Car");
    editBtn.style.display = mode ? "block" : "none";
    const submitBtn = button({ className: "action confirm", type: "submit", id: "create" }, "Add Car");
    submitBtn.style.display = mode ? "none" : "block";
    const cancelBtn = button({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = div({}, editBtn, submitBtn, cancelBtn);
    return form({ className: "align", id: "create" }, ...fields, buttonWrapperDiv);
}
//# sourceMappingURL=cars.js.map