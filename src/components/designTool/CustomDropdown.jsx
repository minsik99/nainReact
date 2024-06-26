import React, { useState} from 'react';
import styles from '../../styles/common/customDropdown.module.css';
import useClickOutside from '../hook/useClickOutside';

const CustomDropdown = ({ columns=[], onSelect, Header, dropdownWidth}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleDropdown = () => {
        setIsOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    const wrapperRef = useClickOutside(closeDropdown);
    const defaultHeader = Header || (columns.length > 0 ? '(선택)' : '');

    const handleItemClick = (item) => {
        setSelectedItem(item);
        onSelect(item);
        setIsOpen(false);
    };

    return (
            <div className={`${styles.dropdownContainer} ${dropdownWidth ? styles.customWidth : ''}`} ref={wrapperRef}
            style={dropdownWidth ? { '--dropdown-width': dropdownWidth } : {}}>
                <div  className={`${styles.dropdownHeader} ${dropdownWidth ? styles.customWidth : ''}`}
                onClick={toggleDropdown}>
                    {selectedItem ? selectedItem.Header : defaultHeader}
                </div>
                {isOpen && (
                <ul className={`${styles.dropdownList} ${isOpen ? styles.open : ''}`}
                >
                    {columns
                    .map((item) => (
                        <li
                            key={item.id}
                            className={styles.dropdownItem}
                            onClick={() => handleItemClick(item)}>
                            {item.Header}
                        </li>
                    ))}
                </ul>
                )}
            </div>
    );
};

export default CustomDropdown;
