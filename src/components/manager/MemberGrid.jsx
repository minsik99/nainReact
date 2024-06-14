import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const MemberGrid = () => {
  const [rowData, setRowData] = useState([]);
  const gridApi = useRef(null);

  const columnDefs = [
    {
      headerName: "이메일",
      field: "email",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      headerName: "이름",
      field: "name",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      headerName: "닉네임",
      field: "nickname",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
    {
      headerName: "구독여부",
      field: "subscribed",
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["Yes", "No"],
      },
      floatingFilter: true,
    },
    {
      headerName: "차단여부",
      field: "blocked",
      sortable: true,
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["Yes", "No"],
      },
      floatingFilter: true,
    },
    {
      headerName: "차단사유",
      field: "blockReason",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
    },
  ];

  useEffect(() => {
    setRowData([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        nickname: "johnny",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        nickname: "janes",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Spamming",
      },
      {
        id: 3,
        name: "Michael Brown",
        email: "michael@example.com",
        nickname: "mike",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 4,
        name: "Emily Johnson",
        email: "emily@example.com",
        nickname: "emjay",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 5,
        name: "Paul Adams",
        email: "paul@example.com",
        nickname: "pauly",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 6,
        name: "Laura White",
        email: "laura@example.com",
        nickname: "lauraw",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Inappropriate content",
      },
      {
        id: 7,
        name: "Chris Green",
        email: "chris@example.com",
        nickname: "chrisg",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 8,
        name: "Anna Blue",
        email: "anna@example.com",
        nickname: "annab",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 9,
        name: "Peter Black",
        email: "peter@example.com",
        nickname: "peterb",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 10,
        name: "Susan Yellow",
        email: "susan@example.com",
        nickname: "susany",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Spam",
      },
      {
        id: 11,
        name: "Kevin Brown",
        email: "kevin@example.com",
        nickname: "kevinb",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 12,
        name: "Nancy Grey",
        email: "nancy@example.com",
        nickname: "nancyg",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 13,
        name: "David White",
        email: "david@example.com",
        nickname: "davidw",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 14,
        name: "Betty Green",
        email: "betty@example.com",
        nickname: "bettyg",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Harassment",
      },
      {
        id: 15,
        name: "Steve Red",
        email: "steve@example.com",
        nickname: "stever",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 16,
        name: "Lucy Blue",
        email: "lucy@example.com",
        nickname: "lucyb",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 17,
        name: "Tom Yellow",
        email: "tom@example.com",
        nickname: "tomy",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 18,
        name: "Emma Pink",
        email: "emma@example.com",
        nickname: "emmap",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Inappropriate content",
      },
      {
        id: 19,
        name: "James Purple",
        email: "james@example.com",
        nickname: "jamesp",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 20,
        name: "Sophia Orange",
        email: "sophia@example.com",
        nickname: "sophiao",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 21,
        name: "Liam Brown",
        email: "liam@example.com",
        nickname: "liamb",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 22,
        name: "Ava Grey",
        email: "ava@example.com",
        nickname: "avag",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Spamming",
      },
      {
        id: 23,
        name: "Noah Green",
        email: "noah@example.com",
        nickname: "noahg",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 24,
        name: "Mia Red",
        email: "mia@example.com",
        nickname: "miar",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 25,
        name: "Lucas Blue",
        email: "lucas@example.com",
        nickname: "lucasb",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 26,
        name: "Amelia Yellow",
        email: "amelia@example.com",
        nickname: "ameliay",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Harassment",
      },
      {
        id: 27,
        name: "Ethan Purple",
        email: "ethan@example.com",
        nickname: "ethanp",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 28,
        name: "Charlotte Pink",
        email: "charlotte@example.com",
        nickname: "charlottep",
        subscribed: "No",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 29,
        name: "Henry Black",
        email: "henry@example.com",
        nickname: "henryb",
        subscribed: "Yes",
        blocked: "No",
        blockReason: "",
      },
      {
        id: 30,
        name: "Isabella Orange",
        email: "isabella@example.com",
        nickname: "isabellao",
        subscribed: "No",
        blocked: "Yes",
        blockReason: "Spam",
      },
    ]);
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            filter: true,
            sortable: true,
            floatingFilter: true,
          }}
          onGridReady={(params) => (gridApi.current = params.api)}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
};

export default MemberGrid;
