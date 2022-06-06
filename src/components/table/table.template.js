import { $ } from "../../core/dom";

const CODES = {
  A: "65",
  Z: "90",
};

export function createTable(rowsCount = 50) {
  const rows = [];
  const colsCount = CODES.Z - CODES.A;
  const colName = (num) => `${String.fromCharCode(num)}`;

  for (let rowIndex = 0; rowIndex <= rowsCount; rowIndex++) {
    const row = $.create("div", "row");

    /*  Row Data consists of namedCells (A, B, C, D, E...) 
		and working cells (empty cells)   */
    const rowData = $.create("div", "row-data");

    /*  Creating first infoCell and numeric cells 
		for each subsequent row 1, 2, 3, 4...  */
    const infoCell = $.create("div", "row-info").html("");
    const rowInfo = $.create("div", "row-info").html(`${rowIndex}`);
    if (rowIndex == 0) row.append(infoCell);
    else row.append(rowInfo);

    /*  Creating namedCells (columns) in the first row 
        and working cells for each subsequent row   */
    for (let colIndex = 0; colIndex <= colsCount; colIndex++) {
      const infoColumn = $.create("div", "column").html(colName(CODES.A++));
      const col = $.create("div", "cell").attribute("contenteditable");
      if (rowIndex == 0) rowData.append(infoColumn);
      else rowData.append(col);
    }

    // Appending final rows to the table
    row.append(rowData);
    // Each row is separate block
    rows.push(row);
  }

  return rows;
}
