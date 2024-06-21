import React, { useCallback, useRef, useState, useEffect, useContext} from 'react';
import { useMutation } from 'react-query';
import styles from '../../styles/interview/interviewListComponent.module.css';
import InterviewCard from './InterviewCard';
import { getInterviewList, getInterview } from '../../api/interview';
import { AuthContext } from '../../api/authContext';
import CustomDropdown from '../designTool/CustomDropdown';
import RadiusButton from '../designTool/RadiusButton';
import useInfiniteScroll from '../hook/useInfiniteScroll';
import useDropdown from '../hook/useDropdown';

const InterviewListComponent = () => {
    const {memberNo} = useContext(AuthContext);
    const containerRef = useRef(null);

    const [interviewList, setInterviewList] = useState([]);
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState('');
    const [hasMore, setHasMore] = useState(true);
    
    const { isDropdownVisible, toggleDropdown } = useDropdown();
    const [isChecked, setIsChecked] = useState(false);
    const [selectedButton, setSelectedButton] = useState('voice');
 
    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    useInfiniteScroll(containerRef, loadMore, hasMore);


    const size = 3;
    const sort = [{'Header': '타이틀순', 'Accessor': 'title'},
                    {'Header': '최신순', 'Accessor': 'ivtDate'}
    ]

    const handleSelected = (button) => {
        setSelectedButton(button);
        
      };
    
    const buttons = [
    { text: 'Voice', id: 'voice' },
    { text: 'Video', id: 'video' },
    { text: 'Total', id: 'total' }
    ];

    const handleSelect = (item) => {
        setSortKey(item ? item.Accessor : null);
        setPage(0);
        setInterviewList([]);
        setHasMore(true);
        if (isDropdownVisible) {
            toggleDropdown();
        }
    };

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

    useEffect(() => {
        if (memberNo !== null) {
            const fetchInterviews = async () => {
                try {
                    const data = await getInterviewList(page, size, memberNo);
                    const interviews = data.content;
                    if (interviews.size < size) {
                        setHasMore(false);
                    }
                    setInterviewList(prev => {
                        const newInterviews = interviews.filter(
                            newInterview => !prev.some(
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


    //얘는 컴포넌트로 뺄예정
    const mutation = useMutation((ivtNoOne) => getInterview(ivtNoOne));

    return (
            <div className={styles.interviewContainer}>
                <div className={styles.listContainer}>
            
                <img src="/image/sortMenu.png" onClick={toggleDropdown} className={styles.sortMenu} />
                    {isDropdownVisible && (
                        <div className={styles.dropdownBox}>
                        <CustomDropdown columns={sort} onSelect={handleSelect} 
                        header={sort.header} dropdownWidth="110px"/>
                        </div>
                    )}
                    <h2 className={styles.title}>AI 면접 분석 History</h2>
                    <div className={styles.cardContainer} ref={containerRef}>
                        <InterviewCard className={styles.blank} title={<img className={styles.img} src="/image/add.png"/>} />
                        {interviewList.map(interview => (
                            <div className={styles.cardBox} key={interview.ivtNo}>
                                <InterviewCard 
                                    title={interview.title}
                                    description={interview.itvDate}
                                    onSelect={handleSelect}
                                />  
                            </div>
                        ))}
                   <div className={styles.buttonBox}>
                        {hasMore && (
                        <img onClick={loadMore} src="/image/arrowbutton.png" className={styles.icon} />
                        ) }
                    </div>
                </div>
                </div>
                <div className={styles.graphContainer}>
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
                    <div className={styles.graphBox}>
                        <div>

                        </div>
                        <div>
                            
                        </div>
                        <div>
                            
                        </div>
                        <div>
                            
                        </div>

                    </div>
                </div>
            </div>
       
    );

}

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

// const mutation = useMutation(ivtNoOne => {
//     return axios.post("http://127.0.0.1:8080/companylistsearch", 
// { ivtNo: ivtNoOne });
// });}
*/}