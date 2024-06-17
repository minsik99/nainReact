import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDropdown.module.css';

const CustomDropdown = ({columns, value, onChange, visible }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (value) => {
        onChange(value);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const options = columns
        .filter((_, index) => visible.includes(index))
        .map(column => ({
            value: column.accessor,
            label: column.header,
        }));

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    

    const selectedOption = options.find(option => option.value === value);

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <div className={styles.dropdownHeader} onClick={handleToggleDropdown}>
                {selectedOption ? selectedOption.label : '선택하세요'}
            </div>
            <div className={`${styles.dropdownList} ${isOpen ? styles.open : ''}`}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={styles.dropdownItem}
                        onClick={() => handleOptionClick(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomDropdown;
