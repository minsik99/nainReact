import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from 'next/router';

const VoiceAnswer = ({page, sentences, question, styles}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [detail, setDetail] = useState(null);

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

