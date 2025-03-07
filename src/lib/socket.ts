import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (!socket) {
    // Connect to the socket server
    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socketio',
    });

    // Log connection status
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Socket event handlers
export const onPixelUpdate = (callback: (data: any) => void) => {
  const socket = getSocket();
  socket.on('pixelUpdate', callback);
  return () => socket.off('pixelUpdate', callback);
};

export const onUserCountUpdate = (callback: (count: number) => void) => {
  const socket = getSocket();
  socket.on('userCount', callback);
  return () => socket.off('userCount', callback);
};

export const placePixel = (pixelData: { x: number; y: number; color: string }) => {
  const socket = getSocket();
  socket.emit('placePixel', pixelData);
}; 