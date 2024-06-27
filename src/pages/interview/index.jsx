import React, {useState, useEffect} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import styles from '../../styles/interview/interviewComponent.module.css';
import PathText from "../../components/interview/PathText";

const InterviewListForm = observer(()=>{
    const [memberNo, setMemberNo] = useState(null);
    const [selectedButton, setSelectedButton] = useState('voice');
    const [sortKey, setSortKey] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            setMemberNo(memberNo);
        }
    }, []);

    const paths = [
        { name: '메인', link: '/' },
        { name: 'AI 면접', link: '/interview' },
        { name: 'AI history', link: '/interview/test' }
    ];

    const sort = [
        { Header: '타이틀순', Accessor: 'title' },
        { Header: '최신순', Accessor: 'itvDate' }
    ];

    const handleSelected = (button) => {
        setSelectedButton(button);
    };

    return (
        <div className="mapDiv">
            <div className={styles.path}> <PathText paths={paths} /></div>
            <InterviewListComponent  memberNo={memberNo} selectedButton={selectedButton}
                    handleSelected={handleSelected} sortKey={sortKey} sort={sort} setSortKey={setSortKey}/>
        </div>
        
    )
})

export default InterviewListForm;