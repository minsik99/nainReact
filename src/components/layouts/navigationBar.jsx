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
  const isSubscribe = authStore.isSubscribe;
  const [hovered, setHovered] = useState(false);

  const handleSignUpClick = () => {
    router.push("/member/terms");
  };

  useEffect(() => {
    authStore.checkLoggedIn();
  }, []);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, [loggedIn]);

  const handleNavigation = (path) => {
    if (typeof window !== "undefined") {
      if(loggedIn){
        if (isSubscribe == 'Y') {
          router.push(path);
        }else{
          console.log("구독여부", isSubscribe);
          alert("구독이 필요한 서비스입니다.");
          router.push('/payment');
        }
      }else{
          if(confirm("로그인이 필요합니다. 이동하시겠습니까?")){
              router.push("/member/login");
            }else{
              router.push("/main")
            }
      }
    }
  };

  const handleChatLogin = (path) => {
    if(loggedIn){
        router.push(path)
    }else{
        if(confirm("로그인이 필요합니다. 이동하시겠습니까?")){
            router.push("/member/login");
          }else{
            router.push("/main")
          }
    }
  };



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
              <ul style={{marginBottom:"0px"}}>
                <li style={{whiteWrap:"nowrap"}}>
                  <a
                    style={{fontWeight: "600", cursor: "pointer" }}
                    onClick={() => handleNavigation("/resume")}
                  >
                    이력서 매니저
                  </a>
                  <div className="submenu">
                  <Link href="/resume/AcceptedKeyword" passHref legacyBehavior>
                    직무 분석
                  </Link>
                    <br />
                    <a
                      className="subword"
                      onClick={() => handleNavigation("/resume/MyResumeInsert")}
                      style={{ cursor: "pointer" }}
                    >
                      이력서 작성
                    </a>
                    <br />
                    <a
                      className="subword"
                      onClick={() => handleNavigation("/resume")}
                      style={{ cursor: "pointer" }}
                    >
                      이력서 관리
                    </a>
                    <br />
                  </div>
                </li>
                <li>
                  <a
                    href="#"
                    style={{ fontWeight: "600", cursor: "pointer" }}
                    onClick={() => handleNavigation("/interview")}
                  >
                    AI 면접
                  </a>
                  <div className="submenu">
                    <a
                      className="subword"
                      onClick={() => handleNavigation("/interview")}
                      style={{ cursor: "pointer" }}
                    >
                      면접 기록 관리
                    </a>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/search" passHref legacyBehavior>
                    <a>AI 트랜드서칭</a>
                  </Link>
                  <div></div>
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
                  <div className="submenu">
                    <Link href="/community" legacyBehavior>
                      <a className="subword">게시판</a>
                    </Link>
                    <br />
                    <a
                      className="subword"
                      onClick={() => handleChatLogin("/chat")}
                      style={{ cursor: "pointer" }}
                    >
                      채팅방
                    </a>
                    <br />
                  </div>
                </li>
                <li>
                  <Link href="/notice" passHref legacyBehavior>
                    <a>공지사항</a>
                  </Link>
                </li>
                {isAdmin && (
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
                        <a className="subword">회원</a>
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
                <Nav.Link onClick={handleLogoutClick}>로그아웃</Nav.Link>
                <Nav.Link href={"/member/myinfoLogin"}>내 정보</Nav.Link>
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
