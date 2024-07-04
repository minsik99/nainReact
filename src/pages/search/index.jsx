import React from "react";
import { observer } from "mobx-react";
import ArticleComponent from "../../components/search/ArticleComponent";
import styles from "../../styles/search/index.module.css";

const SearchComponent = observer(() => {
    return (
        <div className={styles.searchContainer}>
            <ArticleComponent />
        </div>
    );
});

export default SearchComponent;
