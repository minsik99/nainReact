// 필요한 모듈들을 불러옵니다.
import "bootstrap/dist/css/bootstrap.css";
import "../styles/global.css";
import "../styles/manager/manager.css";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query"; // 리액트 쿼리에서 필요한 모듈을 추가로 불러옵니다.
import NavigationBar from "../components/layouts/navigationBar";
import { Container, ThemeProvider } from "react-bootstrap";
import { authStore } from "../stores/authStore";
import "../App.css";
import Footer from "../components/layouts/footer";

// QueryClient 인스턴스를 생성합니다. 이 인스턴스를 통해 쿼리의 설정과 상태를 관리할 수 있습니다.
const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }) => {
  return (
    // QueryClientProvider 컴포넌트로 전체 앱을 감싸줍니다. 이를 통해 애플리케이션의 모든 부분에서 리액트 쿼리를 사용할 수 있도록 합니다.
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="sm"
      >
        <Container fluid className="navigation-container">
          <NavigationBar />
        </Container>
        <Container fluid className="flex-container">
          <Component {...pageProps} authStore={authStore} />
        </Container>
        <footer fluid className="footer">
          <Footer />
        </footer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
