import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown, Button, Modal } from "react-bootstrap";
import { observer } from "mobx-react";
import { authStore } from "../../stores/authStore";
import { logout } from "../../api/user";


const NavigationBar = observer(() => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const loggedIn = authStore.loggedIn;

  useEffect(() => {
    authStore.checkLoggedIn();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout().then((res) => {
      localStorage.clear();
      authStore.setLoggedIn(false);
      setShowLogoutModal(false); //모달달기
      window.location.href="/"; //로그아웃 후 메인 페이지로 이동
    });
  };

  return (
    <>
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="white"
      variant="light"
      className="navbar"
    >
      <Container>
        <Navbar.Brand href="/">
          <img src="/image/Logo.png" alt="Logo" style={{ width: "110px" }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <nav className="navigation-container">
            <ul style={{ marginBottom: "0px" }}>
              <li>
                <a href="/resume">이력서 매니저</a>
                <div className="submenu">
                  <a className="subword" href="/resume/MyResumeInsert">
                    이력서 작성
                  </a>
                  <br />
                  <a className="subword" href="/resume/MyResume">
                    이력서 관리
                  </a>
                  <br />
                  <a className="subword" href="/resume/MyResume">
                    합격자 이력서 공유
                  </a>
                  <br />
                  <a className="subword" href="/resume/MyResume">
                    합격자 키워드 분석
                  </a>
                  <br />
                </div>
              </li>
              <li>
                <a href="/interview">AI 면접</a>
                <div className="submenu">
                  <a className="subword" href="/InterviewComponent">
                    모의면접
                  </a>
                  <br />
                  <a className="subword" href="/InterviewComponent">
                    면접 report
                  </a>
                  <br />
                </div>
              </li>
              <li>
                <a href="/search">AI 트랜드서칭</a>
              </li>
              <li>
                <a href="/companylist">기업공고</a>
              </li>
              <li>
                <a href="/community">커뮤니티</a>
              </li>
              <li>
                <a href="/notice">공지사항</a>
              </li>
              <li>
                <a href="/manager">관리자</a>
                <div className="submenu">
                  <a className="subword" href="/manager/Dashboard">
                    대시보드
                  </a>
                  <br />
                  <a className="subword" href="/manager/UserManagement">
                    회원리스트
                  </a>
                  <br />
                  <a className="subword" href="/manager/AdminManagement">
                    관리자리스트
                  </a>
                  <br />
                  <a className="subword" href="/manager/ReportList">
                    신고리스트
                  </a>
                  <br />
                </div>
              </li>
            </ul>
          </nav>

          {/* <Nav className="me-auto">
            <Nav.Link href={"/resume"} className="nav-link">
              이력서 매니저
            </Nav.Link>
            <Nav.Link href={"/interview"} className="nav-link">
              AI 면접
            </Nav.Link>
            <Nav.Link href={"/search"} className="nav-link">
              AI 트랜드 서칭
            </Nav.Link>
            <Nav.Link href={"/companylist"} className="nav-link">
              기업공고
            </Nav.Link>
            <Nav.Link href={"/community"} className="nav-link">
              커뮤니티
            </Nav.Link>
            <Nav.Link href={"/notice"} className="nav-link">
              공지사항
            </Nav.Link>
          </Nav> */}
          {loggedIn ? (
            <Nav>
              <Nav.Link onClick={() => setShowLogoutModal(true)}>로그아웃</Nav.Link>
              <Nav.Link href={"/member/myinfo"}>내 정보</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href={"/member/login"}>로그인</Nav.Link>
              <Nav.Link href={"/member"}>회원가입</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>

    {/* 모달 확인 */}
    <Modal className="custom-modal" show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>로그아웃 확인</Modal.Title>
          </Modal.Header>
          <Modal.Body>정말 로그아웃 하시겠습니까?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              로그아웃
            </Button>
          </Modal.Footer>
    </Modal>
    </>
  );
});

export default NavigationBar;
