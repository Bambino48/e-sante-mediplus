// src/components/PrescriptionCard.jsx
import { QRCodeSVG } from "qrcode.react";

export default function PrescriptionCard({ prescription }) {
    const { id, created_at, pdf_url, qr_data, medications = [] } = prescription || {};
    return (
        <div className="card">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-sm text-slate-500">Ordonnance</div>
                    <div className="font-semibold">#{id?.slice(0, 8)}</div>
                    <div className="text-sm text-slate-500">Émise le {new Date(created_at).toLocaleString()}</div>
                </div>
                <div className="grid place-items-center">
                    <QRCodeSVG value={qr_data || id || ""} size={96} />
                    <a href={pdf_url} target="_blank" rel="noreferrer" className="mt-2 btn-secondary text-xs">
                        Télécharger le PDF
                    </a>
                </div>
            </div>

            <div className="mt-4">
                <div className="text-sm font-medium mb-2">Médicaments</div>
                <ul className="space-y-2">
                    {medications.map((m) => (
                        <li key={m.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3">
                            <div className="font-medium">{m.name}</div>
                            <div className="text-sm text-slate-500">
                                {m.dosage} • {m.frequency}/j • {m.duration_days} j
                            </div>
                            {m.instructions && <div className="text-sm mt-1">{m.instructions}</div>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
