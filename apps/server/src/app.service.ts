import { Injectable } from '@nestjs/common';
import { Room } from 'livekit-server-sdk';
import { LivekitService } from './livekit/service';

@Injectable()
export class AppService {
  constructor(private livekit: LivekitService) {}

  async listRooms(): Promise<Room[]> {
    const rooms = await this.livekit.client.listRooms();
    return rooms;
  }
}
