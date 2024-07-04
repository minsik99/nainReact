import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import noticeAxios from '../../api/noticeAxios';
import BoardListComponent from "../../components/board/BoardListComponent";
import Paging from "../../components/board/Paging";
import Search from "../../components/board/Search";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';
import styles from '../../styles/board/board.module.css';
import Sort from '../../components/board/Sort';

const noticeList = observer(() => {
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState('latest');
  const [type, setType] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [paging, setPaging] = useState({});
  const router = useRouter();

  useEffect(() => {
    console.log(":::::::::::", currentPage, type, searchKeyword);
    noticeAxios.searchNotice(type, searchKeyword, currentPage, limit, sort).then(res => {
      console.log(res.data.list);
      setBoards(res.data.list);
      setPaging(res.data.pg);
    });
  }, [currentPage, sort]);

  const searchOptions = [
    { value: 'title', label: '제목' },
    { value: 'writer', label: '작성자' },
    { value: 'content', label: '내용' },
];

  const handleSearch = () => {
    noticeAxios.searchNotice(type, searchKeyword, currentPage, limit, sort).then(res => {
      setBoards(res.data.list);
      setPaging(res.data.pg);
    });
  };

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

  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'noticeReadCount', label: '조회수 높은순' },
  ];


  const boardList = boards.map(board =>
  (
    <tr key={board.noticeNo}>
      <td>{board.noticeNo}</td>
      <td><a href="#" onClick={() => 
        detailBoard(board.noticeNo)}
        style={{
          fontWeight: new Date() <= new Date(board.noticeImportent) ? 'bold' : '',
          color: new Date() <= new Date(board.noticeImportent) ? '#77AAAD' : '',
          fontSize: new Date() <= new Date(board.noticeImportent) ? '18px' : '16px',
        }}> {new Date() <= new Date(board.noticeImportent) ? '※ ' : ''}
                {board.noticeTitle} </a></td>
      <td>{board.noticeWriter}</td>
      <td>{board.noticeReadCount}</td>
      <td>
        {board.noticeDelete ? '삭제됨' : ''}
      </td>
    </tr>
  ));

  const reload = () => {
    window.location.reload();
  };

  const createBoard = () => {
    router.push("/notice/new");
  };

  const detailBoard = (noticeNo) => {
    router.push({
      pathname: '/notice/detail',
      query: { noticeNo: noticeNo },
    });
  };

  return (
    <div className={styles.container}>
      <h2>공지사항</h2>
      <div className={styles.controls}>
        <div className={styles.controlItem}>
          <RadiusButton color="#77AAAD" text="전체 목록" onClick={reload} />
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
        <Sort styles={styles} sortOptions={sortOptions} setSort={setSort} sort={sort}/>
        </div>
      </div>
      <div>
        <BoardListComponent
          first={"글 번호"} second={"제목"} third={"작성자"} fourth={"조회수"}
          boardList={boardList} styles={styles} />
      </div>
      <div className={styles.actionBar}>
        <div />
        <Paging className={styles.page} paging={paging} sort={sort}
          setCurrentPage={setCurrentPage} />
        <RadiusButton color="#77AAAD" text="글쓰기" onClick={createBoard} />
      </div>
    </div>

  );

})


export default noticeList;

