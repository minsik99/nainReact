import { observer } from "mobx-react";
import { useModal } from "../../components/hook/useModal";
import { logout } from "../../api/user";
import { authStore } from "../../stores/authStore";


const useLogoutHandler = (res) => {
    const { isOpened, modalData, openModal, closeModal } = useModal();

    const handleLogoutClick = () => {
        if(confirm("로그아웃을 하시겠습니까?")){
      logout().then((res) => {
        localStorage.clear();
        authStore.setLoggedIn(false);
        window.location.href="/"; //로그아웃 후 메인 페이지로 이동
        });
      }
    };
  
    return { isOpened, modalData, openModal, closeModal, handleLogoutClick };
  };

  export default useLogoutHandler;
  
   
  