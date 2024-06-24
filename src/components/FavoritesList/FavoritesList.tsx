import React, { FC } from "react";
import { Link } from "react-router-dom";
import styles from "./FavoritesList.module.css";

interface Props {
  favorites: number[];
  onRemoveFromFavorites: (id: number) => void;
}

const FavoritesList: FC<Props> = ({ favorites, onRemoveFromFavorites }) => {
  return (
    <ul className={styles.favoritesList}>
      {favorites.map((favoriteId) => (
        <li key={favoriteId} className={styles.favoritesListItem}>
          <Link to={`/item/${favoriteId}`} className={styles.favoritesListLink}>
            {favoriteId}
          </Link>
          <button
            onClick={() => onRemoveFromFavorites(favoriteId)}
            className={styles.favoritesListButton}
          >
            Remove from favorites
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
