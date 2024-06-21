import React, { useEffect, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Button,
  Modal,
} from "react-bootstrap";
import { observer } from "mobx-react";
import Link from "next/link";
import { authStore } from "../../stores/authStore";
import useLogoutHandler from "../login/logoutHandler";
import { useRouter } from "next/router";

const NavigationBar = observer(() => {
  const loggedIn = authStore.loggedIn;
  const { handleLogoutClick } = useLogoutHandler();
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/member/terms");
  };

  useEffect(() => {
    authStore.checkLoggedIn();
  }, []);

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
                    <a style={{ marginRight: "10px" }}>이력서 매니저</a>
                  </Link>
                  <div className="submenu">
                    <Link href="/resume/MyResumeInsert" passHref legacyBehavior>
                      <a className="subword">이력서 작성</a>
                    </Link>
                    <br />
                    <Link href="/resume/MyResume" passHref legacyBehavior>
                      <a className="subword">이력서 관리</a>
                    </Link>
                    <br />

                    <Link href="/chat" legacyBehavior>
                      <a className="subword">채팅방</a>
                    </Link>
                    <br />
                    <Link href="/resume/MyResume" passHref legacyBehavior>
                      <a className="subword">합격자 키워드 분석</a>
                    </Link>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/interview" passHref legacyBehavior>
                    <a>AI 면접</a>
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
                    <a>AI 트랜드서칭</a>
                  </Link>
                </li>
                <li>
                  <Link href="/companylist" passHref legacyBehavior>
                    <a>기업공고</a>
                  </Link>
                </li>
                <li>
                  <Link href="/community" passHref legacyBehavior>
                    <a>커뮤니티</a>
                  </Link>
                </li>
                <li>
                  <Link href="/notice" passHref legacyBehavior>
                    <a>공지사항</a>
                  </Link>
                </li>
                <li>
                  <Link href="/manager/Dashboard" passHref legacyBehavior>
                    <a>관리자</a>
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
                      <a className="subword">회원리스트</a>
                    </Link>
                    <br />
                    <Link
                      href="/manager/AdminManagement"
                      passHref
                      legacyBehavior
                    >
                      <a className="subword">관리자리스트</a>
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
              </ul>
            </nav>
            <div
              className={`menu-background ${
                hovered ? "menu-background-visible" : ""
              }`}
            ></div>
            {loggedIn ? (
              <Nav>
                <Nav.Link onClick={handleLogoutClick}>로그아웃</Nav.Link>
                <Nav.Link href={"/member/myinfo"}>내 정보</Nav.Link>
              </Nav>
            ) : (
              <Nav>
                <Nav.Link href={"/member/login"}>로그인</Nav.Link>
                <Nav.Link onClick={handleSignUpClick}>회원가입</Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
});

export default NavigationBar;
