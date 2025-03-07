import React from "react";
import ReactDOM from "react-dom";
import { ColumnDefinition } from "react-tabulator";
import { ReactTabulator } from 'react-tabulator'
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet

// 定义数据接口
interface DataRow {
  id: number;
  name: string;
  age: string;
  color: string;
  rating: number;
}

// 示例数据
const data: DataRow[] = Array.from({ length: 2 }, (_, index) => {
  const baseData = [
    { id: 1, name: "Oli Bob", age: "12", color: "red", rating: 5 },
    { id: 2, name: "Mary May", age: "21", color: "blue", rating: 4 },
    { id: 3, name: "John Doe", age: "35", color: "green", rating: 3 }
  ];
  const baseIndex = index % 3;
  return {
    ...baseData[baseIndex],
    id: index + 1 // 自增ID
  };
});

// 列定义
const columns = [
  { title: "ID", field: "id", width: 80 },
  { title: "姓名", field: "name", width: 150 },
  { title: "年龄", field: "age", hozAlign: "left" },
  { title: "颜色", field: "color" },
  {
    title: "评分",
    field: "rating",
    formatter: "star",
    hozAlign: "center"
  }
];

class T1 extends React.Component {
  private el = React.createRef<HTMLDivElement>();

  private table: Tabulator | null = null;

  componentDidMount() {
    if (this.el.current) {
      this.table = new Tabulator(this.el.current, {
        //enable range selection
        debugEventsExternal:true, 
        height: "811px",
        responsiveLayout: "hide",
        resizableRowGuide: true,
        resizableColumnGuide: true,
        selectableRange: true,
        selectableRangeColumns: true,
        selectableRangeRows: true,
        selectableRangeClearCells: true,
        selectableRangeAutoFocus:false,
        //change edit trigger mode to make cell navigation smoother
        editTriggerEvent: "click",

        //configure clipboard to allow copy and paste of range format data
        clipboard: true,
        clipboardCopyStyled: false,
        clipboardCopyConfig: {
          rowHeaders: false,
          columnHeaders: false,
        },
        clipboardCopyRowRange: "range",
        clipboardPasteParser: "range",
        clipboardPasteAction: "range",

        rowHeader: { resizable: false, frozen: true, width: 40, hozAlign: "center", formatter: "rownum", cssClass: "range-header-col", editor: false },

        //setup cells to work as a spreadsheet
        columnDefaults: {
          headerSort: false,
          headerHozAlign: "center",
          editor: "input",
          resizable: "header",
          width: 100,
        },
        data: data,
        reactiveData: true,
        columns: columns as ColumnDefinition[],
      });
    }
  }

  // 添加空行
  addEmptyRow = () => {
    //log 
    console.log("addEmptyRow");
    const ranges = this.table?.getRanges();
    if (ranges && ranges.length > 0) {
      // 获取最后一个范围
      const lastRange = ranges[ranges.length - 1];
      // 获取该范围内的所有行
      const rows = lastRange.getRows();
      // 获取最后一行
      const lastRow = rows[rows.length - 1];
      // 在该行下方插入空行
      this.table?.addRow({}, lastRow.getPosition() + 1);
    }
  };

  // 删除选中行
  deleteSelectedRows = () => {
    //log 
    console.log("deleteSelectedRows");
    const ranges = this.table?.getRanges();
    if (ranges && ranges.length > 0) {
      // 获取所有范围中的行
      const rowsToDelete = ranges.flatMap(range => 
        range.getRows().map(row => row.getData())
      );
      // 删除每一行
      rowsToDelete.forEach(row => {
        this.table?.deleteRow(row);
      });
    }
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <button onClick={this.addEmptyRow} style={{ marginRight: '10px' }}>
            在选中行下方添加空行
          </button>
          <button onClick={this.deleteSelectedRows}>
            删除选中行
          </button>
        </div>
        <div ref={this.el} />
      </div>
    );
  }
}

export default T1;
