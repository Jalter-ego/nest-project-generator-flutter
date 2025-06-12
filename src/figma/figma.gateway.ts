import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FigmaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Estado actual del canvas por roomId
  private canvasStates: Record<string, any> = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);

    // Enviar el estado actual del canvas si existe
    const currentState = this.canvasStates[roomId];
    if (currentState) {
      client.emit('canvas-updated', currentState);
    }
  }

  @SubscribeMessage('update-canvas')
  handleUpdateCanvas(client: Socket, payload: { roomId: string; data: any }) {
    const { roomId, data } = payload;

    // Guardar nuevo estado
    this.canvasStates[roomId] = data;

    // Enviar actualización a los demás clientes en la sala
    client.to(roomId).emit('canvas-updated', data);
  }
}