import React from 'react'
import { NavLink } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <div className="bg-white shadow-xl flex flex-col gap-[20px] w-[250px] h-[100vh] fixed left-0 top-0 p-[30px] border-r border-gray-200">
                <NavLink
                    to="/ReactQuestions"
                    className={({ isActive }) =>
                        `text-[18px] font-medium transition-colors duration-200 hover:text-[#2f3cca] rounded p-[10px] ${isActive ? "text-[#2E37A4] font-semibold bg-[#e3e3e3]" : "text-gray-700"
                        }`
                    }
                >
                    React
                </NavLink>

                <NavLink
                    to="/JavaScriptQuestions"
                    className={({ isActive }) =>
                        `text-[18px] font-medium transition-colors duration-200 hover:text-[#2f3cca] rounded p-[10px] ${isActive ? "text-[#2E37A4] font-semibold bg-[#e3e3e3] " : "text-gray-700"
                        }`
                    }
                >
                    javaScript
                </NavLink>
            </div>

        </div>
    )
}

export default Home