import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Home from './Home.tsx';
import BaseTable from './BaseTable';
import T2 from './T2.tsx';
import { VariableDataType } from './SidebarEnum';

// 测试列定义
const columnDefinitions = [
  { index: 0, name: 'ID', dataType: VariableDataType.Int },
  { index: 1, name: '姓名', dataType: VariableDataType.String },
  { index: 2, name: '年龄', dataType: VariableDataType.Int },
  { index: 3, name: '地址', dataType: VariableDataType.String }
];

// 测试数据（二维数组格式）
const testData = [
  [1, '张三', 25, '北京'],
  [2, '李四', 30, '上海'],
  [3, '王五', 35, '广州'],
  [4, '赵六', 28, '深圳'],
  [5, '钱七', 32, '杭州'],
  [6, '孙八', 27, '成都'],
  [7, '周九', 29, '武汉'],
  [8, '吴十', 31, '西安'],
  [9, '郑十一', 33, '南京'],
  [10, '王十二', 26, '重庆']
];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <Home /> */}
    {/* <T1 /> */}
    <BaseTable 
      columnDefinitions={columnDefinitions}
      initialData={testData}
      ref={(table) => {
        // 添加到全局变量方便调试
        (window as any).baseTable = table;
      }}
    />
    <button onClick={() => {
      const table = (window as any).baseTable;
      if (table) {
        console.log("表格数据:", table.getTableData());
      }
    }}>
      获取表格数据
    </button>
    <br />
    <br />
    {/* <T2 /> */}
  </React.StrictMode>
);
