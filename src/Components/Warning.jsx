import React from 'react'

const Warning = ({ setModal, text }) => {

    const modalClose = () => {
        setModal(false)
    }

    return (
        <div>

            <div className='bg-[#00000080] fixed inset-0 w-full h-full flex justify-center items-center z-50'>

                <div className='bg-white rounded-[12px] p-[30px] shadow-lg max-w-[400px] w-[90%]'>
                    <p className='text-[18px] font-medium text-center mb-[25px] text-gray-800'>{text}</p>

                    <div className='flex items-center justify-center gap-[15px]'>
                        <button
                            onClick={modalClose}
                            className='bg-gray-200 text-gray-700 px-[25px] py-[10px] rounded-[8px] hover:bg-gray-300 transition-colors font-medium w-full'
                        >
                            Закрыть
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Warning