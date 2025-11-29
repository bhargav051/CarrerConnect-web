import io from 'socket.io-client';
import { BASE_URL } from './constants';

export const createSocketConnection = () => {
    const token = localStorage.getItem('token'); // fetch token from localStorage application
    console.log("Creating socket connection with token:", token);
    return io(BASE_URL, {
        auth: {
            token: token,
        },
        withCredentials: true,
    });
};