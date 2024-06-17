// components/Table.js
import React, { useEffect, useState} from 'react';
import styles from './table.module.css';


const Table = ({ columns , data, sortKey}) => {
  const [sortedData, setSortedData] = useState(data);

    useEffect(() => {
      handleSort(sortKey);
    },[sortKey])

    const handleSort = (key) => {
        const sortedArray = [...data].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setSortedData(sortedArray);
    };

  return (
    <div className={styles.tableBox}>
      <table className={styles.tableContainer}>
        <thead className={styles.tableHeader}>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tableRow}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  <div className={styles.linkBox}>
                  {column.accessor === 'index' ? 
                    ( rowIndex + 1 ) : ( <a
                    className={styles.noDecoration}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleArticleClick(row.link);
                    }}
                >
                  {row[column.accessor]}
                  </a>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
  );
};

export default Table;
