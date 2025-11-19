import React, { useContext, useState } from 'react'
import loginSVG from '../assets/login-2-svgrepo-com.svg'
import AccountModal from './AccountModal'

import { AppContext } from '../AppContext'
import { Link } from 'react-router-dom'

const Account = () => {

    const { user } = useContext(AppContext)
    const { setUser, currentUser } = user

    const [modal, setModal] = useState(false)
    console.log(currentUser);
    

    return (
        <div>

            <div className="fixed top-5 right-5 flex items-center gap-4">
                <Link
                    to="/HistoryTest"
                    className="text-[#2E37A4] font-semibold hover:underline"
                >
                    История тестов
                </Link>

                <button
                    onClick={() => setModal(true)}
                    className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg transition"
                >
                    <img className="w-5 h-5" src={loginSVG} alt="Логин" />
                    <span className="font-medium text-gray-800">{currentUser.firstName}</span>
                </button>
            </div>

            {modal && <AccountModal setModal={setModal} />}

        </div>
    )
}

export default Account