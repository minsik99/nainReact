import React, {useEffect, useState} from "react";
import styles from "../../styles/board/search.module.css";
import RadiusButton from '../designTool/RadiusButton';
import CommunityAxios from "../../api/CommunityAxios";


const Search = ({ options, onSearch, setBoards, sortOption, setPaging}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        setSelectedOption(selectedOption);
      }, [sortOption]);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    
    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };
    
    const handleSearch = () => {
        onSearch(selectedOption, searchText);
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <div className={styles.searchContainer}>
            <select className={styles.selectBox}
                value={selectedOption} onChange={handleOptionChange}>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
            <input
                className={styles.input}
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                placeholder="검색어를 입력하세요."
            />
            <img className={styles.searchBtn} src="/image/search.png" onClick={handleSearch} />
        </div>
    );
}
export default Search;
