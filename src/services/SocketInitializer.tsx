import React, { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import socketService from './socketService';

const SocketInitializer: React.FC = () => {
    const { token, isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && token) {
            console.log('--- Auth detected, initializing socket ---');
            console.log('Token at App:', token);
            socketService.connect(token);
        } else {
            console.log('--- No auth, disconnecting socket ---');
            socketService.disconnect();
        }

        return () => {
            // Optional: Don't disconnect on unmount if you want it to stay alive across screens
            // unless the app is closing or user logs out. 
            // Since this component will be at the root, it only unmounts when the app closes.
        };
    }, [isAuthenticated, token]);

    return null; // This component doesn't render anything
};

export default SocketInitializer;
