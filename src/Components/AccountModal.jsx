import React, { useContext, useState } from 'react'
import { AppContext } from '../AppContext'
import axios from 'axios'

const AccountModal = ({ setModal }) => {
    const { user } = useContext(AppContext)
    const { setUser } = user

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const closeModal = () => {
        setModal(false)
    }

    const checkLogin = async () => {
        try {
            const postLogin = await axios.post(
                `https://json-questions-3.onrender.com/login/user`,
                { login, password }
            )

            const resData = postLogin.data

            if (postLogin.status === 200) {
                localStorage.setItem('currentUser', JSON.stringify(resData.user))
                setUser(resData.user)
                closeModal()
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Неправильный логин или пароль')
                } else {
                    console.log('Ошибка сервера:', error.response.data)
                }
            } else if (error.request) {
                console.log('Нет ответа от сервера')
            } else {
                console.log('Ошибка:', error.message)
            }
        }
    }

    return (
        <div className="modal modal-open">
            <div className="modal-box relative max-w-md w-full overflow-y-auto">
                <button
                    className="btn btn-sm btn-circle absolute right-2 top-2"
                    onClick={closeModal}
                >
                    ✕
                </button>

                <h3 className="font-bold text-lg text-center mb-4">Вход в аккаунт</h3>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Логин"
                        className="input input-bordered w-full"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        className="input input-bordered w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={checkLogin}
                        className="btn btn-primary w-full mt-2"
                    >
                        Войти
                    </button>
                </div>
            </div>
        </div>

    )
}

export default AccountModal
