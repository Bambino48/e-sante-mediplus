// src/pages/pro/Teleconsult.jsx
// Salle vidéo simplifiée (mock Agora/WebRTC)
import { useState } from "react";

export default function Teleconsult() {
    const [connected, setConnected] = useState(false);

    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Salle de téléconsultation</h1>

            {!connected ? (
                <div className="card grid place-items-center py-20">
                    <button
                        className="btn-primary"
                        onClick={() => setConnected(true)}
                    >
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
                        <button
                            className="btn-danger"
                            onClick={() => setConnected(false)}
                        >
                            ❌ Terminer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
