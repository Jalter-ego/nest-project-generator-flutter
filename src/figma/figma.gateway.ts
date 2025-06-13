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
  handleJoinRoom(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload;
    client.join(roomId);
    console.log(`🚪 Cliente ${client.id} se unió a la sala ${roomId}`);

    const currentState = this.canvasStates[roomId];
    if (currentState) {
      console.log(`📤 Enviando estado actual del canvas a ${client.id}`);
      client.emit('canvas-updated', currentState);
    }
  }

  @SubscribeMessage('update-canvas')
  handleUpdateCanvas(client: Socket, payload: { roomId: string; data: any }) {
    const { roomId, data } = payload;

    // Guardar nuevo estado
    console.log(`📩 Recibido update-canvas de ${client.id} en sala ${roomId}`, data);
    this.canvasStates[roomId] = data;

    // Enviar actualización a los demás clientes en la sala

    console.log(`📡 Enviando canvas-updated a otros clientes en sala ${roomId}`);
    client.to(roomId).emit('canvas-updated', data);
  }
}