export class Editor {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();

    constructor(private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[]) {
        this.form.addEventListener('submit', this.onSubmit.bind(this))

    }
    private onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}