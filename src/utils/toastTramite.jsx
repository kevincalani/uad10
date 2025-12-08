import { toast } from "react-hot-toast";

const formatDateISO = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
};

export function toastTramite({ type, tramiteNumber, date }) {
    const formattedDate = date
        ? formatDateISO(date)
        : "N/A";

    toast.custom(
        (t) => (
            <div
                className={`
                    bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden 
                    border border-gray-300 transition-all 
                    ${t.visible ? "animate-enter" : "animate-leave"}
                `}
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Nueva {type}</h3>

                    <button
                        className="text-white hover:text-gray-200"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        ✖
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 text-center">
                    <p className="text-gray-700 mb-3">Número de Trámite :</p>

                    <div className="p-4 shadow-inner mb-4">
                        <p className="text-5xl font-extrabold text-red-600 mb-1">
                            {tramiteNumber}
                        </p>
                        <p className="text-sm text-gray-600">{formattedDate}</p>
                    </div>
                </div>
            </div>
        ),
        {
            duration: 500, // mismo tiempo que el modal original
            position: "top-center",
        }
    );
}
