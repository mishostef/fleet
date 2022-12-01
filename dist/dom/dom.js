export function dom(type, props, ...content) {
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
export const table = dom.bind(null, 'table');
export const thead = dom.bind(null, 'thead');
export const tbody = dom.bind(null, 'tbody');
export const tr = dom.bind(null, 'tr');
export const th = dom.bind(null, 'th');
export const td = dom.bind(null, 'td');
export const button = dom.bind(null, 'button');
export const span = dom.bind(null, 'span'); ///
export const label = dom.bind(null, 'label');
export const input = dom.bind(null, 'input');
export const select = dom.bind(null, 'select');
export const option = dom.bind(null, 'option');
export const form = dom.bind(null, 'form');
export const div = dom.bind(null, 'div');
//# sourceMappingURL=dom.js.map