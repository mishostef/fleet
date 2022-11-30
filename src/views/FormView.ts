import { span, input, label, select, option, button, form, div } from "../dom/dom";
import{BodyTypes}from "../vehicle";

export function FormView(keys) {
    const fields = keys.map(key => {
        if (key === "bodyType") {
            const values = Object.keys(BodyTypes).filter(x => isNaN(Number(x)));
            console.log("enum values=", values);
            const options = values.map(val => option({value:val,textContent:val}));
            const currentSpan = span({}, "body type");
            const currentSelect = select({name:"bodyType"}, ...options);
            return label({}, currentSpan, currentSelect);
        }
        const currentSpan = span({}, key.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());
        const currentInput = input({ type: "text", name: key });
        const currentLabel = label({}, currentSpan, currentInput);
        return currentLabel;
    });
    const submitBtn = button({ className: "action confirm", type: "submit" }, "Add Car");
    const cancelBtn = button({ className: "action cancel", type: "reset" }, "Cancel");
    const buttonWrapperDiv = div({}, submitBtn, cancelBtn);
    return form({ className: "align" ,id:"create"}, ...fields, buttonWrapperDiv)
}