import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommunityAxios from "../../api/CommunityAxios";

const BoardDetail = (props) => {
    const { id } = useParams(); // 게시글 ID
    const [board, setBoard] = useState({
        communityNo: props.communityNo,
        title: '',
        writer: '',
        date: '',
        content: '',
        fileName: '',
    });

    useEffect(() => {
        // 게시글 데이터 조회
        CommunityAxios.getCommunityDetail(props.communityNo)
            .then(res => {
                const data = res.data;
                setBoard({
                    title: data.title,
                    writer: data.writer,
                    date: data.communityDate,
                    content: data.content,
                    fileName: data.fileModified,
                });
            })
            .catch(error => {
                console.error('Error fetching board detail:', error);
            });
    }, [id]);

    const handleReportClick = () => {
        alert('게시글을 신고했습니다.');
    };

    return (
        <div>
            <h2>게시글 상세보기</h2>
            <div>
                <p>글 번호: {board.communityNo}</p>
                <h3>{board.title}</h3>
                <p>작성자: {board.writer}</p>
                <p>작성날짜: {board.date}</p>
                <div dangerouslySetInnerHTML={{ __html: board.content }} />
                {board.fileName && <p>첨부 파일: {board.fileName}</p>}
                <button onClick={handleReportClick}>신고하기</button>
            </div>
        </div>
    );
};

export default BoardDetail;