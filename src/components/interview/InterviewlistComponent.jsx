import React, { useRef, useState, useEffect} from 'react';
import instance from '../../api/axiosApi'
import { useMutation } from 'react-query';
import styles from './interviewListComponent.module.css';
import InterviewCard from './InterviewCard';

const InterviewListComponent = () => {
    const [interviewlist, setInterviewlist] = useState([]);
    const [ivtNo, setIvtNo] = useState('');
    const [count, setCount] = useState(1);

    

    useEffect(async () => {
        try {
            const response = await instance.get('/interviewlist');
            setInterviewlist(response.data);
        } catch (err) {
            console.error("Error sending frame to server: ", err);
        }
        
    });

    // const handleOpen = useCallback((value)=>{
    //     setIsOpen(value);
    // },[])

    // const handleOpenChang = useCallback(()=>{
    //     setIsOpen(value => !value)
    // },[])

    // const mutation = useMutation(ivtNoOne => {
    //     return axios.post("http://127.0.0.1:8080/companylistsearch", 
    // { ivtNo: ivtNoOne });
    // });

    const mutation = useMutation(listFour => {
            return instance.post("/interviewlist", 
        { ivtNo: ivtNoOne });
        });
    const initialInterviews = [mutation.data]

    const loadMore = () => {
        const [interviews, setInterviews] = useState(initialInterviews);
        const [count, setCount] = useState(1);

        const newInterviews = [
            
        ];
        setInterviews([...interviews, ...newInterviews]);
        setCount(count + 1);
    };

    return (
        <>
            <div className={styles.interviewContainer}>
                <h2>AI 면접 분석 History</h2>
                <div className={styles.cardContainer}>
                    <img src="../public/image/add.png"/>
                    {interviewlist.map(interview => (
                        <InterviewCard 
                            key={interview.id} 
                            title={interview.title} 
                            description={interview.description} 
                        />
                    ))}
                </div>
                <button onClick={loadMore} className={styles.loadMoreButton}>더 보기</button>
            </div>
        </>
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