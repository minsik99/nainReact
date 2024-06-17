import axios from "axios";
import React, {useRef ,useEffect, useState } from 'react';
import { useMutation } from "react-query";
import styles from './companylist.module.css';
import Table from "./Table";
import SearchBar from "./SearchBar";

const CompanylistComponent = () => {
    const [keyword, setKeyword] = useState('');
    const [sortKey, setSortKey] = useState('title');
    const inputRef = useRef(null);
    const [issearchOn, setIsSearchOn] = useState(false);

    useEffect(() => {
        const init = 'ai';
        setKeyword(init);
        setIsSearchOn(true);
      },[]);

    useEffect(() => {
    if (keyword) {
        handleSubmit();
        setKeyword('');
    }
    }, [keyword]);

    const mutation = useMutation(newKeyword => {
        return axios.post("http://127.0.0.1:8080/companylistsearch", { keyword: newKeyword });
    });

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        if(keyword)  {
            mutation.mutate(keyword);
        } else {
            alert('검색어를 입력해주세요');
        }
        //검색어 없음 띄우기
    };
    const visible = [1, 2];

    const columns = [{ header: '글번호', accessor: 'index' },
        { header: '공고명', accessor: 'title' },
        { header: '회사명', accessor: 'company' },
        { header: '등록일', accessor: 'time' }
        ];

    const handleArticleClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className={styles.companyContainer}>
            <h2 className={styles.title}>기업 공고 리스트</h2>
                { issearchOn && (
                <SearchBar
                    columns={columns}
                    sortKey={sortKey}
                    setSortKey={setSortKey}
                    handleSubmit={handleSubmit}
                    keyword={keyword}
                    visible={visible}
                    setKeyword={setKeyword}
                    searchOn={inputRef}
                />)}
            
            {mutation.isLoading && <p>Loading...</p>}
            {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
            {mutation.isSuccess && mutation.data && mutation.data.data && (
                <Table
                    columns={columns}
                    sortKey={sortKey}
                    setSortKey={setSortKey}
                    handleSubmit={handleSubmit}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    data={mutation.data.data}
                />
        )}
    </div>
);
};

export default CompanylistComponent;
