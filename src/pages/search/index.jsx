import React from "react";
import { observer } from "mobx-react";
import ArticleComponent from "../../components/search/ArticleComponent";

const searchComponent = observer(()=>{
    return (
        <div>
            <ArticleComponent />
        </div>
    )
})

export default searchComponent;