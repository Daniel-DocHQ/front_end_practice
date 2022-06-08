import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root) {
    super($root, {
      name: "Table",
      listeners: ["click", "mousedown", "mouseup", "mousemove"],
    });
  }
  //

  toHTML() {
    return createTable(100);
    // Appending each row from list of rows to excel__table <div>
    //return rows.forEach((row) => this.$root.append(row));
  }

  onInput(event) {
    console.log(this.$root); //
    console.log(`${this.className} onInput`, event);
  }

  onClick(event) {
    console.log(`click`, event);
  }

  onMousedown(event) {
    console.log(`mousedown`, event);
  }

  onMouseup(event) {
    console.log(`mousup`, event);
  }

  onMousemove(event) {
    console.log(`mousemove`);
  }
}
