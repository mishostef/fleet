export class Editor {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();

    constructor(private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[]) {
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.form.addEventListener('reset', (e) => { this.form.style.display = "none";
        (this.form.previousElementSibling as HTMLButtonElement).style.display = "block";
     })
    }
    private onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const bodyType = formData.get('bodyType');
        console.log([...formData.keys()]);
        console.log([...formData.values()]);
        console.log(this.propNames);
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}