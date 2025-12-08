import React from 'react';

const Question = ({ question, setAnswer, selected, id }) => {

  return (
    <div className="flex justify-center mt-10">
      <div className="card w-1/2 bg-base-100 shadow-lg rounded-xl p-6">

        <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4 text-primary">
          {question.question}
        </p>

        <form className="flex flex-col gap-4">
          {question.variants.map((variant, i) => (
            <label
              key={i}
              className="flex items-center gap-4 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-base-200 transition"
            >
              <input
                type="radio"
                name={`question-${id}`}
                checked={selected === variant.key}
                onChange={() => setAnswer(variant.key, id)}
                className="radio radio-primary"
              />
              <span className="text-gray-800">{variant.text}</span>
            </label>
          ))}
        </form>

      </div>
    </div>
  );
};

export default Question;
