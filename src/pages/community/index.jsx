import React, {useEffect, useState} from "react";
import { observer } from "mobx-react";
import BoardListComponent from "../../components/board/BoardListComponent";
import CommunityAxios from "../../api/CommunityAxios";
import Paging from "../../components/board/Paging";
import { useRouter } from 'next/router';
import RadiusButton from '../../components/designTool/RadiusButton';

const CommunityList = observer((props)=>{
    const [boards, setBoards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState("communityDate");
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
      
    // const communityList = (page, limit, sort) => {
    //   CommunityAxios.getCommunityList(page, limit, sort).then((res) => {
    //     setCommunities(res.data.list);
    //     setCurrentPage(res.data.pg.currentPage);
    //     setPaging(res.data.pg);
    //   });
    // };

      const createBoard = () => {
        router.push('/community/new');
      };

      const detailBoard = (communityNo) => {
        router.push({
            pathname:'/community/detail',
            query:{boardNo: communityNo},
        });
      };


    return (
        <div>
            <div className="row">
                <RadiusButton className="btn btn-primary" text="글 작성" onClick={createBoard}/>
            </div>
            <BoardListComponent
            title={"커뮤니티 게시판"} first={"글 번호"} second={"제목"} third={"작성자"} fourth={"조회수"}/>
            <table className="table table-striped table-bordered">
                <tbody>
                  {boards.map(board => (
                      <tr key={board.communityNo}>
                      <td>{board.communityNo}</td>
                      <td><a href="#" onClick={()=>detailBoard(board.communityNo)}>{board.title} </a></td>
                      <td>{board.writer}</td>
                      <td>{board.readCount}</td>
                      </tr>
                  ))}
                </tbody>
            </table>
            <Paging paging={paging} sort={sort}
            setPage={setCurrentPage}
            />
        </div>
    );
})

export default CommunityList;
