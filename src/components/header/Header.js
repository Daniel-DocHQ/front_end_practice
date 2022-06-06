import { ExcelComponent } from "../../core/ExcelComponent";

export class Header extends ExcelComponent {
  static className = "excel__header";

  constructor($root) {
    super($root, {
      name: "Header",
      listeners: ["input"],
    });
  }

  toHTML() {
    return `
      <input type="text" class="input" value="New table" />
        <div>
            <button>
              <i class="material-icons">delete</i>
            </button>
            <button>
              <i class="material-icons">exit_to_app</i>
            </button>
        </div>
      `;
  }

  onInput(event) {
    console.log(this.$root); //
    console.log(`${this.className} onInput`, event);
  }
}
