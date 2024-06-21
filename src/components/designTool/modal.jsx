import React from "react";
import styles from "./Modal.module.css";

function Modal({
  isOpen,
  onClose,
  content,
  buttonLabel,
  buttonColor,
  buttonSize,
  modalSize,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div
        className={styles.modal}
        style={{ width: modalSize.width, height: modalSize.height }}
      >
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.modalContent}>{content}</div>
        <button
          className={styles.modalActionButton}
          onClick={onClose}
          style={{ backgroundColor: buttonColor, fontSize: buttonSize }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default Modal;
