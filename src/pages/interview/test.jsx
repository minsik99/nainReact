import React, {useCallback} from "react";
import { observer } from "mobx-react";
<<<<<<< Updated upstream
import VideoStream from "../../components/interview/VideoStream";
import Modal from "../../components/common/Modal";
import { useModal } from "../../components/hook/useModal";
import NotButtonModal from "../../components/interview/NotButtonModal";

const interviewComponent = observer(()=> {
const { isOpened, modalData, openModal, closeModal } = useModal();

 
  const handleOpenModal2 = () => {
    openModal({
      title: 'Sample Modal22',
      content: '내용 넣어보기',
      columns: [{'Header': '1'}],
      onConfirm: (selectedItem) => {
        console.log('Selected item:', selectedItem);
        closeModal();
      },
    });
  };
  return (
    <div className="map_div">
        <VideoStream />
      {/* <button onClick={handleOpenModal}>Open Modal</button> */}
      {/* <Modal type='custom' isOpened={isOpened} data={modalData} closeModal={closeModal} /> */}
      <button onClick={handleOpenModal2}>Open Modal2</button>
      <Modal type='' isOpened={isOpened} data={modalData} closeModal={closeModal} />
=======
import { AuthProvider } from "../../api/authContext";
import InterviewComponent from "../../components/interview/InterviewComponent";

const interviewComponent = observer(()=> {
  return (
    <div className="map_div">
        <AuthProvider>
            <InterviewComponent/>
        </AuthProvider>
>>>>>>> Stashed changes
    </div>
)

});

export default interviewComponent;