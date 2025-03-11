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
const data: DataRow[] = Array.from({ length: 20 }, (_, index) => {
  const baseData = [
    { id: 1, name: "Oli Bob", age: "12", color: "red", rating: 5 },
    { id: 2, name: "Mary May", age: "27", color: "blue", rating: 4 },
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

  state = {
    rangeBottom: 0,
    text:"123"
  };

  componentDidMount() {
    if (this.el.current) {
      this.table = new Tabulator(this.el.current, {
        //enable range selection
        debugEventsExternal:true, 
        height: "511px",
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
        // virtualDom: true,       // 启用虚拟DOM
        // virtualDomBuffer: 300,  // 虚拟DOM缓冲区大小
      });
      this.table?.on("rangeChanged", (range: any) => {
        //log range
        console.log("rangeChanged", range);
        // 使用 setState 更新值，这会触发重新渲染
        this.setState({
          rangeBottom: range.getBottomEdge()
        });
      });
    }
  }

  componentWillUnmount(): void {
    if (this.table) {
      this.table.destroy();
    }
  }


  // 添加空行
  addEmptyRow = () => {
    //log 
    console.log("addEmptyRow");
    //log rangeBottom
    console.log("rangeBottom", this.state.rangeBottom);
    this.setState({
      text: `在第 ${this.state.rangeBottom+1} 行后插入新行`
    });
    this.table?.addRow({}, false, (this.state.rangeBottom || 0));
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={() => console.log("text:", this.state.text)}>
            text: {this.state.text}
            </button>
            <button onClick={() => this.table?.clearData()}>
              清空表格数据
            </button>
            <button onClick={() => console.log("table entity:", this.table)}>
              查看表格实例
            </button>
            <button onClick={this.addEmptyRow}>
              在选中行下方添加空行
            </button>
            <button onClick={this.deleteSelectedRows}>
              删除选中行
            </button>
            <span style={{ marginLeft: '10px' }}>
              选中了最后行号: {this.state.rangeBottom+1}
            </span>
          </div>
        </div>
        <div ref={this.el} />
      </div>
    );
  }
}

export default T1;
