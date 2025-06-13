import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

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
  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    client: Socket,
    payload: { roomId: string; editKey: string; userId?: string },
  ) {
    const { roomId, editKey, userId } = payload;

    try {
      const project = await this.prisma.project.findUnique({
        where: { id: roomId },
        select: { editKey: true, userId: true },
      });

      if (!project) {
        client.emit('access-denied', { message: 'Project not found' });
        console.log(
          `🚫 Cliente ${client.id} denegado en sala ${roomId}: Proyecto no encontrado`,
        );
        return;
      }

      // validacion para saber si el usuario es el dueño
      if (userId && project.userId === userId) {
        console.log(
          `✅ Cliente ${client.id} es el dueño del proyecto ${roomId}`,
        );
      } else if (project.editKey !== editKey) {
        client.emit('access-denied', { message: 'Invalid edit key' });
        console.log(
          `🚫 Cliente ${client.id} denegado en sala ${roomId}: editKey inválido`,
        );
        return;
      }

      // Join room if authorized
      client.join(roomId);
      console.log(`🚪 Cliente ${client.id} se unió a la sala ${roomId}`);

      const currentState = this.canvasStates[roomId];
      if (currentState) {
        console.log(`📤 Enviando estado actual del canvas a ${client.id}`);
        client.emit('canvas-updated', currentState);
      }

      client.emit('access-granted', { message: 'Joined project successfully' });
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
      client.emit('access-denied', { message: 'Server error' });
    }
  }

  @SubscribeMessage('update-canvas')
  handleUpdateCanvas(client: Socket, payload: { roomId: string; data: any }) {
    const { roomId, data } = payload;

    // Guardar nuevo estado
    console.log(
      `📩 Recibido update-canvas de ${client.id} en sala ${roomId}`,
      data,
    );
    this.canvasStates[roomId] = data;

    // Enviar actualización a los demás clientes en la sala

    console.log(
      `📡 Enviando canvas-updated a otros clientes en sala ${roomId}`,
    );
    client.to(roomId).emit('canvas-updated', data);
  }
}
