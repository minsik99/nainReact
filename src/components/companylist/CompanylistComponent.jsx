import axios from "axios";
import React, { useRef, useEffect, useState } from 'react';
import { useMutation } from "react-query";
import './companylist.module.css';
import RadiusButton from "../designTool/RadiusButton";

const CompanylistComponent = () => {
    const [keyword, setKeyword] = useState('');
    const searchOn = useRef(null);

    const mutation = useMutation(newKeyword => {
        return axios.post("http://127.0.0.1:8080/companylistsearch", { keyword: newKeyword });
    });
    
    const handleSubmit = (event) => {
        event.preventDefault();
        mutation.mutate(keyword);
    };

    const handleArticleClick = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="company-container">
            <h2 className="title">기업 공고 리스트</h2>
            <div class="search-container">
                <form onSubmit={handleSubmit} className="search-form">
                    <input 
                        type="text" 
                        value={keyword} 
                        onChange={(e) => setKeyword(e.target.value)} 
                        ref={searchOn} 
                        className="search-input"
                    /> 
                     <RadiusButton
                        color="#77AAAD"
                        text="검색"
                        padding="0.5rem 1rem"
                        fontSize="14px"
                    />
                    
                </form>
            </div>

           

            {mutation.isLoading && <p>Loading...</p>}
            {mutation.isError && <p>Error occurred: {mutation.error.message}</p>}
            {mutation.isSuccess && mutation.data && mutation.data.data && (
            <div className="results-container">
            <table className="results-table">
                <thead className="results-header">
                    <tr>
                        <th className="col-number">글 번호</th>
                        <th className="col-title">공고 명</th>
                        <th className="col-company">기업명</th>
                        <th className="col-date">등록일</th>
                    </tr>
                </thead>
                <tbody>
                    {mutation.data.data.map((article, index) => (
                        <tr key={index} className="result-row" onClick={() => handleArticleClick(article.link)}>
                            <td className="col">{index + 1}</td>
                            <td className="col">{article.title}</td>
                            <td className="col">{article.company}</td>
                            <td className="col">{article.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        )}
    </div>
);
};

export default CompanylistComponent;
