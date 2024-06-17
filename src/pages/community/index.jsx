import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import BoardListComponent from "../../components/board/BoardListComponent";
import CommunityAxios from "../../api/CommunityAxios";
import Paging from "../../components/board/Paging";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';

import styles from "../../styles/board/board.module.css";

const CommunityList = observer((props)=>{
    const [boards, setBoards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
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
    }, [currentPage, limit, sort]);
      
    const createBoard = () => {
      router.push("/community/new");
    };

      const detailBoard = (communityNo) => {
        router.push({
            pathname:'/community/detail',
            query:{boardNo: communityNo},
        });
      };


    return (
        <div className={styles["table-wrapper"]}>
            <BoardListComponent title={"커뮤니티 게시판"} first={"글 번호"} second={"제목"} third={"작성자"} fourth={"조회수"}/>
            <table className={styles["table-container"]}>
                <tbody className={styles["custom-table"]}>
                  {boards.map(board => (
                      <tr key={board.communityNo}>
                      <td className={styles["table-cell"]}>{board.communityNo}</td>
                      <td className={styles["table-cell"]}><a href="#" onClick={()=>detailBoard(board.communityNo)}>{board.title} </a></td>
                      <td className={styles["table-cell"]}>{board.writer}</td>
                      <td className={styles["table-cell"]}>{board.readCount}</td>
                      </tr>
                  ))}
                </tbody>
            </table>
            <Paging paging={paging} sort={sort}
            setPage={setCurrentPage}/>
            <RadiusButton className="btn btn-primary" text="글 작성" onClick={createBoard}/>
        </div>
    );
})

export default CommunityList;
