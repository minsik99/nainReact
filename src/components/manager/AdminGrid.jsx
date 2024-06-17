import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // 기본 CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Balham 테마
import styles from "./AdminGrid.module.css"; // 커스텀 CSS
import RadiusButton from "../designTool/radiusButton";

const AdminGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [newRow, setNewRow] = useState({ email: "", name: "", nickname: "" });
  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "",
      minWidth: 30,
      floatingFilter: false,
      cellClass: styles.customCheckboxCell, // 체크박스 셀에 커스텀 클래스 추가
      width: 40,
    },
    {
      headerName: "이메일",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressMenu: false, // 필터 아이콘 제거
      headerClass: styles.customHeader,
    },
    {
      headerName: "이름",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressMenu: true, // 필터 아이콘 제거
      headerClass: styles.customHeader,
    },
    {
      headerName: "닉네임",
      field: "nickname",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      suppressMenu: true, // 필터 아이콘 제거
      headerClass: styles.customHeader,
    },
  ];

  useEffect(() => {
    setRowData([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        nickname: "johnny",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        nickname: "janes",
      },
      // 나머지 데이터 추가...
    ]);
  }, []);

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
  };

  const deleteSelectedRows = () => {
    const selectedRows = gridApi.current.getSelectedRows();
    const remainingRows = rowData.filter((row) => !selectedRows.includes(row));
    setRowData(remainingRows);
  };

  const addRow = () => {
    const newRowData = [...rowData, { ...newRow, id: rowData.length + 1 }];
    setRowData(newRowData);
    setNewRow({ email: "", name: "", nickname: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow({ ...newRow, [name]: value });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div style={{ marginBottom: "10px", float: "right" }}>
        <input
          type="text"
          name="email"
          value={newRow.email}
          placeholder="abc123@nain.io"
          onChange={handleInputChange}
          style={{ borderRadius: "5px", marginRight: "10px" }}
        />
        <RadiusButton
          className="RadiusButton"
          onClick={addRow}
          padding="5px 18px"
          color="#9dc3c1"
          text="관리자 추가"
        ></RadiusButton>
      </div>
      <div className="RadiusButton">
        <RadiusButton
          onClick={deleteSelectedRows}
          padding="5px 18px"
          color="#9dc3c1"
          text="관리자 삭제"
        ></RadiusButton>
      </div>
      <div
        className={`ag-theme-balham ${styles.customGrid}`}
        style={{ height: 600, width: "100%", marginTop: "20px" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            minWidth: 440,
            filter: false,
            sortable: false,
            floatingFilter: false,
            suppressMenu: false, // 필터 아이콘 제거
          }}
          onGridReady={onGridReady}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          rowHeight={40} // 행 높이 설정
          headerHeight={40} // 타이틀 행 높이 설정
          floatingFiltersHeight={40} // 검색 행 높이 설정
        />
      </div>
    </div>
  );
};

export default AdminGrid;
