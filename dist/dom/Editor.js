export class Editor {
    form;
    callback;
    propNames;
    records = [];
    rows = new Map();
    editButton = null;
    createButton = null;
    constructor(form, callback, propNames) {
        this.form = form;
        this.callback = callback;
        this.propNames = propNames;
        this.editButton = this.form.querySelector("#edit");
        this.createButton = this.form.querySelector("#create");
        this.form.addEventListener('submit', this.onSubmit.bind(this));
        this.form.addEventListener('reset', (e) => {
            this.form.style.display = "none";
            this.form.previousElementSibling.style.display = "block";
        });
        document.addEventListener('click', (e) => {
            this.listenForTableclick(e);
        });
    }
    listenForTableclick(e) {
        const target = e.target;
        if (target instanceof HTMLButtonElement) {
            const btnText = target.textContent;
            if (btnText == "Edit") {
                const activatedRow = e.target.parentElement.parentElement;
                const keys = ["make", "model", "bodyType", "numberOfSeats", "transmission", "rentalPrice"];
                const record = this.getTableRecord(activatedRow, keys);
                keys.forEach(key => this.form[key].value = record[key]);
                this.editButton.style.display = "block";
                this.createButton.style.display = "none";
            }
        }
    }
    getTableRecord(activatedRow, keys) {
        return [...activatedRow.children].slice(1).reduce((a, b, index) => {
            const key = keys[index];
            if (key === "rentalPrice") {
                const r = /-?\d+/;
                const price = b.textContent.match(r);
                a[key] = Number(price[0]);
            }
            else {
                a[key] = b.textContent;
            }
            return a;
        }, {});
    }
    onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const bodyType = formData.get('bodyType');
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}
//# sourceMappingURL=Editor.js.map