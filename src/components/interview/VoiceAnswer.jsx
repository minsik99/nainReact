import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from 'next/router';

const VoiceAnswer = ({sentences, question, styles}) => {
    const [isClicked, setIsClicked] = useState(false);
    const [detail, setDetail] = useState(null);

    const detailHandler = (voiceSentence) => {
        setIsClicked(!isClicked);
        setDetail(voiceSentence);
        console.log("뜨고있는지")
    };

    const answers = sentences.map((voiceSentence) => {
        if(voiceSentence.positive >= 0.6){
            return(
            <div key={voiceSentence.vsNo}>
                <div>
                <a className={styles.positive} onClick={() => detailHandler(voiceSentence)}>{voiceSentence.sentence}</a>
                </div>
            </div>)
        }else if(voiceSentence.negative >= 0.6){
            return(<a>{voiceSentence.sentence}</a>)
        }else{
            return(<div>{voiceSentence.sentence}</div>)
        }
    });


    return(
        <div>
            <div className={styles.resultContainer}>Q. {question}</div>
            <div className={styles.sentences}>{answers}</div>
                {isClicked &&
                <div>
                    <div>{detail.sentence}</div>
                    <div>{detail.positive}</div>
                    <div>{detail.negative}</div>
                </div>}
        </div>
    );
};

export default VoiceAnswer;

