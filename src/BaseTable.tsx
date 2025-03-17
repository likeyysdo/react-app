import React from "react";
import ReactDOM from "react-dom";
import { ColumnDefinition } from "react-tabulator";
import { ReactTabulator } from 'react-tabulator'
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet
import { VariableDataType } from "./SidebarEnum";



//data type is string  array or VariableDataType  
type ColumnDataType = VariableDataType | string[];

interface ColumnDefinition {
  //index,name,data type of VariableDataType
  index: number;
  name: string;
  dataType: ColumnDataType;
}



interface BaseTableProps {
  // 列定义
  columnDefinitions: ColumnDefinition[];
  // 初始数据
  initialData?: (string | number | boolean | Date)[][];
}



class BaseTable extends React.Component<BaseTableProps> {
  private el = React.createRef<HTMLDivElement>();
  private table: Tabulator | null = null;

  state = {
    currentData: this.props.initialData || []
  };

  private convertToTabulatorColumns(columnDefinitions: ColumnDefinition[]) {
    return columnDefinitions.map(col => {
      const baseColumn = {
        title: col.name,
        field: `col${col.index}`,
        width: 120,
        headerHozAlign: "center",
      };

      // 如果是字符串数组,创建下拉选择器
      if (Array.isArray(col.dataType)) {
        return {
          ...baseColumn,
          editor: "select",
          editorParams: {
            values: col.dataType
          }
        };
      }

      // 根据不同的数据类型设置不同的编辑器和格式化器
      switch (col.dataType) {
        case VariableDataType.Int:
        case VariableDataType.Long:
        case VariableDataType.Short:
          return {
            ...baseColumn,
            editor: "number",
            validator: "integer",
            hozAlign: "right"
          };

        case VariableDataType.Float:
        case VariableDataType.Double:
          return {
            ...baseColumn,
            editor: "number",
            validator: "numeric",
            hozAlign: "right"
          };

        case VariableDataType.Boolean:
          return {
            ...baseColumn,
            editor: "tickCross",
            formatter: "tickCross",
            hozAlign: "center"
          };

        case VariableDataType.String:
        default:
          return {
            ...baseColumn,
            editor: "input"
          };
      }
    });
  }

  componentDidMount() {
    if (this.el.current) {
      this.table = new Tabulator(this.el.current, {
        //enable range selection
        debugEventsExternal:true, 
        importFormat:"array",
        autoTables:true,
        
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

        //rowHeader: { resizable: false, frozen: true, hozAlign: "center", formatter: "rownum", cssClass: "range-header-col", editor: false, width: 10 },
       //setup cells to work as a spreadsheet
        columnDefaults: {
          headerSort: false,
          headerHozAlign: "center",
          editor: "input",
          resizable: "header",
          width: 100,
        },
        data: this.state.currentData,
        reactiveData: true,
        columns: this.convertToTabulatorColumns(this.props.columnDefinitions),
        // virtualDom: true,       // 启用虚拟DOM
        // virtualDomBuffer: 300,  // 虚拟DOM缓冲区大小
      });
    }
  }

  componentWillUnmount(): void {
    if (this.table) {
      this.table.destroy();
    }
  }

  // 获取当前表格数据
  getTableData = (): (string | number | boolean | Date)[][] => {
    return this.table?.getData() || [];
  };

  // 设置表格数据
  setTableData = (data: (string | number | boolean | Date)[][]) => {
    this.table?.setData(data);
  };

  // 添加空行
  addEmptyRow = () => {
    //log 
    console.log("addEmptyRow");
    //log rangeBottom
    //console.log("rangeBottom", this.table?.getRanges());
    const ranges = this.table.getRanges();
    const currentData = this.table.getData();
    if (currentData.length === 0) {
      // 如果表格没有数据,直接添加新行
      this.table.addRow({});
    } else if (ranges.length > 0) {
      // 如果有选中行,在选中行后添加新行
      this.table.addRow({}, false, ranges[0].getBounds().end.row);
    }
  };

  // 删除选中行
  deleteSelectedRows = () => {
    //log 
    console.log("deleteSelectedRows");
    this.table.deleteRow(this.table.getRanges()[0].getRows());
  };

  // clear table data
  clearTableData = () => {
    this.table?.clearData();
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <button onClick={this.clearTableData}>
              清空表格数据
            </button>
            <button onClick={this.addEmptyRow}>
              在选中行下方添加空行
            </button>
            <button onClick={this.deleteSelectedRows}>
              删除选中行
            </button>
          </div>
        </div>
        <div ref={this.el} />
      </div>
    );
  }
}

export default React.forwardRef<BaseTable, BaseTableProps>((props, ref) => {
  return <BaseTable {...props} ref={ref} />;
});
