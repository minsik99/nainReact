import React, {useRef, useState, useEffect, useCallback} from 'react';
import styles from '../../styles/interview/interviewListComponent.module.css';
import InterviewCard from './InterviewCard';
import { getInterviewList, deleteInterview, addInterview } from '../../api/interview/interview';
import useInfiniteScroll from '../hook/useInfiniteScroll';
import InterviewResultComponent from './InterviewResult';
import useDropdown from '../../components/hook/useDropdown';
import CustomDropdown from '../../components/designTool/CustomDropdown';
import useClickOutside from '../hook/useClickOutside';
import { useRouter } from 'next/router';
import { useModal } from '../hook/useModal';
import Modal from '../common/Modal';


const InterviewListComponent = ({ memberNo, sortKey, setSortKey, selectedButton, handleSelected, sort}) => {
    const router = useRouter();
    const containerRef = useRef(null);
    const [interviewList, setInterviewList] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { isDropdownVisible, toggleDropdown } = useDropdown();
    const size = 3;
    const wrapperRef = useClickOutside(toggleDropdown);
    const deleteModal = useModal();
    const titleModal = useModal();
    const buttons = [
        { text: 'Voice', id: 'voice' },
        { text: 'Video', id: 'video' },
        { text: 'Total', id: 'total' }
    ];

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    useInfiniteScroll(containerRef, loadMore, hasMore);

    const sortData = (data, key) => {
        return [...data].sort((a, b) => {
            if (key === 'title') {
                return a.title.localeCompare(b.title);
            } else if (key === 'itvDate') {
                return new Date(b.itvDate) - new Date(a.itvDate);
            }
            return data;
        });
    };

    const handleSelectInterview = useCallback((id) => {
        setSelectedInterview(id);
    });

    const handleSelect = (item) => {
        setSortKey(item ? item.Accessor : null);
        toggleDropdown();
    };
    
    const startInterview = async () => {
        titleModal.openModal({
            title: '타이틀을 입력해주세요.',
            columns: selectedInterview,           
            onConfirm: async (title) => {
              try {
                const res = await addInterview(memberNo, title);
                router.push({pathname:"/interview/test",
                    query: {itvNo: res.itvNo,
                        memberNo: memberNo
                    }
                });
              } catch (error) {
                console.error("면접 추가 실패", error);
              } finally {
                titleModal.closeModal();
              }
          },
      }); 
        
    }
    
    const handleOpenModal = () => {
        deleteModal.openModal({
          title: '    ',
          content: '삭제하시겠습니까?',
          columns: selectedInterview,
          onConfirm: (selectedInterview) => {
            try {
                console.log(selectedInterview);
               deleteInterview(selectedInterview);
            } catch (error) {
              console.error("면접 삭제 실패", error);
            } finally {
              deleteModal.closeModal();
            }
        },
    }); 
    };
      
    useEffect(() => {
        if (memberNo !== null) {
            const fetchInterviews = async () => {
                try {
                    const data = await getInterviewList(page, size, memberNo);
                    const interviews = data.content;

                    if (interviews.length < size) {
                        setHasMore(false);
                    }

                    setInterviewList(prev => {
                        const newInterviews = interviews.filter(
                            newInterview => newInterview.itvNo && !prev.some(
                                existingInterview => existingInterview.itvNo === newInterview.itvNo
                            )
                        );
                        const updatedList = [...prev, ...newInterviews];
                        return sortKey ? sortData(updatedList, sortKey) : updatedList;
                    });
                } catch (err) {
                    console.error("Error fetching interviews: ", err);
                }
            };

            fetchInterviews();
        }
    }, [page, memberNo, sortKey]);

    return (    
        <div className={styles.interviewListContainer}>  
            <div className={styles.listContainer}>
                <div className={styles.menuContainer} >
                    <img src="/image/sortMenu.png" onClick={toggleDropdown} className={styles.sortMenu} />
                        {isDropdownVisible && (
                            <div className={styles.dropdownBox} ref={wrapperRef}>
                                <CustomDropdown columns={sort} onSelect={handleSelect} 
                                header={sort.header} dropdownWidth="110px"/>
                                </div>
                        )}
                </div>
                <h2 className={styles.title}>AI 면접 분석 History</h2>
                <div className={styles.cardContainer} ref={containerRef}>
                    <div className={styles.addBlock}><img className={styles.img} onClick={startInterview} src="/image/add.png"/></div>
                    {interviewList.map(interview => {
                        if (!interview.itvNo) {
                            console.error('itvNo is undefined for interview:', interview);
                            return null;
                        }
                        return (
                            <div key={interview.itvNo} className={styles.cardBox}>
                            <InterviewCard 
                                key={interview.itvNo}
                                id={interview.itvNo}
                                title={interview.title}
                                description={interview.itvDate}
                                onSelect={handleSelectInterview}
                                isSelected={selectedInterview === interview.itvNo}
                                deleteInterviewOne={handleOpenModal}
                            /> 
                            
                        </div>
                        );
                    })}
                    <Modal isOpened={deleteModal.isOpened} type='default' closeModal={deleteModal.closeModal} data={deleteModal.modalData} />
                    <Modal isOpened={titleModal.isOpened} type='' closeModal={titleModal.closeModal} data={titleModal.modalData} />
                    <div className={styles.buttonBox}>
                        {hasMore && (
                        <img onClick={loadMore} src="/image/arrowbutton.png" className={styles.icon} />
                        ) }
                    </div>
                </div>
            </div>
                <div className={styles.resultContainer}>
                <InterviewResultComponent memberNo={memberNo} buttons={buttons} selectedButton={selectedButton} handleSelected={handleSelected} itvNo={selectedInterview} />
                </div>
            </div>
    );
};

export default InterviewListComponent;

{/* <div onClick={()=>{handleOpen(true)}}>
                // 핸들러 혹은 함수에 파라메터를 전해줘야 할때 
            </div>
            <div onClick={handleOpen}>
                // onClick={e =>{handleOpen(e)}}
                // 핸들러 혹은 함수에 event 값이 자동으로 전달될때 
            </div> */}

{/* const handleOpen = useCallback((value)=>{
//     setIsOpen(value);
// },[])

const handleOpenChang = useCallback(()=>{
//     setIsOpen(value => !value)
// },[])

// const mutation = useMutation(itvNoOne => {
//     return axios.post("http://127.0.0.1:8080/companylistsearch", 
// { itvNo: itvNoOne });
// });}
*/}