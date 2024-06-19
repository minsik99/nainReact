import React from "react";

const BoardList = (props) => {
  const {first, second, third, fourth, boardList, styles } = props; 

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
              <tbody className={styles.tableRow}>
                {boardList}
              </tbody>
            </table>
          </div>
    </div>
  );
}
export default BoardList;