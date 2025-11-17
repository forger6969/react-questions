import React, { useEffect, useState } from 'react'
import Question from '../Components/Question'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ReactQuestions = ({ questions }) => {

    const [page, setPage] = useState(0)
    const [answer, setAnswer] = useState({})
    const [score, setScore] = useState(0)

    const [isFinal, setFinal] = useState(false)
    const [openModal, setModal] = useState(false)



    const nextPage = () => {
        setPage(prev => prev + 1)

        if (page + 1 >= questions.length) {
            setPage(questions.length - 1)
        }

    }

    const prevPage = () => {
        if (page <= 0) {
            setPage(0)
        } else {
            setPage(prev => prev - 1)
        }
    }

    const addAnswer = (key, id) => {
        setAnswer(prev => ({
            ...prev, [id]: key
        }))
    }

    const final = () => {
        let score = 0

        questions.map((m, i) => {



            if (m.trueVariant === answer[i]) {
                score += m.score
            }

        })

        console.log(score);
        setScore(score)
        setFinal(true)
    }


    return (
        <>
            <div className='flex flex-col mx-auto pt-[30px]'>

                {isFinal ?

                    <>
                        <div className='bg-[#2e38a487] w-fit p-[10px] rounded-[8px] flex flex-col items-center mx-auto my-[250px]'>
                            <p className='text-[20px] text-white font-medium'>{score}/30</p>
                            <Link className='bg-[#2E37A4] text-white px-[20px] py-[5px] rounded-[8px]' to="/">На главную</Link >
                        </div>
                    </>

                    :
                    <>
                        <p className='text-center'>{page + 1}/{questions.length}</p>

                        {questions[page] && <Question question={questions[page]} setAnswer={addAnswer} selected={answer[page]} id={page} />}

                        <div className='flex justify-center items-center gap-[40px] pt-[20px]'>
                            <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={prevPage}>Предыдуший</button>

                            {page + 1 >= questions.length ? <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={final}>Завершить</button> : <button className='bg-[#2E37A4] px-[15px] py-[5px] rounded-[8px] text-white' onClick={nextPage}>Следующий вопрос</button>}
                        </div>

                        {openModal &&

                            <>
                                <div className='bg-[#00000051]'>

                                    <div>
                                        <p>Вы точно хотите завершить тест?</p>

                                        <div className='flex items-center'>
                                            <button>Отменить</button>
                                            <button>Подтвердить</button>
                                        </div>
                                    </div>

                                </div>
                            </>

                        }

                    </>
                }

            </div>
        </>
    )
}

export default ReactQuestions