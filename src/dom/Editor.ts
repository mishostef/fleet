
export class Editor {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();
    private editButton: HTMLButtonElement = null;
    private createButton: HTMLButtonElement = null;
    constructor(private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[]) {
        this.editButton = this.form.querySelector("#edit") as HTMLButtonElement;
        this.createButton = this.form.querySelector("#create") as HTMLButtonElement;
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.form.addEventListener('reset', (e) => {
            this.form.style.display = "none";
            (this.form.previousElementSibling as HTMLButtonElement).style.display = "block";
        });

    }
    
    private onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const bodyType = formData.get('bodyType');
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}