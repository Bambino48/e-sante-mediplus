import { useState } from "react";
import { triageSymptoms, getRecommendations } from "../../api/ai.js";
import { useAIStore } from "../../store/aiStore.js";
import AIChatCard from "../../components/AIChatCard.jsx";
import RecommendationList from "../../components/RecommendationList.jsx";

export default function Triage() {
    const [messages, setMessages] = useState([
        { role: "ai", content: "Bonjour 👋 ! Décrivez brièvement vos symptômes pour que je vous oriente." },
    ]);
    const [input, setInput] = useState("");
    const { triage, recommendations, setTriage, setRecommendations } = useAIStore();

    const send = async () => {
        if (!input.trim()) return;
        const userMsg = { role: "user", content: input };
        setMessages((m) => [...m, userMsg]);
        setInput("");
        const aiRes = await triageSymptoms(input);
        setTriage(aiRes);
        setMessages((m) => [
            ...m,
            { role: "ai", content: `🩺 ${aiRes.triage}\n\n👉 ${aiRes.recommendation}` },
        ]);

        // suggestions pro ou pharmacie selon gravité
        const recType = aiRes.urgency === "haute" ? "doctor" : "pharmacy";
        const rec = await getRecommendations(recType);
        setRecommendations(rec.items);
    };

    return (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold">Assistant IA — Triage Symptômes</h1>
            <AIChatCard messages={messages} />
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send();
                }}
                className="flex gap-2"
            >
                <input
                    className="input flex-1"
                    placeholder="Ex: j’ai de la fièvre et je tousse"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn-primary">Envoyer</button>
            </form>

            {triage && (
                <div className="card">
                    <div className="text-sm text-slate-500 mb-1">Recommandations proches</div>
                    <RecommendationList items={recommendations} type="doctor" />
                </div>
            )}
        </main>
    );
}
