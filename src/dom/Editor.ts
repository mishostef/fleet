import { Table } from "./Table";
export class Editor {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();

    constructor(private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[]) {
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.form.addEventListener('reset', (e) => {
            this.form.style.display = "none";
            (this.form.previousElementSibling as HTMLButtonElement).style.display = "block";
        })
        document.addEventListener('click', (e) => {
            this.listenForTableclick(e);

        })

    }
    private listenForTableclick(e: MouseEvent) {
        const target = e.target;
        if (target instanceof HTMLButtonElement) {
            const btnText = target.textContent;
            if (btnText == "Edit") {
                const activatedRow = (e.target as HTMLElement).parentElement.parentElement as HTMLTableRowElement;
                const keys = ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"];
                const record = this.getTableRecord(activatedRow, keys);
                keys.forEach(key => this.form[key].value = record[key]);
            }
        }
    }

    private getTableRecord(activatedRow: HTMLTableRowElement, keys: string[]) {
        return [...activatedRow.children].slice(1).reduce((a, b, index) => {
            const key = keys[index];
            if (key === "rentalPrice") {
                const r = /-?\d+/;
                const price = b.textContent.match(r);
                a[key] = Number(price[0]);
            } else {
                a[key] = b.textContent;
            }
            return a;
        }, {});
    }

    private onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const bodyType = formData.get('bodyType');
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}