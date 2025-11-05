// src/pages/pro/Teleconsult.jsx
// Salle vidéo simplifiée (mock Agora/WebRTC)
import { useState } from "react";
import ProLayout from "../../layouts/ProLayout.jsx";

export default function Teleconsult() {
  const [connected, setConnected] = useState(false);

  return (
    <ProLayout title="Salle de téléconsultation">
      {!connected ? (
        <div className="card grid place-items-center py-20">
          <button className="btn-primary" onClick={() => setConnected(true)}>
            Démarrer la session vidéo
          </button>
        </div>
      ) : (
        <div className="card p-6 space-y-4">
          <div className="aspect-video bg-slate-900 rounded-xl grid place-items-center text-slate-400">
            🎥 Flux vidéo simulé
          </div>
          <div className="flex gap-2 justify-center">
            <button className="btn-ghost">🔇 Muet</button>
            <button className="btn-ghost">📷 Caméra</button>
            <button className="btn-danger" onClick={() => setConnected(false)}>
              ❌ Terminer
            </button>
          </div>
        </div>
      )}
    </ProLayout>
  );
}
