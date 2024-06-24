import React, {useState} from "react";
import styles from "../../styles/board/search.module.css";

const Sort = ({options, onSort}) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        onSort(selectedOption);
      };

  return (
    <div className={styles.selectContainer}>
        <select className={styles.selectBox}
            value={selectedOption} onChange={handleOptionChange}>
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
  );
}
export default Sort;
