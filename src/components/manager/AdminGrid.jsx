import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css"; // 기본 CSS
import "ag-grid-community/styles/ag-theme-balham.css"; // Balham 테마
import styles from "./AdminGrid.module.css"; // 커스텀 CSS
import RadiusButton from "../designTool/RadiusButton";
import Modal from "../designTool/modal";
import {
  getAdminList,
  updateAdminStatus,
  removeAdminStatus,
} from "../../api/adminManager";

const AdminGrid = () => {
  const [rowData, setRowData] = useState([]);
  const [newRow, setNewRow] = useState({ email: "", name: "", nickname: "" });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const [modalContent, setModalContent] = useState(""); // 모달 내용 상태 추가
  const gridApi = useRef(null);
  const gridColumnApi = useRef(null);

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
      colId: "", // 이 열에 대한 고유 식별자 설정
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
    },
    {
      headerName: "닉네임",
      field: "memberNickname",
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: true,
      headerClass: styles.customHeader,
      cellClass: styles.customCell,
    },
  ];

  useEffect(() => {
    const fetchAdminList = async () => {
      try {
        const data = await getAdminList();
        setRowData(data);
      } catch (error) {
        openModal("관리자 리스트를 가져오지 못했습니다.");
        console.error("관리자 리스트를 가져오지 못했습니다.", error);
      }
    };

    fetchAdminList();
  }, []);

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi;
    params.api.sizeColumnsToFit(); // 그리드 초기화 시 열 크기 조정
  };

  const deleteAdmin = async () => {
    const selectedRows = gridApi.current.getSelectedRows();
    const emails = selectedRows.map((row) => row.memberEmail);
    try {
      await removeAdminStatus(emails); // 서버에 관리자 상태 제거 요청
      const updatedRows = rowData.filter(
        (row) => !emails.includes(row.memberEmail)
      );
      setRowData(updatedRows); // 필터링된 상태로 rowData 업데이트
      openModal("관리자를 삭제했습니다.");
    } catch (error) {
      openModal("관리자 삭제에 실패했습니다.");
      console.error("관리자 삭제에 실패했습니다.", error);
    }
  };

  const addAdmin = async () => {
    try {
      console.log("Adding admin:", newRow.email);
      const updatedMember = await updateAdminStatus(newRow.email); // 서버에 관리자 상태 업데이트 요청
      console.log("Admin added successfully:", updatedMember);
      const newRowData = [...rowData, updatedMember];
      setRowData(newRowData);
      setNewRow({ email: "", name: "", nickname: "" });
      openModal("관리자가 추가되었습니다."); // 모달 열기
    } catch (error) {
      openModal("관리자 추가에 실패했습니다.");
      console.error("관리자 추가에 실패했습니다.", error);
    }
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
          style={{ borderRadius: "5px", marginRight: "20px" }}
        />
        <RadiusButton
          onClick={addAdmin}
          padding="5px 18px"
          color="#9dc3c1"
          text="관리자 추가"
        ></RadiusButton>
      </div>
      <div className="RadiusButton">
        <RadiusButton
          onClick={deleteAdmin}
          padding="5px 18px"
          color="#9dc3c1"
          text="관리자 삭제"
        ></RadiusButton>
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
            },
            headerClass: "customHeader",
            floatingFilterComponent: "customFloatingFilter",
          }}
          onGridReady={onGridReady}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={20}
          rowHeight={50} // 행 높이 설정
          headerHeight={50} // 타이틀 행 높이 설정
          floatingFiltersHeight={50} // 검색 행 높이 설정
        />
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

export default AdminGrid;
