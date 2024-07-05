import React, {useState, useEffect} from "react";
import { observer } from "mobx-react";
import InterviewListComponent from "../../components/interview/InterviewlistComponent";
import styles from '../../styles/interview/interviewComponent.module.css';
import PathText from "../../components/interview/PathText";
import { useRouter } from "next/router";
import { authStore } from "../../stores/authStore";

const InterviewListForm = observer(()=>{
    const [memberNo, setMemberNo] = useState(null);
    const [selectedButton, setSelectedButton] = useState('voice');
    const [sortKey, setSortKey] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const memberNo = window.localStorage.getItem("memberNo");
            setMemberNo(memberNo);
            if(memberNo){            
                if (!authStore.isSubscribe) {
                    console.log("구독여부", authStore.isSubscribe);
                    alert(authStore.isSubscribe)
                    alert("구독이 필요한 서비스입니다.");
                    router.push('/payment');
                }
            }else{
                if(confirm("로그인이 필요합니다. 이동하시겠습니까?")){
                    router.push("/member/login");
                  }else{
                    router.push("/main")
                  }
            }
        }
    }, [authStore.isSubscribe]);
    
    const paths = [
        { name: '메인', link: '/' },
        { name: 'AI 면접', link: '/interview' },
        { name: 'AI history', link: '/interview/test' }
    ];

    const sort = [
        { Header: '타이틀순', Accessor: 'title' },
        { Header: '최신순', Accessor: 'itvDateInfo' }
    ];

    const handleSelected = (button) => {
        setSelectedButton(button);
    };

    return (
        <div className={styles.base}>
            <div className={styles.path}> <PathText paths={paths} /></div>
            <InterviewListComponent  memberNo={memberNo} selectedButton={selectedButton}
                    handleSelected={handleSelected} sortKey={sortKey} sort={sort} setSortKey={setSortKey}/>
        </div>
        
    )
})

export default InterviewListForm;