import { Injectable } from '@nestjs/common';
import {
  RoomServiceClient,
  WebhookReceiver,
  AccessToken,
  Room,
} from 'livekit-server-sdk';

@Injectable()
export class LivekitService {
  client: RoomServiceClient;
  webhookReceiver: WebhookReceiver;

  constructor() {
    this.client = new RoomServiceClient(
      process.env.LIVEKIT_HOST,
      process.env.LIVEKIT_KEY,
      process.env.LIVEKIT_SECRET,
    );

    this.webhookReceiver = new WebhookReceiver(
      process.env.LIVEKIT_KEY,
      process.env.LIVEKIT_SECRET,
    );
  }

  async getRoom(roomName: string): Promise<Room[]> {
    return this.client.listRooms([roomName]);
  }

  generateTokenForRoom(roomName: string, participantIdentity: string): string {
    const at = new AccessToken(
      process.env.LIVEKIT_KEY,
      process.env.LIVEKIT_SECRET,
      { identity: participantIdentity },
    );
    at.addGrant({ roomJoin: true, room: roomName });
    const token = at.toJwt();
    return token;
  }
}
