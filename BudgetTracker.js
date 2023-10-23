export default class BudgetTracker {


    constructor(querySelectorString) {

        this.root = document.querySelector(querySelectorString);
        this.root.innerHTML = BudgetTracker.html();

        this.root.querySelector(".new-entry").addEventListener("click", () => {
            this.onNewEntryBtnClick();

        });

        // Load initial data from Local Storage
        this.load();
    }

    static html() {

        return `
        
        <table class="budget-tracker">

        <!--head of the table to describe columns-->
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th></th>
                

                
                


            </tr>
        </thead>

        <!--to enter in entries in the body of table. td is table data cell-->
        <tbody class="entries"></tbody>

        <!-- another row for additing new entry-->
        <tbody>

            <tr>
                <td colspan="5" class="controls">
                    <button type="button" class="new-entry">New Entry</button>
                </td>
            </tr>
        </tbody>

        <!-- footer that shows the summary
        -->
        <tfoot>

            <tr>
                <td colspan="5" class="summary">
                    <strong>Total:</strong>
                    <span class="total">$0.00</span>
                </td>
            </tr>
        </tfoot>

    </table>
        `;

    }

    static entryHtml(){

        return `
            <tr>
                <td>
                    <input class="input input-date" type="date">
                </td>

                <td>
                    <input class="input input-description" type="text" placeholder="add a description (e.g income, bills, travel cost..)">
                </td>

                <td>
                    <select class="input input-type">
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </td>

                <td>
                    <input type="number" class="input input-amount">
                </td>

                <td>
                    <button class="delete-entry">&#10005;</button>
                </td>


            </tr>
        `;

    }

    load() {
        //this line is to load previous data from local storage. If you want fresh data to come in when you run the app,
        //then rename getItem("xxx") xxx differently.
        const entries = JSON.parse(localStorage.getItem("budget-tracker-entries") || "[]");

        for (const entry of entries) {

            this.addEntry(entry);

        }

        this.updateSummary();
    }

    updateSummary(){

        const total = this.getEntryRows().reduce((total, row) => {

            const amount = row.querySelector(".input-amount").value;
            const isExpense = row.querySelector(".input-type").value === "expense";
            const modifier = isExpense ? -1 : 1;

            return total + (amount * modifier);
        }, 0);

       const totalFormatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "CAD"

       }).format(total);

       this.root.querySelector(".total").textContent = totalFormatted;
    }

    save() {

        const data = this.getEntryRows().map(row => {

                return {

                    date: row.querySelector(".input-date").value,
                    description: row.querySelector(".input-description").value,
                    type: row.querySelector(".input-type").value,
                    amount: parseFloat(row.querySelector(".input-amount").value),

                }

               

        });

        console.log(this.getEntryRows());
        localStorage.setItem("budget-tracker-entries", JSON.stringify(data));
        this.updateSummary();

    }

    addEntry(entry={}) {

        this.root.querySelector(".entries").insertAdjacentHTML("beforeend", BudgetTracker.entryHtml());
        const row = this.root.querySelector(".entries tr:last-of-type");
        //WE ARE GOING TO SELECT THE LAST ROW IN OUR ENTRY
        row.querySelector(".input-date").value = entry.date || new Date().toISOString().replace(/T.*/, "");
        row.querySelector(".input-description").value = entry.description || "";
        row.querySelector(".input-type").value = entry.type || "income";
        row.querySelector(".input-amount").value = entry.amount || 0 ;        
        row.querySelector(".delete-entry").addEventListener("click", e => {

            this.onDeleteEntryBtnClick(e);
        });        

        row.querySelectorAll(".input").forEach(input => {

            input.addEventListener("change", () => this.save());
            
            
        });
 
    }

    getEntryRows(){

        return Array.from(this.root.querySelectorAll(".entries tr"));


    }

    onNewEntryBtnClick(){

        this.addEntry();
    }

    onDeleteEntryBtnClick(e) {

       e.target.closest("tr").remove();
       this.save();
    }
}