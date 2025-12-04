import React, { useEffect, useState } from 'react'
import Question from '../Components/Question'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Warning from '../Components/Warning';


const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_TOKEN;
const CHAT_ID = import.meta.env.VITE_CHAT_ID;

const Questions = ({ setWarning, warning, type }) => {

    const { id } = useParams()


    const [page, setPage] = useState(0)
    const [answer, setAnswer] = useState({})
    const [score, setScore] = useState(0)

    const [isFinal, setFinal] = useState(false)
    const [openModal, setModal] = useState(false)
    const navigate = useNavigate()
    const [warningQuest, setWarningQuest] = useState(false)

    const [leaveModal, setLeaveModal] = useState(false)

    const [minute, setMinute] = useState(24)
    const [secundes, setSecundes] = useState(59)
    const [questions, setQuest] = useState(null)
    const [quesitonsPage, setQuestPage] = useState(null)


    const getQuestionByID = async () => {
        try {

            const data = await axios.get(`https://json-questions-3.onrender.com/tests/${id}`)
            const test = data.data
            setQuest(test)
            console.log(test);

            const filter = test.questions.find((f) => f.id === page)

            setQuestPage(filter)
            console.log(quesitonsPage);


        } catch (err) {
            console.log(err);
        }
    }



    const nextPage = () => {
        const next = page + 1;

        if (!questions?.questions) return;

        if (next < questions.questions.length) {
            setPage(next);
            setQuestPage(questions.questions[next]);

        }
    };

    const prevPage = () => {
        if (!questions?.questions) return;

        const prev = page - 1;

        if (prev >= 0) {
            setPage(prev);
            setQuestPage(questions.questions[prev]);
        }
    };



    const addAnswer = (key, id) => {
        setAnswer(prev => ({
            ...prev, [id]: key
        }))
    }




    const final = () => {
        let score = 0
        const valuesAnswerArr = Object.values(answer)
        console.log(`Answer: ${valuesAnswerArr.length} questiins:${questions.length}`);


        if (valuesAnswerArr.length >= questions.questions.length) {
            console.log(`hello`);

            questions.questions.map((m, i) => {
                if (m.correctAnswer === answer[i]) {
                    score += m.score
                }
            })

            console.log(score);
            setScore(score)
            setFinal(true)
            setModal(false)

            const currentUser = JSON.parse(localStorage.getItem(`currentUser`))

            if (currentUser) {

                const test_date = new Date()

                const postObject = `Ученик ${currentUser.firstName} ${currentUser.lastName} набрал ${score} баллов`

                axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: CHAT_ID,
                    text: postObject
                })

                const postNewTest = axios.post(`https://json-questions-3.onrender.com/results`, {
                    student_id: currentUser.id,
                    mentor_id: "1fo0",
                    test_id: questions.id,
                    test_score: score,
                    test_type: questions.description
                })

                console.log(postNewTest);

            }

        } else {
            setModal(false)
            setWarningQuest(true)
            console.log(`none`);
        }

    }

    const finalTimer = () => {

        let score = 0
        const valuesAnswerArr = Object.values(answer)
        console.log(`Answer: ${valuesAnswerArr.length} questiins:${questions.length}`);

        questions.questions.map((m, i) => {
            if (m.correctAnswer === answer[i]) {
                score += m.score
            }
        })

        console.log(score);
        setScore(score)
        setFinal(true)
        setModal(false)

        const currentUser = JSON.parse(localStorage.getItem(`currentUser`))

        if (currentUser) {
            const test_date = new Date()

            const postObject = `Ученик ${currentUser.firstName} ${currentUser.lastName} набрал ${score} баллов`

            axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: postObject
            })

            const postNewTest = axios.post(`https://json-questions-3.onrender.com/results`, {
                student_id: currentUser.id,
                mentor_id: "1fo0",
                test_id: questions.id,
                test_score: score,
                test_max_score: questions.maxScore,
                test_type: questions.description
            })
        }

    }

    const modalOpen = () => {
        setModal(true)
    }

    const modalClose = () => {
        setModal(false)
    }

    const handleBlur = () => {
        navigate(`/`)
        setWarning(true)
    }

    const leaveTestClick = () => {
        setLeaveModal(true)
    }

    const leaveConfirm = () => {
        navigate(`/`)
    }

    console.log(`${minute}:${secundes}`);

    useEffect(() => {
        if (minute === 0 && secundes === 0) {
            finalTimer()
            return
        }

        const timer = setInterval(() => {
            setSecundes(prev => {
                if (prev === 0) {
                    if (minute === 0) {
                        return 0;
                    }
                    setMinute(m => m - 1);
                    return 59;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        }
    }, [minute, secundes])

    useEffect(() => {
        // window.addEventListener(`blur`, handleBlur)
        getQuestionByID()

        // return () => {
        //     window.removeEventListener(`blur`, handleBlur)
        // }
    }, [])


    return (
        <>
            <p onClick={leaveTestClick} className='text-[#2E37A4] font-medium text-[20px] relative top-10 left-10 cursor-pointer w-fit' to="/"> На главную</p>
            <div className='flex flex-col mx-auto pt-[30px]'>

                {isFinal ?

                    <>
                        <div className='bg-[#2e38a487] w-fit p-[10px] rounded-[8px] flex flex-col items-center mx-auto my-[250px]'>
                            <p className='text-[20px] text-white font-medium'>{score}/{questions.maxScore}</p>
                            <Link to="/" className='bg-[#2E37A4] text-white px-[20px] py-[5px] rounded-[8px]'>На главную</Link >
                        </div>
                    </>

                    :
                    <>
                        <p className='text-center'>
                            {page + 1}/{questions?.questions?.length || 0}
                        </p>

                        <div className="bg-[#2e38a490] text-white text-[26px] font-bold px-6 py-2 rounded-[10px] mx-auto w-fit shadow-md fixed right-[230px] top-[165px]">
                            {minute}:{secundes.toString().padStart(2, "0")}
                        </div>

                        {quesitonsPage && <Question question={quesitonsPage} setAnswer={addAnswer} selected={answer[page]} id={page} />}

                        <div className='flex justify-center items-center gap-[40px] pt-[20px]'>
                            <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={prevPage}>Предыдуший</button>

                            {questions && page + 1 >= questions.questions.length ? <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={modalOpen}>Завершить</button> : <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={nextPage}>Следующий вопрос</button>}
                        </div>

                        {openModal &&

                            <>
                                <div className='bg-[#00000080] fixed inset-0 w-full h-full flex justify-center items-center z-50'>

                                    <div className='bg-white rounded-[12px] p-[30px] shadow-lg max-w-[400px] w-[90%]'>
                                        <p className='text-[18px] font-medium text-center mb-[25px] text-gray-800'>Вы точно хотите завершить тест?</p>

                                        <div className='flex items-center justify-center gap-[15px]'>
                                            <button
                                                onClick={modalClose}
                                                className='bg-gray-200 text-gray-700 px-[25px] py-[10px] rounded-[8px] hover:bg-gray-300 transition-colors font-medium'
                                            >
                                                Отменить
                                            </button>
                                            <button
                                                onClick={final}
                                                className='bg-[#2E37A4] text-white px-[25px] py-[10px] rounded-[8px] hover:bg-[#252e85] transition-colors font-medium'
                                            >
                                                Подтвердить
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </>

                        }
                        {warningQuest &&
                            <Warning setModal={setWarningQuest} text="Ответье на все вопросы" />
                        }

                        {leaveModal &&
                            <div className='bg-[#00000080] fixed inset-0 w-full h-full flex justify-center items-center z-50'>

                                <div className='bg-white rounded-[12px] p-[30px] shadow-lg max-w-[400px] w-[90%]'>
                                    <p className='text-[18px] font-medium text-center mb-[25px] text-gray-800'>Вы точно хотите покинут тест? <span className='text-[#838383]'>(Прогресс обнулится)</span></p>

                                    <div className='flex items-center justify-center gap-[15px]'>
                                        <button
                                            onClick={() => setLeaveModal(false)}
                                            className='bg-gray-200 text-gray-700 px-[25px] py-[10px] rounded-[8px] hover:bg-gray-300 transition-colors font-medium'
                                        >
                                            Вернутся
                                        </button>
                                        <button
                                            onClick={leaveConfirm}
                                            className='bg-[#2E37A4] text-white px-[25px] py-[10px] rounded-[8px] hover:bg-[#252e85] transition-colors font-medium'
                                        >
                                            Покинуть
                                        </button>
                                    </div>
                                </div>

                            </div>
                        }
                    </>
                }



            </div>
        </>
    )
}

export default Questions