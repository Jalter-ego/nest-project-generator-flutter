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

  private get defaultScreen() {
    return {
      id: 'default',
      name: 'Default Screen',
      elements: [],
    };
  }

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
        select: { editKey: true, userId: true, screens: true },
      });

      if (!project) {
        client.emit('access-denied', { message: 'Project not found' });
        console.log(`🚫 Cliente ${client.id} denegado en sala ${roomId}: Proyecto no encontrado`);
        return;
      }

      console.log(`🔍 Validando acceso para cliente ${client.id} en sala ${roomId}`, {
        userId,
        editKey: editKey || 'none',
        projectUserId: project.userId,
        projectEditKey: project.editKey || 'none',
      });

      if (userId && project.userId === userId) {
        console.log(`✅ Cliente ${client.id} es el dueño del proyecto ${roomId}`);
      } else {
        if (!project.editKey) {
          client.emit('access-denied', { message: 'Project has no edit key configured' });
          console.log(`🚫 Cliente ${client.id} denegado en sala ${roomId}: Proyecto sin editKey`);
          return;
        }
        if (!editKey || project.editKey !== editKey) {
          client.emit('access-denied', { message: 'Invalid or missing edit key' });
          console.log(`🚫 Cliente ${client.id} denegado en sala ${roomId}: editKey inválido`, {
            providedEditKey: editKey || 'none',
            expectedEditKey: project.editKey,
          });
          return;
        }
      }

      client.join(roomId);
      console.log(`🚪 Cliente ${client.id} se unió a la sala ${roomId}`);

      if (!this.canvasStates[roomId]) {
        console.log(`📦 Inicializando canvas state para sala ${roomId}`);
        this.canvasStates[roomId] = Array.isArray(project.screens) && project.screens.length > 0
          ? project.screens
          : [this.defaultScreen];
      }

      const currentState = this.canvasStates[roomId];
      console.log(`📤 Enviando estado actual del canvas a ${client.id}`, currentState);
      client.emit('canvas-updated', currentState);

      client.emit('access-granted', { message: 'Joined project successfully' });
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
      client.emit('access-denied', { message: 'Server error' });
    }
  }

  @SubscribeMessage('update-canvas')
  handleUpdateCanvas(client: Socket, payload: { roomId: string; data: any }) {
    const { roomId, data } = payload;

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`🚫 Ignorando update-canvas inválido para sala ${roomId}`, data);
      return;
    }

    console.log(`📩 Recibido update-canvas de ${client.id} en sala ${roomId}`, data);
    this.canvasStates[roomId] = data;

    console.log(`📡 Enviando canvas-updated a otros clientes en sala ${roomId}`);
    client.to(roomId).emit('canvas-updated', data);
  }
}