export class Table {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();
    //public activatedRow: HTMLTableRowElement = null;
    constructor(
        public element: HTMLTableElement,
        private createRow: (record: any) => HTMLTableRowElement,
        private identify?: (records: any[], id: any) => any,
        records?: any[]
    ) {
        this.element.replaceChildren(this.element.children[0]);
        if (records) {
            this.records = records;
        }
        this.records.forEach(this.add.bind(this));
        this.element.addEventListener('click', (e) => {///added delete functionality
            if (e.target instanceof HTMLButtonElement) {
                if (e.target.textContent === "Delete") {
                    const activatedRow = e.target.parentElement.parentElement as HTMLTableRowElement;
                    const rowIndex = activatedRow.rowIndex - 1;
                    const deleteRow = this.records[rowIndex];
                    const id = deleteRow["id"];
                    if (confirm(`Are you sure you want to delete ${id}`)) {
                        this.remove(id);
                    }
                }
            }
        })
    }

    add(record: any) {
        const row = this.createRow(record);
        this.element.appendChild(row);
        this.records.push(record);
        this.rows.set(record, row);
    }

    get(id: any): any {
        if (typeof this.identify == 'function') {
            const result = this.identify(this.records, id);
            return result;
        }
        throw new ReferenceError('Indetity function not specified');
    }

    getRow(id: any): HTMLTableRowElement {
        const record = this.get(id);
        return this.rows.get(record);
    }

    replace(id: any, newRecord: any) {
        const record = this.get(id);
        const index = this.records.findIndex(r => r == record);
        //const row = this.getRow(id);
        const rowIndex = [...this.rows.keys()]////
        const r = [...this.rows.keys()].findIndex(x => x['id'] = id);
        const row = this.element.childNodes.item(r+1)///this.rows.get(r);

        //console.log('htmlRow=',row);
        console.log(rowIndex)
        console.log('r=', r)
        //const rr = this.rows.get(rowIndex);
        // Update row in DOM and collection
        const f=this.createRow.bind(this);
        const newRow = f(newRecord);
        row.replaceWith(newRow);
        this.element.replaceChild(newRow,this.element.childNodes.item(r+1));
        this.rows.set(record, newRow);

        // Update record in collection
        this.records.splice(index, 1, newRecord);
    }

    remove(id: any) {
        const record = this.get(id);
        const index = this.records.findIndex(r => r == record);
        const row = this.getRow(id);

        // Update row in DOM and collection
        row.remove();
        this.rows.delete(record);

        // Update record in collection
        this.records.splice(index, 1);
    }
}