import React from 'react';
import useClickOutside from '../hook/useClickOutside';

const ClickOutsideHandler = ({ onClickOutside, children }) => {
    const wrapperRef = useClickOutside(onClickOutside);
    return <div ref={wrapperRef}>{children}</div>;
};

export default ClickOutsideHandler;
