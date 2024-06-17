import React from 'react';
import RadiusButton from '../designTool/RadiusButton';
import styles from './searchBar.module.css';
import CustomDropdown from './CustomDropdown';

const SearchBar = ({ columns, sortKey, setSortKey, handleSubmit, keyword, setKeyword, searchOn, visible}) => {
    
    const handleSortKeyChange = (value) => {
        setSortKey(value);
    }

    
    return (
        <div className={styles.searchBar}>
            <div className={styles.search}>
                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
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
            {/* <div className={styles.dropdownBox}> */}
            <CustomDropdown columns={columns} visible={visible} value={sortKey} onChange={handleSortKeyChange} />
            {/* </div> */}
        </div>
    );
};
export default SearchBar;