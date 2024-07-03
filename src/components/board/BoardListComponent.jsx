import React from "react";

const BoardList = (props) => {
  const {first, second, third, fourth, boardList, styles } = props; 
  console.log(boardList);
  return (
    <div>
        <div>
            <table className={styles.tableContainer}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th>{first}</th>
                  <th>{second}</th>
                  <th>{third}</th>
                  <th>{fourth}</th>
                </tr>
              </thead>
              {boardList.length > 0 ? 
                <tbody className={styles.tableRow}>
                  {boardList}
                </tbody>
                :
                <tbody>
                  <tr className={styles.emptyRow}>
                    <td></td> 
                    <td className={styles.empty}>표시할 내용이 없습니다.</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>}
            </table>
          </div>
    </div>
  );
}
export default BoardList;