import { useState } from 'react';

export const useModal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsOpened(true);
  };

  const closeModal = () => {
    setIsOpened(false);
    setModalData(null);
  };

  return { isOpened, modalData, openModal, closeModal };
};
