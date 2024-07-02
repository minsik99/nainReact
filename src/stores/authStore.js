import { makeAutoObservable } from "mobx";

class AuthStore {
  loggedIn = false;
  isAdmin = false;
  memberNo = null;
  isSubscribe = false;

  constructor() {
    makeAutoObservable(this);
    if (typeof window !== 'undefined') {
      this.initFromLocalStorage();
    } 
  }

  initFromLocalStorage() {
    this.isAdmin = window.localStorage.getItem("isAdmin");
    this.isSubscribe = window.localStorage.getItem("isSubscribe");
    this.memberNo = window.localStorage.getItem("memberNo");
    this.token = window.localStorage.getItem("token");
  }

  setLoggedIn(status) {
    this.loggedIn = status;
  }

  checkLoggedIn() {
    this.loggedIn = !!localStorage.getItem("token");
  }
    
  setIsSubscribe(status) {
    this.isSubscribe = status;
    alert("상태확인용" +  status)
  }

  setIsAdmin(status) {
    this.isAdmin = status;
  }

  setMemberNo(memberNo) {
    this.memberNo = memberNo;
  }
}

export const authStore = new AuthStore();
