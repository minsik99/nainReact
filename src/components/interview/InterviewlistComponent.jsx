import React, { useRef, useEffect, useState, useCallback } from 'react';
import instance from '../../api/axiosApi'
import { useMutation } from 'react-query';


const InterviewlistComponent = () => {
    const [interviewlist, setInterviewlist] = useState([]);
    const [ivtNo, setIvtNo] = useState('');
    /* 인터뷰 버튼이 눌리지 않았을 때 */
    const [isChecked, setIsChecked] = useState(false);

    // const mutation = useMutation(ivtNoOne => {
    //     return axios.post("http://127.0.0.1:8080/companylistsearch", 
    // { ivtNo: ivtNoOne });
    // });

    useEffect = async () => {
        try {
            const response = await instance.get('/interviewlist');
            setInterviewlist(response.data);
        } catch (err) {
            console.error("Error sending frame to server: ", err);
        }
        
    }

    // const handleOpen = useCallback((value)=>{
    //     setIsOpen(value);
    // },[])

    // const handleOpenChang = useCallback(()=>{
    //     setIsOpen(value => !value)
    // },[])

    return (
        <>
        <div className={styles.interviewContainer}>
            

        </div>
            
        </>
    );
}

{/* <div onClick={()=>{handleOpen(true)}}>
                // 핸들러 혹은 함수에 파라메터를 전해줘야 할때 
            </div>
            <div onClick={handleOpen}>
                // onClick={e =>{handleOpen(e)}}
                // 핸들러 혹은 함수에 event 값이 자동으로 전달될때 
            </div> */}