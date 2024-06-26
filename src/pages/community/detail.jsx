import React, { useState, useEffect } from 'react';
import CommunityAxios from "../../api/CommunityAxios";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/boardDetail.module.css';
import Comment from '../../components/board/Comment';
import Modal from '../../components/common/Modal';
import {useModal} from '../../components/hook/useModal';

const BoardDetail = () => {
    const router = useRouter();
    const { communityNo } = router.query;
    const [board, setBoard] = useState({
        communityNo : communityNo,
        title: '',
        memberNo: '',
        writer: '',
        communityDate: '',
        modifiedDate: '',
        content: '',
        fileName: '',
        fileModified: '',
        readCount : '',
    });
    const [comments, setComments] = useState([]);
    const [date, setDate] = useState('');
    const [modifiedDate, setModifiedDate] = useState('');
    const [isMine, setIsMine] = useState(false);
    const reportModal = useModal();
    const delModal = useModal();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            if(board.memberNo == memberNo){
                setIsMine(true);
            }
        }
    }, [board]);

    console.log("가져온 정보", board);
    useEffect(() => {
        if (communityNo) {
            CommunityAxios.getCommunityDetail(communityNo)
                .then(res => {
                    const community = res.data.communityDto
                    const enroll = new Date(community.communityDate);
                    const modi = new Date(community.modifiedDate);
                    setDate(enroll.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));
                    setModifiedDate(modi.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }));

                    setBoard({
                        communityNo: communityNo,
                        title: community.title,
                        memberNo: community.memberDto.memberNo,
                        writer: community.writer,
                        communityDate: community.communityDate,
                        modifiedDate: community.modifiedDate ? community.modifiedDate : null,
                        content: community.content,
                        fileName: community.fileUpload,
                        fileModified: community.fileModified,
                        readCount: community.readCount,
                    });
                    setComments(res.data.list);
                })
                .catch(error => {
                    console.error("Failed to fetch community detail:", error);
                });
        }
    }, [communityNo]);
    

    const downloadFile = () => {
        CommunityAxios.getFile(board.fileModified).then(res => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', board.fileName); // 다운로드되는 파일의 이름 설정
            document.body.appendChild(link);
            link.click();
        });
    };

    // const OwnBoard = board.communityNo === userNo;

    const reload = () => {
        router.push("/community");
    };

    const handleOpenReport = () => {
       reportModal.openModal({
          title: '게시글 신고', //제목 추가 가능
          content: '신고 사유', //모달안 내용(현재는 드롭다운만 구현상태)
          columns: [{'Header':'욕설 및 비방'}, {'Header':'광고'}, {'Header':'도배'}],
    //신고하기 대신 원하는 문구 삽입, 처음 들어가는 문장이 기본값
          onConfirm: (selectedItem) => {
            console.log('Selected item:', selectedItem);
            reportModal.closeModal();
          },
    //드롭다운 선택시 안에 들어있는 값가지고 옴
        });
      };

      const handleOpenDelete = () => {
        delModal.openModal({
          title: '게시글 삭제', //제목 추가 가능
          content: '정말로 삭제하시겠습니까?', 
          columns: board.communityNo,
          onConfirm: (communityNo) => {
            CommunityAxios.deleteCommunity(communityNo, board).then(res => {
                router.push('/community');
            })
            .catch(error => {
                alert('게시글 삭제 오류');
            })
            delModal.closeModal();
          },
        });
      };

    const modifyBoard = () => {
        router.push({
            pathname: '/community/new',
            query: { primalBoard: JSON.stringify(board) }
        });
    };

    return (
        <div className={styles.base}>
            <h2>커뮤니티 게시판</h2>
            <div className={styles.buttons}>
                <RadiusButton color="#77AAAD" text="전체 목록" onClick={reload} />
                <img src="/image/report.png" onClick={handleOpenReport} />
                <Modal type='custom'  isOpened={reportModal.isOpened} data={reportModal.modalData} closeModal={reportModal.closeModal}/>
            </div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3>{board.title}</h3>
                    
                    <div className={styles.info}>
                        <span>
                            <p>작성자 : {board.writer}</p>
                            <p>조회수 : {board.readCount}</p>
                        </span>
                        <span>
                        <p>작성날짜 : {date}</p>
                        {board.modifiedDate && (
                            <p>수정날짜 : {modifiedDate}</p>
                        )}
                        </span>
                    </div>
                </div>
                <div className={styles.content} dangerouslySetInnerHTML={{ __html: board.content }} />
                    {board.fileName && (
                        <div>첨부 파일 : <a className={styles.file} onClick={downloadFile}>{board.fileName}</a></div>
                    )}
                </div>
                    {isMine && (
                        <div className={styles.buttons}>
                        <RadiusButton color="#77AAAD" text="삭제" onClick={handleOpenDelete} />
                        <Modal type='default' isOpened={delModal.isOpened} data={delModal.modalData} closeModal={delModal.closeModal}/>
                        <RadiusButton color="#77AAAD" text="수정" onClick={modifyBoard} />
                    </div>
                    )}
            <h4>댓글</h4>
            <Comment comments={comments} communityNo={board.communityNo} styles={styles} />
        </div>
    );
};

export default BoardDetail;
