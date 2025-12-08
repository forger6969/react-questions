import React, { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../AppContext'

const Home = () => {
    const [tests, setTests] = useState([])
    const { loader } = useContext(AppContext)
    const { setLoader } = loader

    const getQuestsList = async () => {
        try {
            const { data } = await axios.get(`https://json-questions-3.onrender.com/tests`)
            setTests(data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoader(false)
        }
    }

    useEffect(() => {
        getQuestsList()
    }, [])

    return (
        <div className="flex min-h-screen bg-base-200">
            {/* Боковое меню */}
            <aside className="w-64 p-6 bg-base-100 shadow-lg rounded-r-lg border-r border-gray-200 flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-center mb-4 text-primary">Тесты</h2>
                {tests.length === 0 ? (
                    <p className="text-gray-500 text-center mt-4">Загрузка...</p>
                ) : (
                    tests.map((test) => (
                        <NavLink
                            key={test.id}
                            to={`/Questions/${test.id}`}
                            className={({ isActive }) =>
                                `btn btn-ghost btn-block text-left ${isActive ? 'btn-primary text-white' : 'text-gray-700 hover:bg-base-200'
                                }`
                            }
                        >
                            {test.name}
                        </NavLink>
                    ))
                )}
            </aside>

            {/* Основная область */}
            <main className="flex-1 flex flex-col justify-center items-center p-6">
                <div className="card w-full max-w-md bg-base-100 shadow-xl">
                    <div className="card-body text-center">
                        <h3 className="card-title text-3xl text-gray-600">Добро пожаловать!</h3>
                        <p className="text-gray-500 mt-2">
                            Выберите тест слева, чтобы начать проверку своих знаний.
                        </p>
                        <div className="mt-4">
                            <button className="btn btn-primary btn-sm" disabled>
                                Выберите тест
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
