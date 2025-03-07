import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { NextRequest, NextResponse } from 'next/server';

// Store active pixel data in memory (would be replaced with a proper database in production)
type PixelData = {
  x: number;
  y: number;
  color: string;
  user: string;
  timestamp: number;
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

// Track active users and pixels placed
let activeUsers = 0;
let pixelsPlaced = 0;
const recentPixels: PixelData[] = [];

export function GET(req: NextRequest) {
  // This isn't a standard HTTP endpoint 
  // Return a simple message for any HTTP requests
  return NextResponse.json({ message: 'Socket.io server' });
}

export async function POST(req: NextRequest) {
  const { res }: any = req;
  
  if (res.socket.server.io) {
    // Socket.io server already running
    return NextResponse.json({ message: 'Socket.io already running' });
  }

  const io = new SocketIOServer(res.socket.server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Store the io instance on the server object
  res.socket.server.io = io;

  // Socket.io connection handler
  io.on('connection', (socket) => {
    // Update active users count
    activeUsers++;
    io.emit('userCount', activeUsers);
    io.emit('pixelCount', pixelsPlaced);
    
    // Send recent pixel updates to the new user
    socket.emit('recentPixels', recentPixels);

    // Handle pixel placement
    socket.on('placePixel', (data: { x: number; y: number; color: string }) => {
      // In a real app, verify user auth and cooldown here
      
      // Create pixel data with timestamp and user ID
      const pixelData: PixelData = {
        ...data,
        user: socket.id,
        timestamp: Date.now(),
      };
      
      // Add to recent pixels (limit to last 100 changes)
      recentPixels.unshift(pixelData);
      if (recentPixels.length > 100) {
        recentPixels.pop();
      }
      
      // Increment pixels placed count
      pixelsPlaced++;
      
      // Broadcast the pixel update to all clients
      io.emit('pixelUpdate', pixelData);
      io.emit('pixelCount', pixelsPlaced);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      activeUsers--;
      io.emit('userCount', activeUsers);
    });
  });

  return NextResponse.json({ message: 'Socket.io server started' });
} 