import { useState } from 'react';
const useDropdown = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    return { isDropdownVisible, toggleDropdown };
};
export default useDropdown;
