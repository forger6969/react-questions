import React, { useContext, useState } from 'react'
import loginSVG from '../assets/login-2-svgrepo-com.svg'
import AccountModal from './AccountModal'

import { AppContext } from '../AppContext'
import { Link } from 'react-router-dom'

import moon from '../assets/moon-svgrepo-com.svg'
import sun from '../assets/sun-svgrepo-com.svg'

const Account = () => {

    const { user, theme } = useContext(AppContext)
    const { setUser, currentUser } = user
    const { setTheme, isDark } = theme

    const [modal, setModal] = useState(false)
    console.log(currentUser);


    return (
        <div>

            <div className="fixed top-5 right-5 flex items-center gap-4">

                <button className='bg-[#2E37A4] px-[10px] py-[4px] rounded-[4px]' onClick={() => setTheme(!isDark)}> <img className='w-[20px]' src={isDark ? moon : sun} alt="" /> </button>

                <Link
                    to="/HistoryTest"
                    className="text-[#2E37A4] font-semibold hover:underline"
                >
                    История тестов
                </Link>

                <button
                    onClick={() => setModal(true)}
                    className={`flex items-center gap-2 ${isDark ? `bg-[#14172A]` : `bg-white`} px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition`}
                >
                    <img className="w-5 h-5" src={loginSVG} alt="Логин" />
                    <span className={`font-medium text-gray-800`}>{currentUser.firstName}</span>
                </button>
            </div>

            {modal && <AccountModal setModal={setModal} />}

        </div>
    )
}

export default Account