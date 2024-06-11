import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const SearchComponent = () => {
    const [articles, setArticles] = useState([]);
    const [keyword, setKeyword] = useState("");


    const router = useRouter();
    const searchData = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8080/data', 
                { keyword },
                );
            setArticles(response.data);
        } catch (err) {
            console.error("Error searching data from server: ", err);
        }
    };

    const onInputChange = (event) => {
        setKeyword(event.target.value);
    }

    const onTest = () => {
        router.push("/interview");
    }

    const onTestTwo = () => {
        router.push("/interview")
    }

    const onSearch = (event) => {
        event.preventDefault();
        searchData();
    }

    return (
        <>
            <h1>네이버 IT 기사</h1>
            <form onSubmit={onSearch}>
                <input value={keyword} onChange={onInputChange} />
                <button type="submit" className="search-button">
                    검색
                </button>
            </form>
            <ul className="article-list">
                {articles.map((article, index) => (
                    <li key={index} className="article-item">
                        <a href={article.link} target="_blank" rel="noreferrer" className="article-link">
                            <div className="image-container">
                                <img src={article.image} alt="image" className="article-image" />
                            </div>
                            <div className="article-info">
                                <h3 className="article-title">{article.title}</h3>
                                <p className="article-content">내용: {article.content}</p>
                                <p className="article-time">시간: {article.time}</p>
                                <p className="article-source">출처: {article.source}</p>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            {/* <form onSubmit={onTest}> */}
                <button type="submit" onClick={onTestTwo} className="search-button">
                    영상보기
                </button>
            {/* </form> */}
        </>
    );
};

export default SearchComponent;
