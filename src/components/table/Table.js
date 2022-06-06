import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root) {
    super($root, {
      name: "Table",
      listeners: ["input"],
    });
  }

  toHTML() {
    const rows = createTable(100);
    // Appending each row from list of rows to excel__table <div>
    return rows.forEach((row) => this.$root.append(row));
  }

  onInput(event) {
    console.log(this.$root); //
    console.log(`${this.className} onInput`, event);
  }
}
