import { ExcelComponent } from "../../core/ExcelComponent";

export class Formula extends ExcelComponent {
  static className = "excel__formula";

  constructor($root) {
    super($root, {
      name: "Formula",
      listeners: ["input"],
    });
  }

  getRoot() {
    return this.$root;
  }

  toHTML() {
    return `
        <div class="info">fx</div>
        <input type="text" class="input" value="formula" />
    `;
  }

  onInput(event) {
    console.log(this.$root); //
    console.log(`${this.className} onInput`, event);
  }

  // onClick(event) {
  //   console.log(this.$root);
  //   console.log("Fornula: onClick", event);
  // }
}
