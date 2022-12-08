export class Editor {
    constructor(private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[], originator?: HTMLButtonElement) {
        this.form.addEventListener("submit", this.onSubmit.bind(this));
        this.form.addEventListener("reset", (e) => {
            this.form.style.display = "none";
            if (originator) originator.style.display = "block";
        });
    }

    private async onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const rentalPrice = formData.get("rentalPrice").toString();
        formData.set("rentalPrice", rentalPrice);
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));

        try {
            await this.callback(data);
        } catch (error) {
            alert(error);
        }

    }
}