import React, {useEffect, useState} from "react";
import styles from "../../styles/board/search.module.css";
import RadiusButton from '../designTool/RadiusButton';

const Search = ({ options, onSearch }) => {
  const [selectedOption, setSelectedOption] = useState('');
    const [searchText, setSearchText] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    
    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };
    
    const handleSearch = () => {
        onSearch(selectedOption, searchText);
    };
    
    return (
        <div className={styles.searchContainer}>
            <select className={styles.searchContainer}
                value={selectedOption} onChange={handleOptionChange}>
                <option value="">선택하세요...</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </select>
            <input
                className={styles.input}
                type="text"
                value={searchText}
                onChange={handleSearchInputChange}
                placeholder="검색어를 입력하세요."
            />
            <RadiusButton className="btn btn-primary" text="검색" onClick={handleSearch}/>
        </div>
    );
}
export default Search;
