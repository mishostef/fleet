export function generateId(): string {
    const func = () => Math.floor(Math.random() * 16777215).toString(16);
    return `${func()}-${func()}`
}
