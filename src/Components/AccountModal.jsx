import React, { useContext, useState } from 'react'
import close_SVG from '../assets/close-sm-svgrepo-com.svg'
import axios from 'axios'
import { AppContext } from '../AppContext'

const AccountModal = ({ setModal }) => {

    const { user } = useContext(AppContext)
    const { setUser } = user

    const [login, setLogin] = useState(null)
    const [password, setPassword] = useState(null)

    const closeModal = () => {
        setModal(false)
    }

    const checkLogin = async () => {
        try {

            const res = await axios.get(`http://localhost:3001/users`)
            const resData = res.data
            console.log(res);
            const find = resData.find(f => f.login === login)

            if (find) {
                console.log(find);
                if (find.password === +password) {
                    localStorage.setItem(`currentUser`, JSON.stringify(find))
                    setModal(close)
                    setUser(find)
                }
            }

        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div>

            <div className='bg-[#00000080] fixed inset-0 w-full h-full flex justify-center items-center z-[200]'>

                <div className='bg-white rounded-[12px] p-[30px] shadow-lg max-w-[400px] w-[90%] relative'>

                    <img onClick={closeModal} src={close_SVG} className='absolute w-[30px] top-2 right-2' alt="" />

                    <div className='w-[255px] mx-auto'>

                        <div className='flex flex-col gap-[20px] w-full'>

                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full border-2 border-gray-400 rounded-lg px-3 py-3 focus:border-blue-600 outline-none"
                                    onChange={(e) => setLogin(e.target.value)}
                                    value={login}
                                />
                                <label
                                    className="
      absolute left-3 top-3 text-gray-500 transition-all
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-placeholder-shown:top-3
      peer-placeholder-shown:text-base bg-white px-1
      peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm
    "
                                >
                                    Логин
                                </label>
                            </div>

                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder=" "
                                    className="peer w-full border-2 border-gray-400 rounded-lg px-3 py-3 focus:border-blue-600 outline-none"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                <label
                                    className="
      absolute left-3 top-3 text-gray-500 transition-all
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-placeholder-shown:top-3
      peer-placeholder-shown:text-base bg-white px-1
      peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-sm
    "
                                >
                                    Пароль
                                </label>
                            </div>


                        </div>

                        <button onClick={checkLogin} className='bg-[#2E37A4] w-full py-[10px] text-white rounded-lg mt-[20px]'>Логин</button>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default AccountModal