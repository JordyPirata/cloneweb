import { Button } from "@nextui-org/react";

export function Alert({ message, onClose, type }) {
  return (
    <div className="alert-overlay">
      <div className="alert">
        {type === "success" ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-2 text-center">
            <span className="sm:inline block">{message}</span>
          </div>
        ) : (
          type === "error" && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl relative mb-2 text-center ">
              <span className="sm:inline block">{message}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
