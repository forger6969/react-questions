import React from 'react';

const Warning = ({ setModal, text }) => {
    const modalClose = () => setModal(false);

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <p className="text-center text-lg font-medium mb-6">{text}</p>
                <div className="flex justify-center">
                    <button
                        className="btn btn-outline w-full"
                        onClick={modalClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Warning;
