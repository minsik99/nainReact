import React, {useRef, useState, useEffect, useContext, useCallback} from 'react';
import styles from '../../styles/interview/interviewListComponent.module.css';
import InterviewCard from './InterviewCard';
import { getInterviewList, getInterview } from '../../api/interview/interview';
import useInfiniteScroll from '../hook/useInfiniteScroll';
import InterviewResultComponent from './InterviewResult';
import useDropdown from '../../components/hook/useDropdown';
import CustomDropdown from '../../components/designTool/CustomDropdown';
import useClickOutside from '../hook/useClickOutside';


const InterviewListComponent = ({ memberNo, sortKey, setSortKey, selectedButton, handleSelected, sort}) => {
    const containerRef = useRef(null);
    const [interviewList, setInterviewList] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { isDropdownVisible, toggleDropdown } = useDropdown();
    const size = 3;
    const wrapperRef = useClickOutside(toggleDropdown);

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
        console.log("확인용::::", id)
        setSelectedInterview(id);
    });

    const handleSelect = (item) => {
        setSortKey(item ? item.Accessor : null);
        toggleDropdown();
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
                    <div className={styles.addBlock}><img className={styles.img} src="/image/add.png"/></div>
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
                            /> 
                        </div>
                        );
                    })}
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