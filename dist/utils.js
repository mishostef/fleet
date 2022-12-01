export function generateId() {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`;
}
export function getLocation() {
    return window.location.pathname.replace('/', '').split('.')[0];
}
//# sourceMappingURL=utils.js.map