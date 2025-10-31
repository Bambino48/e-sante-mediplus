// Simple signalling basé sur BroadcastChannel (fonctionne entre onglets du même domaine)
// Remplacez plus tard par Socket.io / Pusher / Ably pour un vrai backend.


export class LocalSignaling {
    constructor(roomId) {
        this.roomId = roomId;
        this.channel = new BroadcastChannel(`teleconsult-${roomId}`);
    }
    onMessage(cb) {
        this.channel.onmessage = (e) => cb(e.data);
    }
    send(msg) {
        this.channel.postMessage(msg);
    }
    close() {
        this.channel.close();
    }
}