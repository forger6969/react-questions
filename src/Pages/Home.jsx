import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { AppContext } from '../AppContext'
import axios from 'axios'

const Home = () => {

    const { theme } = useContext(AppContext)
    const { isDark } = theme

    const [tests, setTests] = useState([])

    const getQuestsList = async () => {
        try {

            const data = await axios.get(`https://json-questions-3.onrender.com/tests`)
            const test = await data.data

            setTests(test)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getQuestsList()
    }, [])

    return (
        <div>
            <div className={`${isDark ? `bg-[#14172A]` : `bg-white`} shadow-xl flex flex-col gap-[20px] w-[250px] h-[100vh] fixed left-0 top-0 p-[30px] border-r border-gray-200`}>
                {tests.map((m) => {

                    return (
                        <NavLink
                            to={`/Questions/${m.id}`}
                            className={({ isActive }) =>
                                `text-[18px] font-medium transition-colors duration-200 hover:text-[#2f3cca] rounded p-[10px] ${isActive ? "text-[#2E37A4] font-semibold bg-[#e3e3e3]" : "text-gray-700"
                                }`
                            }
                        >
                            {m.name}
                        </NavLink>
                    )
                })}
            </div>
            

            <p className='text-[#adadad] text-center text-[30px] pt-[300px]'>Выберите тест</p>

        </div >
    )
}

export default Home