//커뮤니티&댓글 관련 axois
// import axios from "axios";
// import instance from './api/axiosApi';
import instance from "./axiosApi";
// 인터셉터 적용된 axios 사용하세요

//기본 url 지정
const COMMUNITY_URL = "/community";

const CommunityAxios = {
    //게시글 -----------------------------------------------------------------------------------------------------------------
    //커뮤니티 전체목록 조회
    getCommunityList(page, limit, sort) {
        // return axios.get(`http://localhost:9999${COMMUNITY_URL}/list?page=${page}&limit=${limit}&sort=${sort}`);
        return instance.get(COMMUNITY_URL + "/list", {
            params : {page: page, limit: limit, sort: sort}
        });
    },

    //내 글 목록조회
    getMyCommunity(page, limit, sort) {
        // return axios.get(`${COMMUNITY_URL}/mylist/?page=${page}&limit=${limit}&sort=${sort}`);
        return instance.get(COMMUNITY_URL + '/mylist',{
            params : {page: page, limit: limit, sort: sort}
        });
    },

    //글 상세보기
    getCommunityDetail(communityNo) {
        // return axios.get(`${COMMUNITY_URL}/detail/${communityNo}`);
        return instance.get(COMMUNITY_URL + '/detail',{
            params : {communityNo: communityNo}
        });
    },

    //게시글 검색
    searchCommunity(type, keyword, page, limit, sort) {
        // return axios.get(`${COMMUNITY_URL}/search?type=${type}&keyword=${keyword}&page=${page}&limit=${limit}&sort=${sort}`)
        return instance.get(COMMUNITY_URL + '/search',{
            params : {type: type, keyword: keyword, page: page, limit: limit, sort: sort}
        });
    },

    //새 게시글 등록
    createCommunity(community) {
        //return axios.post(`${COMMUNITY_URL}`, community);
        return instance.post(COMMUNITY_URL, {
            params : {community: community}
        });
    },

    //게시글 수정
    modifyCommunity(communityNo, community) {
        // return axios.put(`${COMMUNITY_URL}/modify/${communityNo}`, community);
        return instance.put(COMMUNITY_URL + '/modify',{
            params : {communityNo: communityNo, community: community}
        });
    },

    //게시글 삭제값 추가
    deleteCommunity(communityNo, community) {
        // return axios.put(`${COMMUNITY_URL}/del/${communityNo}`, community)
        return instance.put(COMMUNITY_URL + '/del',{
            params : {communityNo: communityNo, community: community}
        });
    },

    //게시글 DB삭제
    terminateCommunity(communityNo){
        // return axios.delete(`${COMMUNITY_URL}/terminate/${communityNo}`); 
        return instance.delete(COMMUNITY_URL + '/terminate',{
            params : {communityNo: communityNo}
        });
    },


    //댓글 ----------------------------------------------------------------------------------------------------------------- 
    //댓글 목록 조회
    getCommentList(communityNo){
        // return axios.get(`${COMMUNITY_URL}/comment/${communityNo}`)
        return instance.get(COMMUNITY_URL + '/comment',{
            params : {communityNo: communityNo}
        });
    },

    //댓글 등록
    createComment(comment){
        // return axios.post(`${COMMUNITY_URL}/comment`, comment)
        return instance.post(COMMUNITY_URL + '/comment',{
            params : {comment: comment}
        });
    },

    //댓글 수정
    modifyComment(commentNo, comment){
        // return axios.put(`${COMMUNITY_URL}/comment/modify/${commentNo}`, comment)
        return instance.put(COMMUNITY_URL + '/comment/modify',{
            params : {commentNo: commentNo, comment: comment}
        });
    },

    //댓글 삭제값 추가
    deleteComment(commentNo, comment){
        // return axios.put(`${COMMUNITY_URL}/comment/del/${commentNo}`, comment)
        return instance.put(COMMUNITY_URL + '/comment/del',{
            params : {commentNo: commentNo, comment: comment}
        });
    },

    //댓글 DB삭제
    terminateComment(commentNo){
        // return axios.delete(`${COMMUNITY_URL}/comment/terminate/${commentNo}`)
        return instance.delete(COMMUNITY_URL + '/comment/terminate',{
            params : {commentNo: commentNo}
        });
    }
}

//외부에서 이 클래스를 import해서 사용하게 하려면
export default CommunityAxios; //객체를 내보냄
