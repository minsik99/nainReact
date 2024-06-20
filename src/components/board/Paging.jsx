import React, {useState} from "react";
import styles from '../../styles/board/paging.module.css';

const Paging = ({paging, sort,setCurrentPage}) => {
    const limit = paging.limit;
    // const router = useRouter();

    const listBoard = (page) => {
      setCurrentPage(page)
    }

    const nowPage = () => {
        const pageNums = [];
        for (let i = paging.startPage; i <= paging.endPage; i++ ) {
          pageNums.push(i);
        }
        console.log(pageNums);
    
        return (pageNums.map((page) =>
            <li className="page-item" key={page.toString()} >
              <a className="page-link" onClick = {() => listBoard(page)}>
                <div className={styles.pages}>{page}</div>
              </a>
            </li>
        ));
      };
    
      const nextGroup = () => {
        if(paging.maxPage > 10){
          return(
              <li className="page-item">
                <a className="page-link" onClick={() => listBoard(paging.startPage + 10)}>
                  <div className={styles.arrow}>
                  〉
                  </div>
                </a>
              </li>
          )};
      };
    
      const prevGroup = () => {
        if(paging.currentPage > 10){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(paging.startPage - 10)}>
                <div className={styles.arrow}>
                  〈
                </div>
              </a>
            </li>
          )};
      };
      
      const firstPage = () => {
        if(paging.currentPage > 1){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(1)}>
                <div className={styles.arrow}>
                  《
                </div>
              </a>
            </li>
          )};
      };
      
      const lastPage = () => {
        if(paging.currentPage < paging.maxPage){
          return(
            <li className="page-item">
              <a className="page-link" onClick={() => listBoard(paging.maxPage)}>
                <div className={styles.arrow}>
                  》
                </div>
              </a>
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