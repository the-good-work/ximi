import { BadRequestException, Injectable } from '@nestjs/common';
import { XimiParticipantState, XIMIRole, XimiRoomState } from 'ximi-types';
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

  async generateTokenForRoom(
    roomName: string,
    participantIdentity: string,
    role: XIMIRole,
  ): Promise<string> {
    try {
      const [room] = await this.getRoom(roomName);

      if (room === undefined) {
        throw new Error('room does not exist');
      }

      const roomMeta = JSON.parse(room.metadata) as XimiRoomState;

      // check if user already has state
      //
      const initialParticipantState: XimiParticipantState = roomMeta.presets[
        roomMeta.activePreset
      ].participants[participantIdentity]?.state || {
        role,
        audio: { mute: [], delay: 0 },
        video: { layout: undefined, name: 'Auto' },
        textPoster: '',
      };

      const at = new AccessToken(
        process.env.LIVEKIT_KEY,
        process.env.LIVEKIT_SECRET,
        {
          identity: participantIdentity,
          metadata: JSON.stringify(initialParticipantState),
        },
      );
      at.addGrant({
        roomJoin: true,
        room: roomName,
        canPublish: role === 'OUTPUT' ? false : true,
      });
      const token = at.toJwt();
      return token;
    } catch (err) {
      console.warn(err);
      throw new BadRequestException('Room has no metadata');
    }
  }
}
