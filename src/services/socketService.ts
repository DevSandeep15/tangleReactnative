import { io, Socket } from 'socket.io-client';

const BASE_URL = 'https://tangle-asy7.onrender.com';

class SocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) {
            console.log('--- Socket already connected ---');
            return;
        }

        console.log('--- Connecting to Socket ---', BASE_URL);

        this.socket = io(BASE_URL, {
            auth: {
                token: token
            },
            extraHeaders: {
                Authorization: token
            },
            transports: ['websocket'], // Recommended for React Native
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
            console.log('--- Socket Connected --- ID:', this.socket?.id);
        });

        this.socket.on('disconnect', (reason) => {
            console.log('--- Socket Disconnected --- Reason:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.log('--- Socket Connection Error ---', error.message);
        });
    }

    disconnect() {
        if (this.socket) {
            console.log('--- Disconnecting Socket ---');
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event: string, data: any) {
        if (this.socket) {
            this.socket.emit(event, data);
        } else {
            console.warn(`--- Socket not connected. Cannot emit ${event} ---`);
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (this.socket) {
            this.socket.on(event, callback);
        } else {
            console.warn(`--- Socket not connected. Cannot listen to ${event} ---`);
        }
    }

    off(event: string, callback?: (data: any) => void) {
        if (this.socket) {
            if (callback) {
                this.socket.off(event, callback);
            } else {
                this.socket.off(event);
            }
        }
    }

    getSocket() {
        return this.socket;
    }
}

const socketService = new SocketService();
export default socketService;
