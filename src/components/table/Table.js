import { ExcelComponent } from "../../core/ExcelComponent";
import { createTable } from "./table.template";
import { resizeHandler } from "./table.resize";
import { shouldResize } from "./table.functions";

export class Table extends ExcelComponent {
  static className = "excel__table";
  constructor($root) {
    super($root, {
      name: "Table",
      listeners: ["mousedown", "mouseup"],
    });
  }

  toHTML() {
    return createTable(100);
  }

  onMousedown(event) {
    // Recising columns and Rows
    if (shouldResize(event)) {
      resizeHandler(event);
    }
  }
}
