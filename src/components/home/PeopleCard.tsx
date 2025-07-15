import React from "react";
import Carousel from "./Carousel";
import CommaIcon from "../../../public/assets/img/“.svg";

function replaceCommaWithIcon(text: string) {
  // 쉼표를 SVG <img>로 변환
  return text.split(",").reduce<React.ReactNode[]>((acc, part, idx, arr) => {
    acc.push(part);
    if (idx < arr.length - 1) {
      acc.push(
        <img
          key={idx}
          src={CommaIcon}
          alt=","
          style={{ display: "inline", width: 16, height: 12, verticalAlign: "middle" }}
        />
      );
    }
    return acc;
  }, []);
}

interface PeopleCardItem {
  color: string; // ex: "green", "blue", "yellow"
  text: string; // ex: "스터디에서 새로운 인연을 만나고, 성장의 기쁨을 느꼈어요."
  highlight?: string[]; // 강조할 단어들 (선택)
}

interface PeopleCardProps {
  data?: PeopleCardItem[];
}

const PeopleCard: React.FC<PeopleCardProps> = ({ data = [] }) => {
  if (!data || data.length === 0) return null;
  const cardList = data.map((item, idx) => {
    // 강조 단어 <b>로 치환 (HTML string)
    let htmlText = item.text;
    if (item.highlight && item.highlight.length > 0) {
      const regex = new RegExp(`(${item.highlight.join("|")})`, "g");
      htmlText = htmlText.replace(regex, "<b>$1</b>");
    }
    // 쉼표를 SVG로 변환 + <b> 강조 유지
    const content = replaceCommaWithIcon(htmlText).map((part, i) =>
      typeof part === "string" ? <span key={i} dangerouslySetInnerHTML={{ __html: part }} /> : part
    );
    return (
      <div
        key={idx}
        className="bg-white rounded-2xl shadow p-5 text-center min-h-[140px] flex flex-col justify-center"
      >
        <div className={`text-2xl text-${item.color}-500 mb-2`}>“</div>
        <div className="text-gray-800 text-base leading-relaxed">{content}</div>
      </div>
    );
  });

  return <Carousel items={cardList} />;
};

export default PeopleCard;
