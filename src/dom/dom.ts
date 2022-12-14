type DomContent = string | Node;

type elementFactory<T extends HTMLElement> = (props?: object, ...content: DomContent[]) => T;

export function dom(type: string, props?: object, ...content: DomContent[]) {
    const element = document.createElement(type);

    if (props) {
        for (let propName in props) {
            if (propName.startsWith("on")) {
                const eventName = propName.slice(2).toLowerCase();
                element.addEventListener(eventName, props[propName]);
            } else if (propName.startsWith("data")) {
                const dataName = propName.slice(4, 5).toLowerCase() + propName.slice(5);
                element.dataset[dataName] = props[propName];
            } else {
                element[propName] = props[propName];
            }
        }
    }

    for (let item of content) {
        element.append(item);
    }

    return element;
}

export const table: elementFactory<HTMLTableElement> = dom.bind(null, "table");
export const thead: elementFactory<HTMLTableSectionElement> = dom.bind(null, "thead");
export const tbody: elementFactory<HTMLTableSectionElement> = dom.bind(null, "tbody");
export const tr: elementFactory<HTMLTableRowElement> = dom.bind(null, "tr");
export const th: elementFactory<HTMLTableCellElement> = dom.bind(null, "th");
export const td: elementFactory<HTMLTableCellElement> = dom.bind(null, "td");
export const button: elementFactory<HTMLButtonElement> = dom.bind(null, "button");
export const span: elementFactory<HTMLSpanElement> = dom.bind(null, "span");
export const label: elementFactory<HTMLLabelElement> = dom.bind(null, "label");
export const input: elementFactory<HTMLInputElement> = dom.bind(null, "input");
export const select: elementFactory<HTMLSelectElement> = dom.bind(null, "select");
export const option: elementFactory<HTMLOptionElement> = dom.bind(null, "option");
export const form: elementFactory<HTMLFormElement> = dom.bind(null, "form");
export const div: elementFactory<HTMLDivElement> = dom.bind(null, "div");
export const a: elementFactory<HTMLAnchorElement> = dom.bind(null, "a");
export const p: elementFactory<HTMLParagraphElement> = dom.bind(null, "p");
export const h3: elementFactory<HTMLHeadingElement> = dom.bind(null, "h3");
export const strong: elementFactory<HTMLSpanElement> = dom.bind(null, "strong");