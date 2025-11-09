import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);

  const faces = [
    { id: "face-sad", label: "Insatisfecho", color: "red" },
    { id: "face-neutral", label: "Neutral", color: "yellow" },
    { id: "face-happy", label: "Satisfecho", color: "green" },
  ];

  async function handleSelect(face) {
    if (sending) return; // Evita doble clic
    setSending(true);
    setSelected(face.id);

    try {
      const resp = await fetch("/api/satisfaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: face.label }),
      });

      if (!resp.ok) throw new Error("Error en la respuesta del servidor");

      // Muestra modal y recarga después de 2s
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setSending(false);
    }
  }

  const getRingColor = (face) => {
    const base = "transition-all opacity-90 hover:opacity-100 hover:scale-105";

    if (selected === face.id) {
      if (face.color === "red")
        return `${base} ring-4 ring-offset-2 ring-red-500 scale-105 bg-red-50`;
      if (face.color === "yellow")
        return `${base} ring-4 ring-offset-2 ring-yellow-500 scale-105 bg-yellow-50`;
      if (face.color === "green")
        return `${base} ring-4 ring-offset-2 ring-green-500 scale-105 bg-green-50`;
    } else {
      if (face.color === "red")
        return `${base} ring-2 ring-red-200 hover:ring-red-400`;
      if (face.color === "yellow")
        return `${base} ring-2 ring-yellow-200 hover:ring-yellow-400`;
      if (face.color === "green")
        return `${base} ring-2 ring-green-200 hover:ring-green-400`;
    }

    return base;
  };

  return (
    <>
      <Head>
        <title>Encuesta de Satisfacción</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <main className="bg-sky-100 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 text-center">
          <h1 className="text-xl md:text-2xl font-semibold mb-2 uppercase">
            ¿Qué tan satisfecho estás con nuestro servicio?
          </h1>
          <p className="text-sm md:text-base text-gray-500 mb-6">
            Selecciona una opción.
          </p>

          {/* Grid responsive: 1 columna en móvil, 3 en md+ */}
          <div className="grid px-12 md:p-0 grid-cols-1 md:grid-cols-3 gap-6"> 
            {faces.map((face) => (
              <button
                key={face.id}
                id={face.id}
                type="button"
                onClick={() => handleSelect(face)}
                disabled={sending}
                aria-pressed={selected === face.id}
                aria-label={face.label}
                className={`flex-1 cursor-pointer flex flex-col items-center p-4 rounded-xl ${getRingColor(
                  face
                )} ${sending ? "opacity-70 pointer-events-none" : "hover:shadow-lg"}`}
              >
                {face.id === "face-happy" && (
                  <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 64 64" fill="none" aria-hidden>
                    <circle cx="32" cy="32" r="30" fill="#DCFCE7" stroke="#064E3B" strokeWidth="2" />
                    <circle cx="22" cy="24" r="3" fill="#064E3B" />
                    <circle cx="42" cy="24" r="3" fill="#064E3B" />
                    <path
                      d="M20 38 C24 46, 40 46, 44 38"
                      stroke="#064E3B"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                {face.id === "face-neutral" && (
                  <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 64 64" fill="none" aria-hidden>
                    <circle cx="32" cy="32" r="30" fill="#FEF3C7" stroke="#92400E" strokeWidth="2" />
                    <circle cx="22" cy="24" r="3" fill="#92400E" />
                    <circle cx="42" cy="24" r="3" fill="#92400E" />
                    <path d="M20 40 H44" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
                {face.id === "face-sad" && (
                  <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 64 64" fill="none" aria-hidden>
                    <circle cx="32" cy="32" r="30" fill="#FEE2E2" stroke="#7F1D1D" strokeWidth="2" />
                    <circle cx="22" cy="24" r="3" fill="#7F1D1D" />
                    <circle cx="42" cy="24" r="3" fill="#7F1D1D" />
                    <path
                      d="M44 40 C40 32, 24 32, 20 40"
                      stroke="#7F1D1D"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                <span className="mt-2 text-sm md:text-base font-medium">{face.label}</span>
              </button>
            ))}
          </div>

          <footer className="mt-6 text-xs md:text-sm text-gray-400">
            &copy; 2026 Encuesta de Satisfacción. Todos los derechos reservados.
          </footer>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-xl text-center animate-fade-in max-w-lg w-full mx-4">
              <h2 className="text-2xl font-bold text-green-600 mb-3">¡Gracias por tu respuesta! 🎉</h2>
              <p className="text-gray-700">Tu opinión fue registrada correctamente.</p>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s ease-out;
        }
      `}</style>
    </>
  );
}
