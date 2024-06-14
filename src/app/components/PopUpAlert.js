// PopupAlert.js

import { useState } from "react";

const PopupAlert = ({ message, onConfirm, onCancel }) => {
  const [show, setShow] = useState(true);

  const handleConfirm = () => {
    onConfirm();
    setShow(false);
  };

  const handleCancel = () => {
    onCancel();
    setShow(false);
  };

  return (
    <div
      className={`fixed z-10 inset-0 overflow-y-auto ${show ? "" : "hidden"}`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-center overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="mt-3 sm:mt-0">
            <div className="mt-2">
              <a className="text-xl font-bold text-red-500">{message}</a>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 justify-center">
            <button
              onClick={handleConfirm}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupAlert;
