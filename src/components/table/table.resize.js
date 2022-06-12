import { getNumValue, css } from "../../core/utils";
import { style } from "../../core/utils";

export function resizeHandler(event) {
  const parent = event.target.closest('[data-type="resizable"');
  const resizer = event.target;
  const columns = [
    ...document.querySelectorAll(`[data-col="${parent.dataset.col}"]`),
  ];
  const rows = [
    ...document.querySelectorAll(`[data-row="${parent.dataset.row}"]`),
  ];

  const styles = {
    width: parseFloat(style(parent).width, 1),
    height: parseFloat(style(parent).height, 1),
  };

  document.onmousemove = (e) => {
    // Element width/height + offset between start and end positios
    const newWidth = styles.width + -(event.x - e.clientX);
    const newHeight = styles.height + -(event.y - e.clientY);

    if (event.target.dataset.resize == "col") {
      css(resizer, {
        opacity: 1,
        zIndex: 1000,
        height: "100VH",
        right: event.x - e.clientX + "px",
      });
    } else {
      css(resizer, {
        opacity: 1,
        zIndex: 1000,
        width: "100VW",
        bottom: event.y - e.clientY + "px",
      });
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;

      if (event.target.dataset.resize == "col") {
        css(resizer, {
          opacity: 0,
          height: "",
          right: 0,
        });
        columns.forEach((el) => css(el, { width: newWidth + "px" }));
      } else {
        css(resizer, {
          opacity: 0,
          width: "",
          bottom: 0,
        });
        rows.forEach((el) => css(el, { height: newHeight + "px" }));
      }
    };
  };
}
