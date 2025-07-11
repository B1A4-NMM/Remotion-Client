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
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fCVFQyU5RCVCQyVFQiU5RiVBQyVFQyU4QSVBNCVFRCU4QSVCOHxlbnwwfHwwfHx8MA%3D%3D",
      category: "Feelings",
      heading: "About me",
      link: "/aboutme",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1682308117151-22e8ef6cf444?q=80&w=1243&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Memories",
      heading: "Relation",
      link: "/relation",
    },
    {
      image:
        "https://plus.unsplash.com/premium_photo-1682310071124-33632135b2ee?q=80&w=912&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "Memories",
      heading: "Map View",
      link: "/map",
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
      <div>심층분석 페이지</div>
      {/* <section className="hero-section">
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
      <div className={`fade-screen ${isFading ? "fade-out" : ""}`} /> */}
    </>
  );
};

export default CardList;
