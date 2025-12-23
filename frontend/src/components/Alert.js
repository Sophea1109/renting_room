export default function Alert({ message, type = "success", onClose }) {
    const bgColor =
      type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  
    return (
      <div className={`fixed top-6 right-6 px-6 py-4 rounded-lg shadow-lg ${bgColor} z-50`}>
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4 font-bold text-xl leading-none">&times;</button>
        </div>
      </div>
    );
  }
  