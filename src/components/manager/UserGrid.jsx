import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import styles from "./UserGrid.module.css";
import {
  getUserList,
  updateSubscribeStatus,
  removeSubscribeStatus,
} from "../../api/userManager";
import RadiusButton from "../designTool/RadiusButton";
import Modal from "../designTool/modal";

const UserGrid = () => {
  const [rowData, setRowData] = useState([]);
  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "",
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      colId: "",
      floatingFilter: false,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
    },
    {
      headerName: "이메일",
      field: "memberEmail",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
    },
    {
      headerName: "이름",
      field: "memberName",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
    },
    {
      headerName: "닉네임",
      field: "memberNickName",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
    },
    {
      headerName: "구독여부",
      field: "subscribeYN",
      sortable: true,
      filter: "agSetColumnFilter",
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      filterParams: {
        values: ["Yes", "No"],
      },
      floatingFilter: true,
    },
    {
      headerName: "차단여부",
      field: "blockYN",
      sortable: true,
      filter: "agSetColumnFilter",
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      filterParams: {
        values: ["Yes", "No"],
      },
      floatingFilter: true,
    },
    {
      headerName: "차단사유",
      field: "blockComment",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
      floatingFilterComponentParams: {
        suppressFilterButton: true,
      },
    },
  ];

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const data = await getUserList();
      setRowData(data);
    } catch (error) {
      console.error("유저 리스트를 가져오지 못했습니다.", error);
    }
  };

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
    params.api.sizeColumnsToFit();
  };

  const updatesubscribe = async () => {
    try {
      const selectedEmails = getSelectedEmails();
      const updatedMembers = await Promise.all(
        selectedEmails.map(async (email) => {
          const updatedMember = await updateSubscribeStatus(email);
          return updatedMember;
        })
      );
      const newRowData = rowData.map((row) => {
        const updatedMember = updatedMembers.find(
          (member) => member.memberEmail === row.memberEmail
        );
        return updatedMember ? updatedMember : row;
      });
      setRowData(newRowData);
      openModal("구독처리에 성공했습니다.");
    } catch (error) {
      openModal("구독처리에 실패했습니다.");
      console.error("구독처리에 실패했습니다.", error);
    }
  };

  const removesubscribe = async () => {
    try {
      const selectedEmails = getSelectedEmails();
      const updatedMembers = await Promise.all(
        selectedEmails.map(async (email) => {
          const updatedMember = await removeSubscribeStatus(email);
          return updatedMember;
        })
      );
      const newRowData = rowData.map((row) => {
        const updatedMember = updatedMembers.find(
          (member) => member.memberEmail === row.memberEmail
        );
        return updatedMember ? updatedMember : row;
      });
      setRowData(newRowData);
      openModal("구독제거에 성공했습니다.");
    } catch (error) {
      openModal("구독제거에 실패했습니다.");
      console.error("구독제거에 실패했습니다.", error);
    }
  };

  const getSelectedEmails = () => {
    const selectedNodes = gridApi.current.getSelectedNodes();
    return selectedNodes.map((node) => node.data.memberEmail);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "left",
          }}
        >
          <div style={{ marginRight: "15px" }}>
            <RadiusButton
              className="RadiusButton"
              padding="7px 20px"
              color="#9dc3c1"
              text="구독처리"
              onClick={updatesubscribe}
            />
          </div>
          <div>
            <RadiusButton
              className="RadiusButton"
              padding="7px 20px"
              color="#9dc3c1"
              text="구독제거"
              onClick={removesubscribe}
            />
          </div>
        </div>
        <div
          className={`ag-theme-balham ${styles.customGrid}`}
          style={{ height: 1000, width: "100%", marginTop: "20px" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              filter: true,
              sortable: true,
              floatingFilter: true,
              floatingFilterComponentParams: {
                suppressFilterButton: true,
                filterPlaceholder: "검색...",
              },
              headerClass: "customHeader",
              floatingFilterComponent: "customFloatingFilter",
            }}
            onGridReady={onGridReady}
            rowSelection="multiple"
            pagination={true}
            paginationPageSize={20}
            rowHeight={50}
            headerHeight={50}
            floatingFiltersHeight={50}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        content={<p>{modalContent}</p>}
        buttonLabel="닫기"
        buttonColor="#77aaad"
        buttonSize="16px"
        modalSize={{ width: "350px", height: "150px" }}
      />
    </div>
  );
};

export default UserGrid;
