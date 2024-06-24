import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import NewsList from "./components/NewsList/NewsList";
import NewsItem from "./components/NewsItem/NewsItem";
import FavoritesList from "./components/FavoritesList/FavoritesList";
import NewsItemProps from "./NewsItemProps";

const App: React.FC = () => {
  const [news, setNews] = useState<number[]>([]);
  const [type, setType] = useState<"topstories" | "newstories" | "beststories">(
    "topstories"
  );
  const [favorites, setFavorites] = useState<number[]>([]);
  const [newsMap, setNewsMap] = useState<{ [id: number]: NewsItemProps }>({});

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get<number[]>(
        `https://hacker-news.firebaseio.com/v0/${type}.json`
      );
      const newsIds = result.data.slice(0, 30);
      setNews(newsIds);
      const newsPromises = newsIds.map((id) =>
        axios.get<NewsItemProps>(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        )
      );
      const newsResults = await Promise.all(newsPromises);
      const newsMap = newsResults.reduce<{ [id: number]: NewsItemProps }>(
        (acc, cur) => {
          acc[cur.data.id] = cur.data;
          return acc;
        },
        {}
      );
      setNewsMap(newsMap);
    };
    fetchData();
  }, [type]);

  useEffect(() => {
    const interval = setInterval(() => {
      setType((prevType) => prevType);
    }, 30000);
    return () => clearInterval(interval);
  }, [type]);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value as "topstories" | "newstories" | "beststories");
  };

  const handleAddToFavorites = (id: number) => {
    setFavorites((prevFavorites) => [...prevFavorites, id]);
  };

  const handleRemoveFromFavorites = (id: number) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((favoriteId) => favoriteId !== id)
    );
  };

  return (
    <div className="App">
      <h1>Hacker News</h1>
      <div>
        <label htmlFor="type">Type: </label>
        <select id="type" value={type} onChange={handleTypeChange}>
          <option value="topstories">Top Stories</option>
          <option value="newstories">New Stories</option>
          <option value="beststories">Best Stories</option>
          <option value="all">All</option>
        </select>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <NewsList
              news={news}
              onAddToFavorites={handleAddToFavorites}
              filter={type}
              newsMap={newsMap}
            />
          }
        />
        <Route
          path="/item/:id"
          element={
            <NewsItem
              onAddToFavorites={handleAddToFavorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesList
              favorites={favorites}
              onRemoveFromFavorites={handleRemoveFromFavorites}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
