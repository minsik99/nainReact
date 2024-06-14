import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import MainComponent from "../../components/main/MainComponent";

const NoticeComponent = observer(() => {
  const [searchTitle, setSearchTitle] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = React.useState(false);

  const { data, isLoading } = useQuery(['noticeList', { page, size, searchTitle }], () => getNoticeList({
      category: "notice",
      status: "activated",
      title: searchTitle,
      page: page - 1,
      size: size,
  }), {
      keepPreviousData: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  return (
      <div className="container mt-5">
          <h2>공지사항</h2>
          <div style={{height:"2vw",justifyContent:"center",textAlign:"right"}}>
              <select value={size} onChange={handleSizeChange} style={{height:"88%"}}>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
              </select>
              <input type="text" placeholder="Search by title..." value={searchInput} onChange={handleSearchChange} onKeyDown={handleKeyPress} />
              <button onClick={executeSearch}>검색</button>
          </div>
          <table className="table">
              <thead>
              <tr>
                  <th style={{width:"5vw", textAlign:"center"}}>말머리</th>
                  <th style={{textAlign:"center"}}>제목</th>
                  <th style={{width:"10vw", textAlign:"center"}}>글쓴이</th>
                  <th style={{width:"7vw", textAlign:"center"}}>작성일</th>
                  <th style={{width:"4vw", textAlign:"center"}}>조회</th>
                  <th style={{width:"4vw", textAlign:"center"}}>추천</th>
              </tr>
              </thead>
              <tbody>
              {data.pinnedNotices.map(notice => (
                  <PostCard key={notice.id} notice={notice} isPinned onNoticeClick={() => openDetailModal(notice)} />
              ))}
              {data.regularNotices.map(notice => (
                  <PostCard key={notice.id} notice={notice} onNoticeClick={() => openDetailModal(notice)} />
              ))}
              </tbody>
          </table>
          {isAdmin && (
              <div>
                  <button onClick={openModal}>글쓰기</button>
              </div>
          )}
      </div>
  );
});

export default NoticeComponent;

