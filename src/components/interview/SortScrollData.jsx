import { useEffect } from "react";
import axios from "axios";

const SortScrollData = ({
    memberNo,
    page,
    size,
    setInterviewList,
    setHasMore
}) => {
    useEffect(() => {
        if (memberNo !== null) {
            const fetchInterviews = async () => {
                try {
                    const response = await axios.get(`/interview`, {
                        params: { 
                            page: page, 
                            size: size, 
                            memberNo: memberNo 
                        }
                    });
                    const data = response.data;
                    const interviews = data.content;

                    if (interviews.length < size) {
                        setHasMore(false);
                    }

                    setInterviewList(prev => {
                        const newInterviews = interviews.filter(
                            newInterview => !prev.some(
                                existingInterview => existingInterview.itvNo === newInterview.itvNo
                            )
                        );
                        return [...prev, ...newInterviews];
                    });
                } catch (err) {
                    console.error("Error fetching interviews: ", err);
                }
            };

            fetchInterviews();
        }
    }, [page, memberNo, size, setInterviewList, setHasMore]);

    return null;
};

export default SortScrollData;
