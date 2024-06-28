import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import BoardListComponent from "../../components/board/BoardListComponent";
import CommunityAxios from "../../api/CommunityAxios";
import Paging from "../../components/board/Paging";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/board.module.css';

const Community = observer(() => {
    const [boards, setBoards] = useState([]);
    const [paging, setPaging] = useState({});
    const [currentPage, setCurrentPage] = useState (1);
    const limit = 15;
    const [sort, setSort] = useState('latest');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [type, setType] = useState('title');
    const [myInfo, setMyInfo] = useState('');
    const router = useRouter();
    const [loginState, setLoginState] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            if(memberNo){
                setLoginState(true);
            }
        }
    }, []);

    useEffect(() => {
        CommunityAxios.searchCommunity(type, searchKeyword, currentPage, limit, sort).then(res => {
            setBoards(res.data.list);
            setPaging(res.data.pg);
        });
        if(loginState){
            CommunityAxios.myInfo().then(res => {
                setMyInfo(res.data);
            });
        }
    }, [currentPage, sort]);

    const boardList = boards.map(board => (
        <tr key={board.communityNo}>
          <td>{board.communityNo}</td>
          <td><a href="#" onClick={() => detailBoard(board.communityNo)}>{board.title}</a></td>
          <td>{board.writer}</td>
          <td>{board.readCount}</td>
        </tr>
    ));


    const searchOptions = [
        { value: 'title', label: '제목' },
        { value: 'writer', label: '작성자' },
        { value: 'content', label: '내용' },
    ];

    const handleType = (event) => {
        setType(event.target.value);
    }

    const handleKeyword = (event) => {
        setSearchKeyword(event.target.value);
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSearch = () => {
        CommunityAxios.searchCommunity(type, searchKeyword, currentPage, limit, sort).then(res=> {
            setBoards(res.data.list);
            setPaging(res.data.pg);
        });
    };
    

    const sortOptions = [
        { value: 'latest', label: '최신순' },
        { value: 'oldest', label: '오래된순' },
        { value: 'readCount', label: '조회수 높은순' },
    ];

    const handleSort = (event) => {
        setSort(event.target.value);
    }

    //전체목록(새로고침)
    const reload = () => {
        window.location.reload();
    };
    
    //내 글 보기
    const myBoard = () => {
        CommunityAxios.searchCommunity('writer', myInfo, currentPage, limit, sort).then(res=>{
            setBoards(res.data.list);
            setPaging(res.data.pg);
            setType('writer');
            setSearchKeyword(myInfo);
        });
    };

    const createBoard = () => {
        router.push("/community/new");
    };

    const detailBoard = (communityNo) => {
        router.push({
            pathname: '/community/detail',
            query: { communityNo },
        });
    };


    return (
    <div className={styles.container}>
        <h2>커뮤니티 게시판</h2>
        <div className={styles.controls}>
            <div className={styles.controlItem}>
                <RadiusButton color="#77AAAD" text="전체 목록" onClick={reload} />
                {loginState ? <RadiusButton color="#77AAAD" text="내 글" onClick={myBoard}/>
                : <p/>
                }
                
            </div>
            <div className={styles.controlItem}>
                <div className={styles.searchContainer}>
                    <select className={styles.selectBox}
                        value={type} onChange={handleType}>
                        {searchOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <input
                        className={styles.input}
                        type="text"
                        value={searchKeyword}
                        onChange={handleKeyword}
                        onKeyDown={handleKeyDown}
                        placeholder="검색어를 입력하세요."
                    />
                    <img className={styles.searchBtn} src="/image/search.png" onClick={handleSearch} />
                </div>
            </div>
            <div className={styles.controlItem}>
                <div className={styles.selectContainer}>
                    <select className={styles.selectBox}
                        value={sort} onChange={handleSort}>
                        {sortOptions.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
        <div>
        <BoardListComponent
            first={"글 번호"} second={"제목"} third={"작성자"} fourth={"조회수"}
            boardList={boardList} styles={styles} />
        </div>
        <div className={styles.actionBar}>
        <div />
        <Paging className={styles.page} paging={paging} setCurrentPage={setCurrentPage} />
        {loginState ? <RadiusButton color="#77AAAD" text="글쓰기" onClick={createBoard} /> : <div/>} 
        </div>
    </div>
    );
});

export default Community;