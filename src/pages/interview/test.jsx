import React, {useCallback} from "react";
import { observer } from "mobx-react";
import { AuthProvider } from "../../api/authContext";
import InterviewComponent from "../../components/interview/InterviewComponent";

const interviewComponent = observer(()=> {
  return (
    <div className="map_div">
        <AuthProvider>
            <InterviewComponent/>
        </AuthProvider>
    </div>
)

});

export default interviewComponent;