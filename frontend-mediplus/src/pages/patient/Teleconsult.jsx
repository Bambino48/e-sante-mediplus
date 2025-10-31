import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VideoRoom from "../../components/VideoRoom.jsx";
import ChatThread from "../../components/ChatThread.jsx";
import { startTeleconsult } from "../../api/teleconsultations.js";

export default function Teleconsult() {
    const { roomId } = useParams();


    const { data, isLoading } = useQuery({
        queryKey: ["teleconsult", roomId],
        queryFn: () => startTeleconsult(roomId),
    });


    if (isLoading) return <main className="max-w-5xl mx-auto px-4 py-8"><div className="card py-16 text-center">Initialisation de la salle…</div></main>;


    return (
        <main className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <VideoRoom roomId={data.room_id} />
                </div>
                <div className="lg:col-span-1">
                    <ChatThread roomId={data.room_id} />
                </div>
            </div>
        </main>
    );
}