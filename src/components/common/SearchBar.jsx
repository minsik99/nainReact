import React, { useState } from 'react';
import RadiusButton from '../designTool/RadiusButton';
import styles from '../../styles/common/searchBar.module.css';
const SearchBar = ({handleSubmit, keyword, setKeyword, searchOn}) => {
    const handleInputChange = (e) => {
        setKeyword(e.target.value);
    };

    return (
            <div className={styles.search}>
                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={handleInputChange}
                        ref={searchOn}
                        placeholder="검색어를 입력하세요"
                        className={styles.searchInput}
                    />
                    <RadiusButton
                        color="#77AAAD"
                        text="검색"
                        padding="0.5rem 1rem"
                        onClick={handleSubmit}
                        fontSize="14px"
                    />
                </form>
            </div>
    );
};

export default SearchBar;
