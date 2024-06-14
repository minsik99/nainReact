import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const MemberGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [columnDefs] = useState([
    { headerName: "이메일", field: "email", sortable: true, filter: true },
    { headerName: "닉네임", field: "nickname", sortable: true, filter: true },
    { headerName: "이름", field: "name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    {
      headerName: "Join Date",
      field: "joinDate",
      sortable: true,
      filter: true,
    },
    { headerName: "Status", field: "status", sortable: true, filter: true },
  ]);

  // 샘플 데이터를 설정합니다.
  useEffect(() => {
    setRowData([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        joinDate: "2020-01-01",
        status: "Active",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        joinDate: "2021-06-15",
        status: "Inactive",
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael@example.com",
        joinDate: "2019-11-20",
        status: "Active",
      },
      {
        id: 4,
        name: "Emily Johnson",
        email: "emily@example.com",
        joinDate: "2022-03-30",
        status: "Pending",
      },
    ]);
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
};

export default MemberGrid;
