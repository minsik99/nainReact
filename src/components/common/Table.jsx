import React from 'react';
import { useTable } from 'react-table';
import styles from '../../styles/common/table.module.css';

const Table = ({ columns, data }) => {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

    const handleArticleClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className={styles.tableBox}>
            <table {...getTableProps()} className={styles.tableContainer}>
                <thead className={styles.tableHeader}>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr key={headerGroupIndex} {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th className={styles.tableHeader} key={columnIndex} {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr key={rowIndex} {...row.getRowProps()} className={styles.tableRow}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td key={cellIndex} {...cell.getCellProps()}>
                                        <div className={styles.linkBox}>
                                            <a
                                                className={styles.noDecoration}
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleArticleClick(row.original.link);
                                                }}
                                            >
                                                {cell.render('Cell')}
                                            </a>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
