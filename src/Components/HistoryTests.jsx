import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HistoryTests = () => {
    const [tests, setTests] = useState([])

    const getTests = async () => {
        const get = await axios.get(`https://json-questions-3.onrender.com/results`)
        const data = get.data
        const user = JSON.parse(localStorage.getItem('currentUser'))
        const filter = data.filter((f) => f.student_id === user.id)
        setTests(filter)
    }

    useEffect(() => {
        getTests()
    }, [])

    return (
        <div className="p-6">
            <Link to="/" className="btn btn-ghost mb-4">
                Главное
            </Link>

            <div className="bg-base-100 p-6 rounded-lg shadow-lg max-h-[600px] w-[80%] mx-auto mt-8 overflow-y-auto">
                <h2 className="text-3xl font-bold mb-6 text-primary text-center">История тестов</h2>

                <div className="flex flex-col gap-4">
                    {tests.map((m) => {
                        const date = new Date(m.test_date)
                        const percent = Math.round((m.test_score / m.test_max_score) * 100)
                        const badgeColor = percent >= 85 ? 'badge-success' : 'badge-warning'

                        return (
                            <div
                                key={m.id}
                                className="card bg-base-100 shadow-md border-l-4 border-primary"
                            >
                                <div className="card-body flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="card-title">{m.test_type}</h3>
                                        <p className="text-sm text-gray-500">
                                            Дата: {date.getDate()}.{date.getMonth() + 1}.{date.getFullYear()}
                                        </p>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                        <p>
                                            Набрано баллов {m.test_score} из {m.test_max_score}
                                        </p>
                                        <span className={`badge ${badgeColor} text-white font-semibold`}>
                                            {percent}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default HistoryTests
