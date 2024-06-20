import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import BoardListComponent from "../../components/board/BoardListComponent";
import CommunityAxios from "../../api/CommunityAxios";
import Paging from "../../components/board/Paging";
import Search from "../../components/board/Search";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/board.module.css';
import Sort from '../../components/board/Sort';

const CommunityList = observer((props)=>{
    const [boards, setBoards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [sort, setSort] = useState();
    const [paging, setPaging] = useState({});
    const router = useRouter();
    
    useEffect(() => {
      console.log(":::::::::::",currentPage)
        CommunityAxios.getCommunityList(currentPage, limit, sort).then(res => {
          console.log(res.data.list);
          setBoards(res.data.list);
          setCurrentPage(res.data.pg.currentPage);
          setLimit(res.data.pg.limit);
          setPaging(res.data.pg);
        });
    }, [currentPage, sort]);
    
    const myBoard = () => {
      CommunityAxios.getMyCommunity(currentPage, limit, sort).then(res => {
        setBoards(res.data.list);
        setCurrentPage(res.data.pg.currentPage);
        setLimit(res.data.pg.limit);
        setPaging(res.data.pg);
      });
    };
    
    const searchOptions = [
      { value: 'title', label: '제목' },
      { value: 'writer', label: '작성자' },
      { value: 'content', label: '내용' },
    ];
    
    const handleSearch = (type, keyword) => {
        CommunityAxios.searchCommunity(type, keyword, currentPage, limit, sort).then(res => {
          setBoards(res.data.list);
          setCurrentPage(res.data.pg.currentPage);
          setLimit(res.data.pg.limit);
          setPaging(res.data.pg);
        });
    };
    
    const sortOptions = [
      { value: 'latest', label: '최신순' },
      { value: 'oldest', label: '오래된순' },
      { value: 'readCount', label: '조회수 높은순' },
    ];
    
    const handleSort = (selectedOption) => {
      setSort(selectedOption);
    };
    
    const boardList = boards.map(board => 
      (
        <tr key={board.communityNo}>
        <td>{board.communityNo}</td>
        <td><a href="#" onClick={()=>detailBoard(board.communityNo)}>{board.title} </a></td>
        <td>{board.writer}</td>
        <td>{board.readCount}</td>
        </tr>
    ));
    
    const reload =() => {
      window.location.reload();
    };
      
    const createBoard = () => {
      router.push("/community/new");
    };
    
    const detailBoard = (communityNo) => {
      router.push({
          pathname:'/community/detail',
          query:{communityNo:communityNo},
      });
    };
    
    return (
      <div className={styles.container}>
        <h2>커뮤니티 게시판</h2>
        <div className={styles.controls}>
          <div className={styles.controlItem}>
            <RadiusButton color="#77AAAD"  text="전체 목록" onClick={reload}/>
            <RadiusButton color="#77AAAD" text="내 글" onClick={myBoard}/>
          </div>
          <div className={styles.controlItem}>
            <Search options={searchOptions} onSearch={handleSearch} setBoards={setBoards} sortOption={sort} setPaging={setPaging}/>
          </div>
          <div className={styles.controlItem}>
            <Sort options={sortOptions} onSort={handleSort} />
          </div>
      </div>
        <div>
            <BoardListComponent 
            first={"글 번호"} second={"제목"} third={"작성자"} fourth={"조회수"}
            boardList={boardList} styles={styles} />
        </div>
        <div className={styles.actionBar}>
          <div/>
          <Paging className={styles.page} paging={paging} sort={sort}
          setCurrentPage={setCurrentPage}/>
          <RadiusButton color="#77AAAD" text="글쓰기" onClick={createBoard}/>
        </div>
      </div>
    );
})

export default CommunityList;
