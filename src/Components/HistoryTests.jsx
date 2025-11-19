import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HistoryTests = () => {

    const [tests, setTests] = useState([])

    const getTests = async () => {
        const get = await axios.get(`https://json-questions-2.onrender.com/test_results`)
        const data = get.data
        setTests(data)
    }


    useEffect(() => {
        getTests()
    })

    return (
        <div className="p-6">

            <Link to="/" className="text-[#2E37A4] font-semibold hover:underline">
                Главное
            </Link>

            <div className="p-6 bg-gray-50 max-h-[600px] w-[80%] rounded-lg mx-auto mt-8 overflow-y-auto shadow-sm">

                <h2 className="text-3xl font-bold mb-6" style={{ color: '#2E37A4' }}>
                    История тестов
                </h2>

                <div className="flex flex-col gap-6">
                    {tests.map((m) => {
                        const date = new Date(m.test_date);
                        const percent = Math.round((m.test_score / m.test_max_score) * 100);

                        return (
                            <div
                                key={m.id}
                                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center border-l-4"
                                style={{ borderColor: '#2E37A4' }}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">{m.test_type}</h3>
                                    <p className="text-gray-500 text-sm">
                                        Дата: {date.getDate()}.{date.getMonth() + 1}.{date.getFullYear()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <p className="text-gray-700">
                                        Набрано баллов {m.test_score} из {m.test_max_score}
                                    </p>

                                    <span
                                        className={`px-3 py-1 rounded-full text-white font-semibold ${percent >= 85 ? 'bg-green-600' : 'bg-yellow-600'
                                            }`}
                                    >
                                        {percent}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

        </div>

    )
}

export default HistoryTests