import React, {useState} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import ButtonContainer from "../../components/interview/ButtonContainer";

const InterviewListForm = observer(()=>{
    // const memberNo = authStore.memberNo;
    const memberNo = "1";
    const [selectedButton, setSelectedButton] = useState('voice');
    const [sortKey, setSortKey] = useState('');

    const sort = [
        { Header: '타이틀순', Accessor: 'title' },
        { Header: '최신순', Accessor: 'itvDate' }
    ];

    const handleSelected = (button) => {
        setSelectedButton(button);
    };

    return (
        <div className="mapDiv">
            <InterviewListComponent  memberNo={memberNo} selectedButton={selectedButton}
                    handleSelected={handleSelected} sortKey={sortKey} sort={sort} setSortKey={setSortKey}/>
        </div>
        
    )
})

export default InterviewListForm;