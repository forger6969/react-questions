import React, { useEffect, useState } from 'react'
import Question from '../Components/Question'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Warning from '../Components/Warning'

const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN
const CHAT_ID = import.meta.env.VITE_CHAT_ID

const Questions = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [started, setStarted] = useState(false)
    const [page, setPage] = useState(0)
    const [answer, setAnswer] = useState({})
    const [score, setScore] = useState(0)
    const [isFinal, setFinal] = useState(false)

    const [openModal, setModal] = useState(false)
    const [warningQuest, setWarningQuest] = useState(false)
    const [leaveModal, setLeaveModal] = useState(false)

    const [minute, setMinute] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [questions, setQuestions] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)

    const getQuestionByID = async () => {
        try {
            const { data } = await axios.get(`https://json-questions-3.onrender.com/tests/${id}`)
            setQuestions(data)

            // Устанавливаем таймер (в миллисекундах), если не указан — 25 минут
            const totalMs = data.time ?? 25 * 60 * 1000
            setMinute(Math.floor(totalMs / 60000))
            setSeconds(Math.floor((totalMs % 60000) / 1000))

            // Текущий вопрос пока null, откроется при старте
            setCurrentQuestion(data.questions[0])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getQuestionByID()
    }, [])

    // Таймер
    useEffect(() => {
        if (!started) return
        if (minute === 0 && seconds === 0) {
            finalTimer()
            return
        }
        const timer = setInterval(() => {
            setSeconds(prev => {
                if (prev === 0) {
                    if (minute === 0) return 0
                    setMinute(m => m - 1)
                    return 59
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [minute, seconds, started])

    const addAnswer = (key, id) => {
        setAnswer(prev => ({ ...prev, [id]: key }))
    }

    const nextPage = () => {
        if (!questions?.questions) return
        const next = page + 1
        if (next < questions.questions.length) {
            setPage(next)
            setCurrentQuestion(questions.questions[next])
        }
    }
    

    const prevPage = () => {
        if (!questions?.questions) return
        const prev = page - 1
        if (prev >= 0) {
            setPage(prev)
            setCurrentQuestion(questions.questions[prev])
        }
    }

    const final = () => {
        const answersArr = Object.values(answer)
        if (answersArr.length >= questions.questions.length) {
            let totalScore = 0
            questions.questions.forEach((q, i) => {
                if (q.correctAnswer === answer[i]) totalScore += q.score
            })
            setScore(totalScore)
            setFinal(true)
            setModal(false)

            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser) {
                axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: `Ученик ${currentUser.firstName} ${currentUser.lastName} набрал ${totalScore} баллов`
                })
                axios.post(`https://json-questions-3.onrender.com/results`, {
                    student_id: currentUser.id,
                    mentor_id: "1fo0",
                    test_id: questions.id,
                    test_score: totalScore,
                    test_type: questions.description
                })
            }
        } else {
            setWarningQuest(true)
        }
    }

    const finalTimer = () => {
        let totalScore = 0
        questions.questions.forEach((q, i) => {
            if (q.correctAnswer === answer[i]) totalScore += q.score
        })
        setScore(totalScore)
        setFinal(true)
        setModal(false)

        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser) {
            axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: `Ученик ${currentUser.firstName} ${currentUser.lastName} набрал ${totalScore} баллов`
            })
            axios.post(`https://json-questions-3.onrender.com/results`, {
                student_id: currentUser.id,
                mentor_id: "1fo0",
                test_id: questions.id,
                test_score: totalScore,
                test_max_score: questions.maxScore,
                test_type: questions.description
            })
        }
    }

    const leaveConfirm = () => navigate(`/`)

    return (
        <div className="p-6">
            <p onClick={() => setLeaveModal(true)} className="btn btn-ghost mb-6 w-fit">
                На главную
            </p>

            {!started ? (
                questions && (
                    <div className="flex flex-col items-center gap-6 mt-10">
                        <div className="card w-full max-w-3xl bg-base-100 shadow-lg rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-2">{questions.name}</h2>
                            <p className="text-base-content/70 mb-2">{questions.description}</p>
                            <p>🧪 Вопросов: {questions.questions.length}</p>
                            <p>⭐ Макс. балл: {questions.maxScore}</p>
                            <p>⏱ Время на тест: {minute} мин {seconds} сек</p>
                            <button
                                className="btn btn-primary mt-4"
                                onClick={() => setStarted(true)}
                            >
                                Начать тест
                            </button>
                        </div>
                    </div>
                )
            ) : isFinal ? (
                <div className="flex flex-col items-center justify-center mt-40 gap-4">
                    <div className="badge badge-primary text-xl">
                        {score}/{questions.maxScore}
                    </div>
                    <Link to="/" className="btn btn-primary">
                        На главную
                    </Link>
                </div>
            ) : (
                <>
                    <p className="text-center mb-4">
                        {page + 1}/{questions?.questions?.length || 0}
                    </p>

                    {/* Таймер */}
                    <div className="badge badge-info text-lg fixed right-60 top-40">
                        {minute}:{seconds.toString().padStart(2, "0")}
                    </div>

                    {/* Вопрос */}
                    {currentQuestion && (
                        <Question
                            question={currentQuestion}
                            setAnswer={addAnswer}
                            selected={answer[page]}
                            id={page}
                        />
                    )}

                    {/* Навигация */}
                    <div className="gap-4 mt-4 join flex justify-center">
                        <button onClick={prevPage} className="join-item btn">«</button>
                        <button className="join-item btn">{page + 1}</button>
                        {questions && page + 1 >= questions.questions.length ? (
                            <button className="btn btn-primary" onClick={() => setModal(true)}>
                                Завершить
                            </button>
                        ) : (
                            <button onClick={nextPage} className="join-item btn">»</button>
                        )}
                    </div>

                    {/* Модалки */}
                    {openModal && (
                        <div className="modal modal-open">
                            <div className="modal-box max-w-md">
                                <p className="text-center text-lg font-medium mb-6">
                                    Вы точно хотите завершить тест?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button className="btn btn-outline" onClick={() => setModal(false)}>
                                        Отменить
                                    </button>
                                    <button className="btn btn-primary" onClick={final}>
                                        Подтвердить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {warningQuest && <Warning setModal={setWarningQuest} text="Ответьте на все вопросы" />}

                    {leaveModal && (
                        <div className="modal modal-open">
                            <div className="modal-box max-w-md">
                                <p className="text-center text-lg font-medium mb-6">
                                    Вы точно хотите покинуть тест? <span className="text-gray-400">(Прогресс обнулится)</span>
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button className="btn btn-outline" onClick={() => setLeaveModal(false)}>
                                        Вернуться
                                    </button>
                                    <button className="btn btn-primary" onClick={leaveConfirm}>
                                        Покинуть
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Questions
