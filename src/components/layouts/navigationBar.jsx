import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { observer } from "mobx-react";
import Link from "next/link";
import { authStore } from "../../stores/authStore";
import useLogoutHandler from "../login/logoutHandler";
import { useRouter } from "next/router";

const NavigationBar = observer(() => {
  const loggedIn = authStore.loggedIn;
  const { handleLogoutClick } = useLogoutHandler();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태

  const handleSignUpClick = () => {
    router.push("/member/terms");
  };

  useEffect(() => {
    authStore.checkLoggedIn();
  }, []);

  useEffect(() => {
    // localStorage에서 isAdmin 값을 가져와 설정합니다.
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, [loggedIn]);

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="white"
        variant="light"
        className="navbar"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Container>
          <Navbar.Brand>
            <Link href="/main" passHref legacyBehavior>
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
                  <Link href="/resume" passHref legacyBehavior>
                    <a style={{ marginRight: "15px", fontWeight: "600" }}>
                      이력서 매니저
                    </a>
                  </Link>
                  <div className="submenu">
                    <Link href="/resume/MyResumeInsert" passHref legacyBehavior>
                      <a className="subword">이력서 작성</a>
                    </Link>
                    <br />
                    <Link href="/resume" passHref legacyBehavior>
                      <a className="subword">이력서 관리</a>
                    </Link>
                    <br />

                    <Link
                      href="/resume/AcceptedKeyword"
                      passHref
                      legacyBehavior
                    >
                      <a className="subword">직무 키워드 분석</a>
                    </Link>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/interview" passHref legacyBehavior>
                    <a style={{ fontWeight: "600" }}>AI 면접</a>
                  </Link>
                  <div className="submenu">
                    <Link href="/interview/test" legacyBehavior>
                      <a className="subword">모의면접</a>
                    </Link>
                    <br />
                    <Link href="/interview" legacyBehavior>
                      <a className="subword">면접 report</a>
                    </Link>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/search" passHref legacyBehavior>
                    <a style={{ fontWeight: "600" }}>AI 트랜드서칭</a>
                  </Link>
                </li>
                <li>
                  <Link href="/companylist" passHref legacyBehavior>
                    <a style={{ fontWeight: "600" }}>기업공고</a>
                  </Link>
                </li>
                <li>
                  <Link href="/community" passHref legacyBehavior>
                    <a style={{ fontWeight: "600" }}>커뮤니티</a>
                  </Link>
                  <div className="submenu">
                    <Link href="/community" legacyBehavior>
                      <a className="subword">게시판</a>
                    </Link>
                    <br />
                    <Link href="/chat" legacyBehavior>
                      <a className="subword">채팅방</a>
                    </Link>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/notice" passHref legacyBehavior>
                    <a style={{ fontWeight: "600" }}>공지사항</a>
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/manager/Dashboard" passHref legacyBehavior>
                      <a style={{ fontWeight: "600" }}>관리자</a>
                    </Link>
                    <div className="submenu">
                      <Link href="/manager/Dashboard" passHref legacyBehavior>
                        <a className="subword">대시보드</a>
                      </Link>
                      <br />
                      <Link
                        href="/manager/UserManagement"
                        passHref
                        legacyBehavior
                      >
                        <a className="subword">회원관리</a>
                      </Link>
                      <br />
                      <Link
                        href="/manager/CommunityReportListPage"
                        passHref
                        legacyBehavior
                      >
                        <a className="subword">신고리스트</a>
                      </Link>
                      <br />
                    </div>
                  </li>
                )}
              </ul>
            </nav>
            <div
              className={`menu-background ${
                hovered ? "menu-background-visible" : ""
              }`}
            ></div>
            {loggedIn ? (
              <Nav>
                <Nav.Link
                  style={{ fontWeight: "600" }}
                  onClick={handleLogoutClick}
                >
                  로그아웃
                </Nav.Link>
                <Nav.Link style={{ fontWeight: "600" }} href={"/member/myinfo"}>
                  내 정보
                </Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link style={{ fontWeight: "600" }} href={"/member/login"}>
                  로그인
                </Nav.Link>
                <Nav.Link
                  style={{ fontWeight: "600" }}
                  onClick={handleSignUpClick}
                >
                  회원가입
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
});

export default NavigationBar;
