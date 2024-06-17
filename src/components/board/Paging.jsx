import React, {useState} from "react";
import {communityList} from "../../pages/community/index";
import { useRouter } from 'next/router';

const Paging = ({paging,sort,setPage}) => {
    const limit = paging.limit;
    // const router = useRouter();

    const listBoard = (page) => {
        setPage(page)
        // router.push({
        //     pathname: '/community',
        //     query: {page: page}
        // })
    }

    const nowPage = () => {
        const pageNums = [];
        for (let i = paging.startPage; i <= paging.endPage; i++ ) {
          pageNums.push(i);
        }
        console.log(pageNums);
    
        return (pageNums.map((page) =>
            <li className="page-item" key={page.toString()} >
              <a className="page-link" onClick = {() => listBoard(page)}>{page}</a>
            </li>
        ));
      };
    
      const nextGroup = () => {
        if(paging.maxPage > paging.endPage){
          return(
              <li className="page-item">
                <a className="page-link" onClick={() => listBoard(paging.startPage + 10)}>다음</a>
              </li>
          )};
      };
    
      const prevGroup = () => {
        if(paging.startPage > 10){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(paging.startPage - 10)}>이전</a>
            </li>
          )};
      };
      
      const firstPage = () => {
        if(paging.currentPage > 1){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(1)}>첫 페이지</a>
            </li>
          )};
      };
      
      const lastPage = () => {
        if(paging.currentPage < paging.maxPage){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(paging.maxPage)}>끝 페이지</a>
            </li>
          )};
      };

    return(
        <div>
            <ul className="pagination justify-content-center">
              {firstPage()}
              {prevGroup()}
              {nowPage()}
              {nextGroup()}
              {lastPage()}
            </ul>
        </div>
    )

};

export default Paging;