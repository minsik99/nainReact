import instance from "./axiosApi";

//기본 url 지정
const NOTICE_URL = "/notice";

const noticeAxios = {
    
    //전체목록 조회
    // getNoticeList(page, limit, sort) {
    //     return instance.get(NOTICE_URL + "/list", {
    //         params : {page: page, limit: limit, sort: sort}
    //     });
    // },

    //글 상세보기
    getNoticeDetail(noticeNo) {
        return instance.get(NOTICE_URL + '/detail',{
            params : {noticeNo: noticeNo}
        });
    }, 

    //파일 다운로드
    getFile(fileName){
        return instance.get(NOTICE_URL + '/download', {
            params : {fileName: fileName},
            responseType: 'blob'
        })
    },

    //게시글 검색
    searchNotice(type, keyword, page, limit, sort) {
        console.log('eqq', type, keyword, page, limit, sort);
        return instance.get(NOTICE_URL + '/search',{
            params : {type: type, keyword: keyword, page: page, limit: limit, sort: sort}
        });
    },

    //새 게시글 등록
    createNotice(notice) {
        return instance.post(NOTICE_URL, notice);
    },

    //파일 업로드
    insertFile(formData) {
        return instance.post(NOTICE_URL + '/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // //중요도
    // importentNotice(notice) {
    //     return instance.post(NOTICE_URL, {
    //         noticeImportent: new Date().toISOString(),
    //         ...notice,
    //     });
    // },

    //게시글 수정
    modifyNotice(noticeNo, notice) {
        return instance.put(NOTICE_URL + `/modify/${noticeNo}`, notice);
    },


    //게시글 삭제(숨김)
    hiddenNotice(noticeNo, notice) {
    return instance.put(NOTICE_URL + `/del/${noticeNo}`, notice);
    },


    //DB 삭제
    deleteNotice(noticeNo){
        return instance.delete(NOTICE_URL + '/delete',{
            params : {noticeNo: noticeNo}
        });
    },

}

export default noticeAxios;
