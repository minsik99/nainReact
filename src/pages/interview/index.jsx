import React, {useState} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import styles from '../../styles/interview/interviewComponent.module.css';
import PathText from "../../components/interview/PathText";
import { authStore } from "../../stores/authStore";
const InterviewListForm = observer(()=>{
    // const memberNo = authStore.memberNo;
    const memberNo = authStore.memberNo;
    const [selectedButton, setSelectedButton] = useState('voice');
    const [sortKey, setSortKey] = useState('');

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