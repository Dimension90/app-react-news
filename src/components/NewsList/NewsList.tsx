import React, { FC, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./NewsList.module.css";
import NewsItemProps from "../../NewsItemProps";

interface Props {
  news: number[];
  onAddToFavorites: (id: number) => void;
  filter: "topstories" | "newstories" | "beststories" | "all";
  newsMap: { [id: number]: NewsItemProps };
}

const NewsList: FC<Props> = ({ news, onAddToFavorites, filter, newsMap }) => {
  const [displayedNews, setDisplayedNews] = useState<number[]>([]);
  const [loadMore, setLoadMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastNewsRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (filter === "all") {
      setDisplayedNews(news.slice(0, 30));
    } else {
      const filteredNews = news.filter((id) => newsMap[id].type === filter);
      setDisplayedNews(filteredNews.slice(0, 30));
    }
    setLoadMore(false);
  }, [news, filter, newsMap]);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && news.length > displayedNews.length) {
        if (filter === "all") {
          setDisplayedNews((prevNews) => [
            ...prevNews,
            ...news.slice(prevNews.length, prevNews.length + 30),
          ]);
        } else {
          const filteredNews = news.filter((id) => newsMap[id].type === filter);
          setDisplayedNews((prevNews) => [
            ...prevNews,
            ...filteredNews.slice(prevNews.length, prevNews.length + 30),
          ]);
        }
      }
    });
    if (lastNewsRef.current) {
      observer.current.observe(lastNewsRef.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [displayedNews, news, filter, newsMap]);

  const handleAddToFavorites = (id: number) => {
    onAddToFavorites(id);
  };

  return (
    <ul className={styles.newsList}>
      {displayedNews.map((itemId, index) => {
        if (displayedNews.length === index + 1) {
          return (
            <li key={itemId} ref={lastNewsRef}>
              <Link
                to={`/item/${itemId}`}
                onClick={() => handleAddToFavorites(itemId)}
              >
                {itemId}
              </Link>
            </li>
          );
        } else {
          return (
            <li key={itemId}>
              <Link
                to={`/item/${itemId}`}
                onClick={() => handleAddToFavorites(itemId)}
              >
                {itemId}
              </Link>
            </li>
          );
        }
      })}
    </ul>
  );
};

export default NewsList;
