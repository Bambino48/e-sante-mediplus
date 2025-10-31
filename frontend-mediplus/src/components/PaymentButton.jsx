import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { checkoutPayment } from "../api/payments.js";

export default function PaymentButton({ appointmentId, patientId, doctorId, amount }) {
    const [provider, setProvider] = useState("stripe");
    const mutation = useMutation({
        mutationFn: checkoutPayment,
        onSuccess: ({ payment }) => {
            toast.success("Paiement réussi 💳");
            window.open(payment.invoice.pdf_url, "_blank");
        },
        onError: (e) => toast.error(e.message || "Erreur de paiement"),
    });

    const pay = () => {
        mutation.mutate({
            appointment_id: appointmentId,
            patient_id: patientId,
            doctor_id: doctorId,
            amount_cents: amount * 100,
            provider,
        });
    };

    return (
        <div className="card space-y-3">
            <div className="text-sm text-slate-500">Mode de paiement</div>
            <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="input w-full"
            >
                <option value="stripe">💳 Stripe</option>
                <option value="paypal">💰 PayPal</option>
                <option value="moneyfusion">📱 MoneyFusion</option>
            </select>
            <button
                className="btn-primary w-full"
                disabled={mutation.isPending}
                onClick={pay}
            >
                {mutation.isPending ? "Paiement..." : "Payer maintenant"}
            </button>
        </div>
    );
}
