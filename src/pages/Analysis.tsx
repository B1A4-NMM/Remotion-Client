import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardItem from "../components/CardItem";
import "../styles/CardStyles.css";

const CardList = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const cards = [
    {
      image:
        "https://images.unsplash.com/photo-1557177324-56c542165309?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
      category: "Feelings",
      heading: "About me",
      link: "/aboutme",
    },
    {
      image:
        "https://images.unsplash.com/photo-1557187666-4fd70cf76254?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Memories",
      heading: "Relation",
      link: "/relation",
    },
  ];

  const handleCardClick = (index: number, link: string) => {
    if (activeIndex !== null) return;

    setActiveIndex(index);
    setIsFading(true);

    setTimeout(() => {
      navigate(link);
    }, 500); // 페이드 효과 시간과 맞춤
  };

  return (
    <>
      <section className="hero-section">
        <div className="card-grid column-layout">
          {cards.map((card, index) => (
            <CardItem
              key={index}
              image={card.image}
              category={card.category}
              heading={card.heading}
              isActive={activeIndex === index}
              onClick={() => handleCardClick(index, card.link)}
            />
          ))}
        </div>
      </section>
      <div className={`fade-screen ${isFading ? "fade-out" : ""}`} />
    </>
  );
};

export default CardList;
