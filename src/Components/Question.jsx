import React from 'react';

const Question = ({ question, setAnswer, selected, id }) => {

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white rounded-xl w-1/2 p-6 shadow-lg">
        <p className="text-lg font-semibold border-b border-gray-300 pb-2 mb-4">
          {question.vopros}
        </p>

        <form className="flex flex-col gap-4">

          {question.variants.map((m, i) => (
            < label className="flex items-center gap-4 p-3 border-2 rounded cursor-pointer border-gray-300 hover:bg-gray-50">
              <input checked={selected === m.key} onChange={() => setAnswer(m.key, id)} type="radio" name="question" className="w-5 h-5 text-blue-600" />
              <span className="text-gray-800">{m.text}</span>
            </label>
          ))
          }

        </form>
      </div>
    </div >
  );
};

export default Question;
