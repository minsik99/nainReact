import React, {useState} from "react";

const Sort = ({options, onSort}) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        onSort(value);
      };

  return (
    <div>
        <select
            value={selectedOption} onChange={handleOptionChange}>
            <option value="">정렬 기준</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
  );
}
export default Sort;
