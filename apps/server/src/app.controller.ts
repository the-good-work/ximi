import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  RawBodyRequest,
  NotFoundException,
  Req,
  UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { Room } from 'livekit-server-sdk';
import { LivekitService } from './livekit/service';
import * as Yup from 'yup';
import { ApiBody } from '@nestjs/swagger';
import { yupToOpenAPISchema } from './util/yup-to-openapi-schema';
import { YupValidationPipe } from './util/yup.pipe';
import { createRoomSchema } from 'validation-schema';

@Controller()
export class AppController {
  constructor(private livekit: LivekitService) {}

  @Get('room/:roomName/exists')
  async getRoomExists(
    @Param() { roomName }: { roomName: string },
  ): Promise<boolean> {
    const _rooms = await this.livekit.getRoom(roomName.toUpperCase());

    if (_rooms.length < 1) {
      return false;
    } else {
      return true;
    }
  }

  @Get('rooms')
  async listRooms(): Promise<Room[]> {
    const rooms = await this.livekit.client.listRooms();
    return rooms.map((room) => {
      let metaWithoutPasscode: unknown;
      try {
        const _m = JSON.parse(room.metadata);
        if (_m.passcode) {
          delete _m.passcode;
        }
        metaWithoutPasscode = _m;
      } catch (err) {
        metaWithoutPasscode = {};
      }
      return { ...room, metadata: JSON.stringify(metaWithoutPasscode) };
    });
  }

  @Post('room')
  @UsePipes(new YupValidationPipe(createRoomSchema))
  @ApiBody(yupToOpenAPISchema(createRoomSchema))
  async createRoom(
    @Body() body: Yup.InferType<typeof createRoomSchema>,
  ): Promise<Room> {
    return await this.livekit.client.createRoom({
      name: body.roomName.toUpperCase(),
      metadata: JSON.stringify({
        passcode: body.passcode,
      }),
    });
  }

  @Get('room/:roomName/identity/:identity/exists')
  async identityExistsInRoom(
    @Param() params: { roomName: string; identity: string },
  ): Promise<boolean> {
    const { roomName, identity } = params;
    const participantsInRoom = await this.livekit.client.listParticipants(
      roomName,
    );
    return participantsInRoom.reduce((p, c) => {
      if (p === true) {
        return p;
      }
      return c.identity === identity;
    }, false);
  }

  @Post('token/:roomName/:identity')
  async generateToken(@Param() params: any): Promise<string> {
    const { roomName, identity } = params;
    const _room = await this.livekit.client.listRooms([roomName]);
    if (_room.length < 1) {
      throw new NotFoundException('Room not found');
    }
    return this.livekit.generateTokenForRoom(roomName, identity);
  }

  @Post('livekit/webhook')
  async handleWebhooks(@Req() req: RawBodyRequest<Request>) {
    const raw = req.body;
    if (raw) {
      const event = this.livekit.webhookReceiver.receive(
        raw.toString('utf8'),
        req.get('Authorization'),
      );
      console.log({ event });
    } else {
      console.warn('didnt parse');
    }
  }
}
