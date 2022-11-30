export class Table {
    private records: any[] = [];
    private rows: Map<object, HTMLTableRowElement> = new Map();

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
        const row = this.getRow(id);

        // Update row in DOM and collection
        const newRow = this.createRow(newRecord);
        row.replaceWith(newRow);
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