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
        "https://images.unsplash.com/photo-1642618598178-52eb00dc544d?q=80&w=990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Calendar",
      heading: "Calendar",
      link: "/calendar",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1683288062212-9da20bc0a18f?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Contents",
      heading: "Contents",
      link: "/video",
    }
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
      <section className="hero-section   text-foreground min-h-screen">
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
