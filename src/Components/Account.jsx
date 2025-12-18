import React, { useContext, useState } from 'react'
import { AppContext } from '../AppContext'
import { Link, useNavigate } from 'react-router-dom'
import AccountModal from './AccountModal'
import loginSVG from '../assets/login-2-svgrepo-com.svg'
import moon from '../assets/moon-svgrepo-com.svg'
import sun from '../assets/sun-svgrepo-com.svg'
import ThemeSwitcher from './ThemeSwitcher'

const Account = () => {
    const { user, theme } = useContext(AppContext)
    const { setUser, currentUser } = user
    const { setTheme, isDark } = theme

    const [modal, setModal] = useState(false)

    const navigate = useNavigate()

    const checkAndOpenModal = () => {

        const currentUser = JSON.parse(localStorage.getItem(`currentUser`))

        if (currentUser) {
            alert(`У вас уже есть аккаунт`)
            navigate(`/profile`)
        } else {
            setModal(true)
        }

    }

    return (
        <div>
            <div className="fixed top-5 right-5 flex items-center gap-4">

                {/* Переключатель темы */}
                <ThemeSwitcher />

                {/* Ссылка на историю тестов */}
                <Link to="/HistoryTest" className="btn btn-ghost btn-sm">
                    История тестов
                </Link>

                {/* Кнопка аккаунта */}
                <button
                    onClick={checkAndOpenModal}
                    className={`btn btn-sm gap-2 ${isDark ? 'btn-outline' : 'btn-primary'}`}
                >
                    <img className="w-5 h-5" src={loginSVG} alt="Логин" />
                    <span>{currentUser.firstName}</span>
                </button>
            </div>

            {/* Модальное окно */}
            {modal && (

                <AccountModal setModal={setModal} />
            )}
        </div>
    )
}

export default Account
