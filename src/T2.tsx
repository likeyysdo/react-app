import React from "react";
import ReactDOM from "react-dom";
import { ColumnDefinition } from "react-tabulator";
import { ReactTabulator } from 'react-tabulator'
import {TabulatorFull as Tabulator} from "tabulator-tables"; //import Tabulator library
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
const data: DataRow[] = [
  { id: 1, name: "Oli Bob", age: "12", color: "red", rating: 5 },
  { id: 2, name: "Mary May", age: "21", color: "blue", rating: 4 },
  { id: 3, name: "John Doe", age: "35", color: "green", rating: 3 },
];

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

class T2 extends React.Component {
  private el = React.createRef<HTMLDivElement>();
  
  private tabulator: Tabulator | null = null;

  componentDidMount() {
    if (this.el.current) {
      this.tabulator = new Tabulator(this.el.current, {
            //enable range selection
    selectableRange:1,
    selectableRangeColumns:true,
    selectableRangeRows:true,
    selectableRangeClearCells:true,

    //change edit trigger mode to make cell navigation smoother
    editTriggerEvent:"dblclick",

    //configure clipboard to allow copy and paste of range format data
    clipboard:true,
    clipboardCopyStyled:false,
    clipboardCopyConfig:{
        rowHeaders:false,
        columnHeaders:false,
    },
    clipboardCopyRowRange:"range",
    clipboardPasteParser:"range",
    clipboardPasteAction:"range",

    rowHeader:{resizable: false, frozen: true, width:40, hozAlign:"center", formatter: "rownum", cssClass:"range-header-col", editor:false},

    //setup cells to work as a spreadsheet
    columnDefaults:{
        headerSort:false,
        headerHozAlign:"center",
        editor:"input",
        resizable:"header",
        width:100,
    },
        data: data,
        reactiveData: true,
        columns: columns as ColumnDefinition[],
      });
    }
  }

  render() {
    return (
    <div>
    <div ref={this.el} />
    </div>
    );
  }
}

export default T2;
