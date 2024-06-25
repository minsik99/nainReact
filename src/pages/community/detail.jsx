import React, { useState, useEffect } from 'react';
import CommunityAxios from "../../api/CommunityAxios";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/boardDetail.module.css';
import Comment from '../../components/board/Comment';
import modal from '../../components/designTool/modal';
import CustomDropdown from '../../components/designTool/CustomDropdown';

const BoardDetail = () => {
    const router = useRouter();
    const { communityNo } = router.query;
    const [showModal, setShowModal] = useState(false);
    const [board, setBoard] = useState({
        communityNo : communityNo,
        title: '',
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
    const [reportOpen, setReportOpen] = useState(false);

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

    const handleReportClick = () => {
        return(
            <modal isOpen={true} content={'테스트'}/>
        )
    };
    
    const deleteBoard = () => {
        console.log("삭제하려는 게시판 정보", board);
        CommunityAxios.deleteCommunity(board.communityNo, board).then(res => {
            setShowModal(true); // 성공 모달 열기
            setTimeout(() => {
              setShowModal(false); // 모달 닫기
              router.push('/community'); // 페이지 이동
            }, 500); // 2초 후에 페이지 이동
        })
        .catch(error => {
            alert('게시글 삭제 오류');
        })
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
                <img src="/image/report.png" onClick={handleReportClick} />
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
                <div className={styles.buttons}>
                    <RadiusButton color="#77AAAD" text="삭제" onClick={deleteBoard} />
                    {showModal && (
                        <div className="modal">
                        <div className="modal-content">
                                <h5>게시글을 삭제하였습니다.</h5>
                            </div>
                        </div>
                    )}
                    <RadiusButton color="#77AAAD" text="수정" onClick={modifyBoard} />
                </div>
            <h4>댓글</h4>
            <Comment comments={comments} communityNo={board.communityNo} styles={styles} />
        </div>
    );
};

export default BoardDetail;
