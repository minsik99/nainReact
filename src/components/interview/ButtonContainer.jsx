import React from 'react';
import RadiusButton from '../designTool/RadiusButton';
import styles from '../../styles/interview/buttonContainer.module.css';

const ButtonContainer = ({ buttons, selectedButton, handleSelected }) => {
    return (
        <div className={styles.buttonContainer}>
            {buttons.map((button) => (
                <RadiusButton
                    key={button.id}
                    fontColor={selectedButton === button.id ? 'white' : '#77AAAD'}
                    color={selectedButton === button.id ? '#77AAAD' : 'white'}
                    text={button.text}
                    boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                    onClick={() => handleSelected(button.id)}
                />
            ))}
        </div>
    );
};

export default ButtonContainer;
