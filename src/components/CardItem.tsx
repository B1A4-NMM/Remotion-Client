// src/components/CardItem.tsx
import React from "react";

type CardItemProps = {
  image: string;
  category: string;
  heading: string;
  isActive: boolean;
  onClick: () => void;
};

const CardItem: React.FC<CardItemProps> = ({ image, category, heading, isActive, onClick }) => {
  return (
    <div className={`card ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="card__background" style={{ backgroundImage: `url(${image})` }} />
      <div className="card__content">
        <p className="card__category">{category}</p>
        <h3 className="card__heading">{heading}</h3>
      </div>
    </div>
  );
};

export default CardItem;
