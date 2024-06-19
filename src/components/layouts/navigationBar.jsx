
import React, { useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { observer } from "mobx-react";
import Link from "next/link";
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
        <Navbar.Brand>
          <Link href="/main" legacyBehavior>
            <a>
              <img
                src="/image/Logo.png"
                alt="Logo"
                style={{ width: "110px" }}
              />
            </a>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <nav className="navigation-container">
            <ul style={{ marginBottom: "0px" }}>
              <li>
                <Link href="/resume" legacyBehavior>
                  <a style={{ marginRight: "10px" }}>이력서 매니저</a>
                </Link>
                <div className="submenu">
                  <Link href="/resume/MyResumeInsert" legacyBehavior>
                    <a className="subword">이력서 작성</a>
                  </Link>
                  <br />
                  <Link href="/resume/MyResume" legacyBehavior>
                    <a className="subword">이력서 관리</a>
                  </Link>
                  <br />
                  <Link href="/resume/MyResume" legacyBehavior>
                    <a className="subword">합격자 이력서 공유</a>
                  </Link>
                  <br />
                  <Link href="/resume/MyResume" legacyBehavior>
                    <a className="subword">합격자 키워드 분석</a>
                  </Link>
                  <br />
                </div>
              </li>
              <li>
                <Link href="/interview" legacyBehavior>
                  <a>AI 면접</a>
                </Link>
                <div className="submenu">
                  <Link href="/interview/test" legacyBehavior>
                    <a className="subword">모의면접</a>
                  </Link>
                  <br />
                  <Link href="/Interview/list" legacyBehavior>
                    <a className="subword">면접 report</a>
                  </Link>
                  <br />
                </div>
              </li>
              <li>
                <Link href="/search" legacyBehavior>
                  <a>AI 트랜드서칭</a>
                </Link>
              </li>
              <li>
                <Link href="/companylist" legacyBehavior>
                  <a>기업공고</a>
                </Link>
              </li>
              <li>
                <Link href="/community" legacyBehavior>
                  <a>커뮤니티</a>
                </Link>
              </li>
              <li>
                <Link href="/notice" legacyBehavior>
                  <a>공지사항</a>
                </Link>
              </li>
              <li>
                <Link href="/manager" legacyBehavior>
                  <a>관리자</a>
                </Link>
                <div className="submenu">
                  <Link href="/manager/Dashboard" legacyBehavior>
                    <a className="subword">대시보드</a>
                  </Link>
                  <br />
                  <Link href="/manager/UserManagement" legacyBehavior>
                    <a className="subword">회원리스트</a>
                  </Link>
                  <br />
                  <Link href="/manager/AdminManagement" legacyBehavior>
                    <a className="subword">관리자리스트</a>
                  </Link>
                  <br />
                  <Link href="/manager/ReportList" legacyBehavior>
                    <a className="subword">신고리스트</a>
                  </Link>
                  <br />
                </div>
              </li>
            </ul>
          </nav>

          {loggedIn ? (
            <Nav>

              <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
              <Nav.Link>
                <Link href="/" legacyBehavior>
                  내 정보
                </Link>
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/member/login" legacyBehavior>
                로그인
              </Nav.Link>
              <Nav.Link href="/member" legacyBehavior>
                회원가입
              </Nav.Link>
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
