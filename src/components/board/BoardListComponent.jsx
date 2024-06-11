import React, { useState, useEffect } from "react";
import CommunityAxios from "../../api/CommunityAxios";

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("communityDate");
  const [paging, setPaging] = useState({});

  useEffect(() => {
    CommunityAxios.getCommunityList(currentPage, limit, sort).then(res => {
      setCommunities(res.data.list);
      setCurrentPage(res.data.pg.currentPage);
      setLimit(res.data.pg.limit);
      setPaging(res.data.pg);
    });
  }, [currentPage, limit, sort]);
 
  const communityList = (page, limit, sort) => {
    CommunityAxios.getCommunityList(page, limit, sort).then((res) => {
      setCommunities(res.data.list);
      setCurrentPage(res.data.pg.currentPage);
      setPaging(res.data.pg);
    });
  };

  const nowPage = () => {
    const pageNums = [];
    for (let i = paging.startPage; i <= paging.endPage; i++ ) {
      pageNums.push(i);
    }
    console.log(pageNums);

    return (pageNums.map((page) =>
        <li className="page-item" key={page.toString()} >
          <a className="page-link" onClick = {() => communityList(page)}>{page}</a>
        </li>
    ));
  };

  const nextGroup = () => {
    if(paging.listCount > paging.endPage){
      return(
          <li className="page-item">
            <a className="page-link" onClick={() => communityList(paging.startPage + 10, limit, sort)}>다음</a>
          </li>
      )};
  };

  const prevGroup = () => {
    if(paging.startPage > 10){
      return(
        <li className="page-item">
          <a className="page-link" onClick={() => communityList(paging.startPage - 1, limit, sort)}>다음</a>
        </li>
      )};
  };
  
  const firstPage = () => {
    if(paging.currentPage > 1){
      return(
        <li className="page-item">
          <a className="page-link" onClick={() => communityList(1, limit, sort)}>다음</a>
        </li>
      )};
  };
  
  const lastPage = () => {
    if(paging.endPage < paging.maxPage){
      return(
        <li className="page-item">
          <a className="page-link" oncClikc={() => communityList(paging.maxPage, limit, sort)}>끝</a>
        </li>
      )};
  };

  const createCommunity = () => {
    navigate(`/new`);
  };
  const detailCommunity = (boardNum) => {
    navigate(`/detail/${boardNum}`);
  };

  return (
      <div>
        <h2 className="text-center">Boards List</h2>
        <div className="row">
          <button className="btn btn-primary" onClick={createCommunity}>글 작성</button>
        </div>
        <div className="row">
          <table className="table table-striped table-bordered">
            <thead>
            <tr>
              <th>글 번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>조회수</th>
            </tr>
            </thead>
            <tbody>
            {communities.map(community => (
                <tr key={community.communityNo}>
                  <td>{community.communityNo}</td>
                  <td><a onClick={()=>detailCommunity(community.boardNum)}>{community.title} </a></td>
                  <td>{community.writer}</td>
                  <td>{community.readCount}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
              {firstPage()}
              {prevGroup()}
              {nowPage()}
              {nextGroup()}
              {lastPage()}
            </ul>
          </nav>
        </div>
      </div>
  );
};

export default CommunityList;