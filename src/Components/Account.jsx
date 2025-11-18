import React, { useContext, useState } from 'react'
import loginSVG from '../assets/login-2-svgrepo-com.svg'
import AccountModal from './AccountModal'

import { AppContext } from '../AppContext'

const Account = () => {

    const { user } = useContext(AppContext)
    const { setUser, currentUser } = user

    const [modal, setModal] = useState(false)

    return (
        <div>

            <div className='fixed top-5 right-5'>
                <button onClick={() => setModal(true)} className='flex items-center gap-[10px] bg-white px-[10px] py-[5px] rounded'><img className='w-[20px]' src={loginSVG} alt="" />{currentUser.firstName}</button>
            </div>

            {modal && <AccountModal setModal={setModal} />}

        </div>
    )
}

export default Account