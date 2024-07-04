import React, { useEffect, useState } from "react";
import {getArecord } from '../../api/interview/voice';

const VoiceAnswer = ({page, qList, styles}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [detail, setDetail] = useState(null);
    const [question, setQuestion] = useState('');
    const [sentences, setSentences] = useState([]);
    const [voiceNo, setVoiceNo] = useState('');
    
    useEffect(() => {
        if(qList.length > 0){
        setQuestion(qList[page].qcontent);
        setVoiceNo(qList[page].voiceNo);
        console.log("qList : ", qList[page].qcontent);
        console.log("voiceNo : ", qList[page].voiceNo);
        }
    }, [qList, page])


    useEffect(() => {
        console.log("선택여부");
        if (voiceNo !== '') {
            getArecord(voiceNo).then(res => {
                setSentences(res || []);
                console.log("답변 : ", res);
            }).catch(error => {
                console.log("질문 가져오지 못함", error);
            });
        }
    }, [voiceNo]);

    useEffect(() => {
        setDetail(null);
        setIsClicked(false);
    }, [sentences]);

    const detailHandler = (voiceSentence) => {
        setIsClicked(true);
        setDetail(voiceSentence);
        console.log("뜨고있는지")
    };

    const answers = sentences.map((voiceSentence) => {
        if(voiceSentence.negative >= 60){
            return(
                <div key={voiceSentence.vsNo}>
                    <div>
                    <a className={styles.negative} onClick={() => detailHandler(voiceSentence)}>{voiceSentence.sentence}</a>
                    </div>
                </div>)
        }else if(voiceSentence.positive >= 60){
            return(
                <div key={voiceSentence.vsNo}>
                    <div>
                    <a className={styles.positive} onClick={() => detailHandler(voiceSentence)}>{voiceSentence.sentence}</a>
                    </div>
                </div>)
        }else{
            return(<div>{voiceSentence.sentence}</div>)
        }
    });


    return(
        <>
            <div className={styles.questionContainer}>Q{page+1}. {question}</div>
            <div className={styles.sentences}>
                <p>답변</p>
                {answers}
            </div>
                {isClicked && detail?
                    <div className={styles.resultContainer}>
                        {detail.sentence}
                        <div className={styles.resultRight}>
                            <img className={styles.seperate} src="/image/startBar.png"/>
                            <div>
                                <div>긍정 수치 : {detail.positive}%</div>
                                <div>부정 수치 : {detail.negative}%</div>
                                <div>중립 수치 : {100 - detail.positive - detail.negative}%</div>
                            </div>
                        </div>
                    </div>
                :   <div className={styles.resultContainer}>표시할 내용이 없습니다.<br/>문장을 선택해주세요.</div>
                }
        </>
    );
};

export default VoiceAnswer;

