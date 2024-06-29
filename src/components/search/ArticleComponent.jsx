import React, { useEffect, useState } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";
import styles from "../../styles/search/article.module.css";
import Loading from "../designTool/Loading";

const ArticleComponent = () => {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const searchData = async (reset = false) => {
    if (keyword === "") return;

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8080/data", {
        keyword,
        page_number: reset ? 1 : page,
        page_size: 10,
      });
      if (reset) {
        setArticles(response.data);
        setPage(2);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...response.data]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.error("Error searching data from server: ", err);
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setPage(1);
    searchData(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    if (inView) {
      searchData();
    }
  }, [inView]);

  return (
    <div className={styles.container}>
      <h1>네이버 IT 기사</h1>
      <form onSubmit={onSearch} className={styles.searchForm}>
        <input value={keyword} onChange={onInputChange} className={styles.searchInput} placeholder="검색어를 입력하세요" />
        <button type="submit" className={styles.searchButton}>
          검색
        </button>
      </form>
      <ul className={styles.articleList}>
        {articles.map((article, index) => (
          <li key={index} className={styles.articleItem}>
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className={styles.articleLink}
            >
              <div className={styles.imageContainer}>
                <img
                  src={article.image}
                  alt="image"
                  className={styles.articleImage}
                />
              </div>
              <div className={styles.articleInfo}>
                <h3 className={styles.articleTitle}>{article.title}</h3>
                <p className={styles.articleContent}>내용: {article.content}</p>
                <p className={styles.articleTime}>시간: {article.time}</p>
                <p className={styles.articleSource}>출처: {article.source}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      {loading && <Loading loading={loading} text="로딩 중..." />}
      <button className={styles.scrollToTop} onClick={scrollToTop}>맨 위로</button>
      <div ref={ref}></div>
    </div>
  );
};

export default ArticleComponent;
