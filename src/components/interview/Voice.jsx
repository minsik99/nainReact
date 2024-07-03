import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from 'next/router';
import {getRecord} from '../../api/interview/voice';
import styles from '../../styles/interview/voice.module.css'
import VoiceAnswer from './VoiceAnswer';

const Voice = observer(({itvNo}) => {
    const router = useRouter();
    const [selectedItvNo, setSelectedItvNo] = useState(null);
    const [sentences, setSentences] = useState([]);
    const [question, setQuestion] = useState('');
    const [qCount, setQCount] = useState('');
    const [page, setPage] = useState(0);

    useEffect(() => {
        setSelectedItvNo(itvNo);
        setPage(0);
    }, [itvNo]);

    useEffect(() => {
        console.log("선택여부");
        if (selectedItvNo !== null) {
            getRecord(selectedItvNo).then(res => {
                setQCount(res.qnaList.length);
                console.log("history : ", res.qnaList);
                setSentences(res.answerList[page] || []);
                if (res.qnaList.length > 0 && res.qnaList[page].qcontent) {
                    setQuestion(res.qnaList[page].qcontent);
                    console.log("질문 : ", res.qnaList[page].qcontent);
                    console.log("답변 : ", res.answerList[page]);
                    console.log("page : ", page, " 질문 길이 : ", qCount);
                }
            }).catch(error => {
                console.log("질문 가져오지 못함", error);
            });
        }
    }, [selectedItvNo, page]);

   
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
                <VoiceAnswer page={page} sentences={sentences} question={question} styles={styles}/>
            </div>
            {page == qCount - 1? <img className={styles.startBar} src="/image/startBar.png"/>
            : <img className={styles.arrow} src="/image/rightArrow.png" onClick={pageUpper}/>}
        </div>
    );

});

export default Voice;