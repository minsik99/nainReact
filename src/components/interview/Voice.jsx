import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from 'next/router';
import {getQrecord } from '../../api/interview/voice';
import styles from '../../styles/interview/voice.module.css'
import VoiceAnswer from './VoiceAnswer';

const Voice = observer(({itvNo}) => {
    const router = useRouter();
    const [selectedItvNo, setSelectedItvNo] = useState(itvNo);
    const [qList, setQList] = useState([]);
    const [qCount, setQCount] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        setSelectedItvNo(itvNo);
    }, [itvNo]);

    useEffect(() => {
        if (selectedItvNo !== null) {
            getQrecord(selectedItvNo).then(res => {
                setQCount(res.length > 0 ?  res.length : 0);
                setQList(res);
                setPage(0);
                console.log("res : ", res[page].qcontent, " 질문 길이 : ", res.length);
            }).catch(error => {
                console.log("질문 가져오지 못함", error);
            });
        }
    }, [selectedItvNo])


    useEffect(() => {
        console.log("qList : ", qList);
    }, [qList])

    const pageLower = () => {
        setPage(page-1);
    }

    const pageUpper = () => {
        setPage(page+1);
    }

    return(
        <div className={styles.base}>
            {page == 0 ? <img className={styles.startBar} src="/image/startBar.png"/>
            : <img className={styles.arrow} src="/image/leftArrow.png" onClick={pageLower}/>}
            <div className={styles.contentContainer}>
                <VoiceAnswer page={page} qList={qList} styles={styles}/>
            </div>
            {page < qCount - 1?<img className={styles.arrow} src="/image/rightArrow.png" onClick={pageUpper}/>
            :  <img className={styles.startBar} src="/image/startBar.png"/>}
        </div>
    );
});

export default Voice;