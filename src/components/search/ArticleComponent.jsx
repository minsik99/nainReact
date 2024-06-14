import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";
import styles from "../../styles/search/article.module.css";

const ArticleComponent = () => {
  const [articles, setArticles] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();

  const router = useRouter();

  const searchData = async (reset = false) => {
    if (keyword === "") return;

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

  const onRouteChat = () => {
    router.push('/chat');
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
      <button onClick={onRouteChat}>채팅하기</button>
      <form onSubmit={onSearch}>
        <input value={keyword} onChange={onInputChange} /> &nbsp;
        <button type="submit" className={styles["search-button"]}>
          검색
        </button>
      </form>
      <ul className={styles["article-list"]}>
        {articles.map((article, index) => (
          <li key={index} className={styles["article-item"]}>
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className={styles["article-link"]}
            >
              <div className={styles["image-container"]}>
                <img
                  src={article.image}
                  alt="image"
                  className={styles["article-image"]}
                />
              </div>
              <div className={styles["article-info"]}>
                <h3 className={styles["article-title"]}>{article.title}</h3>
                <p className={styles["article-content"]}>내용: {article.content}</p>
                <p className={styles["article-time"]}>시간: {article.time}</p>
                <p className={styles["article-source"]}>출처: {article.source}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <button className={styles["scroll-to-top"]} onClick={scrollToTop}>맨 위로</button>
      <div ref={ref}></div>
    </div>
  );
};

export default ArticleComponent;
