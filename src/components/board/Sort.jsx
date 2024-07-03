import React, {useState} from "react";

const Sort = ({styles, sortOptions, setSort, sort}) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSort = (event) => {
        setSort(event.target.value);
    };

  return (
    <div className={styles.selectContainer}>
        <select className={styles.selectBox}
            value={sort} onChange={handleSort}>
            {sortOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
  );
}
export default Sort;
