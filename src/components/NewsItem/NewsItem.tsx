import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./NewsItem.module.css";

interface Item {
  title: string;
  score: number;
  by: string;
  url: string;
  kids?: number[];
}

type Params = Record<string, string>;

interface Props {
  onAddToFavorites: (id: number) => void;
  onRemoveFromFavorites: (id: number) => void;
}

const NewsItem: React.FC<Props> = ({
  onAddToFavorites,
  onRemoveFromFavorites,
}) => {
  const [item, setItem] = useState<Item>({} as Item);
  const { id } = useParams<Params>();

  useEffect(() => {
    const fetchData = async () => {
      const itemResult = await axios.get<Item>(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      setItem(itemResult.data);
    };
    fetchData();
  }, [id]);

  const handleAddToFavorites = () => {
    onAddToFavorites(Number(id));
  };

  const handleRemoveFromFavorites = () => {
    onRemoveFromFavorites(Number(id));
  };

  return (
    <div className={styles.newsItem}>
      <h2>{item.title}</h2>
      <p>
        {item.score} points by {item.by}
      </p>
      <a href={item.url}>{item.url}</a>
      <ul>
        {item.kids &&
          item.kids.map((kidId) => (
            <li key={kidId}>
              <a href={`https://news.ycombinator.com/item?id=${kidId}`}>
                Comment {kidId}
              </a>
            </li>
          ))}
      </ul>
      <button onClick={handleAddToFavorites}>Add to favorites</button>
      <button onClick={handleRemoveFromFavorites}>Remove from favorites</button>
    </div>
  );
};

export default NewsItem;
