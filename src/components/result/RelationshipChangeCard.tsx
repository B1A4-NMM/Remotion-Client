import React from "react";
import { Link } from "react-router-dom";

interface Person {
  name: string;
  changeScore: number;
}

interface RelationshipChangeCardProps {
  people: Person[];
}

const RelationshipChangeCard: React.FC<RelationshipChangeCardProps> = ({ people }) => {
  if (!people || people.length === 0) return null;

  // 친밀도 증가/감소 분류
  const increased = people.filter(person => person.changeScore > 0);
  const decreased = people.filter(person => person.changeScore < 0);

  return (
    <div className="mb-6 mt-3">
      <Link to="/relation" className="block">
        <div className="rounded-2xl shadow bg-white dark:bg-gray-800 p-5 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed ">
            {increased.length > 0 && (
              <p>
                오늘 일기로 <br />{" "}
                {increased.map((person, index) => (
                  <span key={person.name}>
                    <span className="font-semibold text-black dark:text-white">
                      {person.name}
                    </span>
                    와의 친밀도가{" "}
                    <span className="text-green-600 dark:text-green-200 font-medium">
                      {person.changeScore.toFixed(1)}점{" "}
                    </span>
                    올랐
                    {index < increased.length - 1 ? "고, " : ""}
                    {index === increased.length - 1 && decreased.length > 0 ? "고, " : ""}
                    {index === increased.length - 1 && decreased.length === 0 ? "네요." : ""}
                    {index === increased.length - 1 && decreased.length > 0 ? "" : ""}
                    {index === increased.length - 1 && decreased.length > 0 ? <br /> : <br />}
                  </span>
                ))}
              </p>
            )}

            {decreased.length > 0 && (
              <p className="mb-2">
                {increased.length > 0 ? (
                  ""
                ) : (
                  <>
                    오늘 일기로 <br />
                  </>
                )}
                {decreased.map((person, index) => (
                  <span key={person.name}>
                    <span className="font-semibold text-black dark:text-white">
                      {person.name}
                    </span>
                    와의 친밀도가{" "}
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {Math.abs(person.changeScore).toFixed(1)}점{" "}
                    </span>
                    내려갔
                    {index < decreased.length - 1 ? "고, " : ""}
                    {index === decreased.length - 1 ? "네요." : ""}
                    {index < decreased.length - 1 ? <br /> : ""}
                  </span>
                ))}
              </p>
            )}

            <p className="text-sm mt-2 font-semibold text-black dark:text-white">
              카드를 클릭해서 관계 변화를 확인하세요
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RelationshipChangeCard;
