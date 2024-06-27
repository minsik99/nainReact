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
import { observer } from 'mobx-react';
const InterviewListComponent = observer(({ memberNo, sortKey, setSortKey, selectedButton, handleSelected, sort}) => {
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
    const categoryModal = useModal();
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
            } else if (key === 'itvDateInfo') {
                return new Date(b.itvDateInfo) - new Date(a.itvDateInfo);
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
        try {
        let title = null;
        await new Promise((resolve, reject) => {
            titleModal.openModal({
                title: '타이틀을 입력해주세요.',
                columns: selectedInterview,
                onConfirm: (inputTitle) => {
                    title = inputTitle;
                    titleModal.closeModal();
                    resolve();
                },
                onCancel: () => {
                    titleModal.closeModal();
                    reject(new Error('타이틀 입력이 취소되었습니다.'));
                },
            });
        })
        await new Promise((resolve, reject) => {
            categoryModal.openModal({
                title: '카테고리를 선택해주세요.',
                content: '직무',
                columns: [
                    { 'Header': '웹개발' },
                    { 'Header': '엔지니어' },
                    { 'Header': '프론트엔드' },
                    { 'Header': '데브옵스' },
                    { 'Header': '프로덕트매니저' },
                    { 'Header': '빅데이터' },
                    { 'Header': '백엔드' },
                    { 'Header': '앱개발' }
                ],
                onConfirm: async (selectedItem) => {
                    let res = null;
                    try {
                        const info = selectedItem['Header']
                        res = await addInterview(memberNo, title, info);
                        console.log(res);
                        resolve();
                    } catch (error) {
                        console.error("면접 추가 실패", error);
                        reject(error);
                    } finally {
                        if(res && res.data) {
                            try {
                                await router.push({
                                    pathname: "/interview/test",
                                    query: {
                                        itvNo: res.data.ivtNo,
                                        question: res.data.question,
                                        memberNo: memberNo
                                    }
                                });
                                console.log('페이지 이동 성공');
                            } catch (pushError) {
                                console.error('페이지 이동 실패', pushError);
                            } finally {
                                categoryModal.closeModal();
                            }
                        } else {
                            console.error("응답 데이터가 없습니다.");
                        }
                    }
                },
                onCancel: () => {
                    categoryModal.closeModal();
                    reject(new Error('카테고리 선택이 취소되었습니다.'));
                }
            });
        });
    } catch (error) {
        console.error('면접 시작 중 오류 발생:', error);
    }
};

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
                    <Modal isOpened={titleModal.isOpened} type='' closeModal={titleModal.closeModal} data={titleModal.modalData} />
                    <Modal isOpened={categoryModal.isOpened} type='custom' closeModal={categoryModal.closeModal} data={categoryModal.modalData} />
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
                                description={interview.itvDateInfo}
                                onSelect={handleSelectInterview}
                                isSelected={selectedInterview === interview.itvNo}
                                deleteInterviewOne={handleOpenModal}
                            /> 
                            
                        </div>
                        );
                    })}
                    <Modal isOpened={deleteModal.isOpened} type='default' closeModal={deleteModal.closeModal} data={deleteModal.modalData} />
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
});

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