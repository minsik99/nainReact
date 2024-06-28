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

const noticeList = observer((props) => {
  const [boards, setBoards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState();
  const [paging, setPaging] = useState({});
  const router = useRouter();

  useEffect(() => {
    console.log(":::::::::::", currentPage)
    noticeAxios.getNoticeList(currentPage, limit, sort).then(res => {
      console.log(res.data.list);
      setBoards(res.data.list);
      setCurrentPage(res.data.pg.currentPage);
      setLimit(res.data.pg.limit);
      setPaging(res.data.pg);
    });
  }, [currentPage, sort]);

  const searchOptions = [
    { value: 'noticeTitle', label: '제목' },
    { value: 'noticeWriter', label: '작성자' },
    { value: 'noticeContent', label: '내용' },
  ];

  const handleSearch = (type, keyword) => {
    noticeAxios.searchNotice(type, keyword, currentPage, limit, sort).then(res => {
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
    <tr key={board.noticeNo}>
      <td>{board.noticeNo}</td>
      <td><a href="#" onClick={() => detailBoard(board.noticeNo)}>{board.noticeTitle} </a></td>
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
          <Search options={searchOptions} onSearch={handleSearch} setBoards={setBoards} sortOption={sort} setPaging={setPaging} />
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
        <div />
        <Paging className={styles.page} paging={paging} sort={sort}
          setCurrentPage={setCurrentPage} />
        <RadiusButton color="#77AAAD" text="글쓰기" onClick={createBoard} />
      </div>
    </div>

  );

})


export default noticeList;

