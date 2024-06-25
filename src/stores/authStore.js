import {makeAutoObservable} from 'mobx';


class AuthStore{
    loggedIn = false;
    isAdmin = false;
    memberNo = null;

    constructor() {
        makeAutoObservable(this);
    }

    setLoggedIn(status){
        this.loggedIn = status
    }

    checkLoggedIn(){
        this.loggedIn = !!localStorage.getItem("token");
    }

    setIsAdmin(status){
        this.isAdmin = status;
    }

    setMemberNo(memberNo){
        this.memberNo = memberNo;
    }
}

export const authStore = new AuthStore();