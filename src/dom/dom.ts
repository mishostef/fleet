type DomContent = string | Node;

type elementFactory<T extends HTMLElement> = (props?: object, ...content: DomContent[]) => T;

export function dom(type: string, props?: object, ...content: DomContent[]) {
    const element = document.createElement(type);

    if (props) {
        for (let propName in props) {
            if (propName.startsWith('on')) {
                const eventName = propName.slice(2).toLowerCase();
                element.addEventListener(eventName, props[propName]);
            } else if (propName.startsWith('data')) {
                const dataName = propName.slice(4,5).toLowerCase() + propName.slice(5);
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

export const table: elementFactory<HTMLTableElement> = dom.bind(null, 'table');
export const thead: elementFactory<HTMLTableSectionElement> = dom.bind(null, 'thead');
export const tbody: elementFactory<HTMLTableSectionElement> = dom.bind(null, 'tbody');
export const tr: elementFactory<HTMLTableRowElement> = dom.bind(null, 'tr');
export const th: elementFactory<HTMLTableCellElement> = dom.bind(null, 'th');
export const td: elementFactory<HTMLTableCellElement> = dom.bind(null, 'td');
export const button: elementFactory<HTMLButtonElement> = dom.bind(null, 'button');
export const span: elementFactory<HTMLSpanElement> = dom.bind(null, 'span');