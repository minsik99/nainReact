import React from "react";
import styles from "../../styles/board/board.module.css";

const BoardList = (props) => {

  return (
      <div>
        <h2>{props.title}</h2>
        <div>
          <table className={styles["thead"]}>
            <thead>
              <tr>
                <th>{props.first}</th>
                <th>{props.second}</th>
                <th>{props.third}</th>
                <th>{props.fourth}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
  );
}
export default BoardList;
