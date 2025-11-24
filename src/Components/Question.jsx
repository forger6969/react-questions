import React, { useContext } from 'react';
import { AppContext } from '../AppContext';

const Question = ({ question, setAnswer, selected, id }) => {

  const { theme } = useContext(AppContext);
  const { isDark } = theme;
  console.log(question);


  return (
    <div className="flex justify-center mt-20">
      <div className={`${isDark ? "bg-[#14172A]" : "bg-white"} rounded-xl w-1/2 p-6 shadow-lg`}>

        <p className={`text-lg font-semibold border-b border-gray-300 pb-2 mb-4 ${isDark ? `text-[#2E37A4]` : `text-black`}`}>
          {question.question}
        </p>

        <form className="flex flex-col gap-4">
          {question.variants.map((m, i) => (
            <label
              key={i}
              className={`flex items-center gap-4 p-3 border-2 rounded cursor-pointer transition 
              ${isDark ? "border-[#2A2D40] hover:bg-[#1B1E33]" : "border-gray-300 hover:bg-gray-50"}`}
            >
              <input
                checked={selected === m.key}
                onChange={() => setAnswer(m.key, id)}
                type="radio"
                name={`question-${id}`}
                className="w-5 h-5 text-blue-600"
              />
              <span className={`${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {m.text}
              </span>
            </label>
          ))}
        </form>

      </div>
    </div>
  );
};

export default Question;
