import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  RawBodyRequest,
  Req,
  UsePipes,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { Room } from 'livekit-server-sdk';
import { LivekitService } from './livekit/service';
import * as Yup from 'yup';
import { ApiBody } from '@nestjs/swagger';
import { yupToOpenAPISchema } from './util/yup-to-openapi-schema';
import { YupValidationPipe } from './util/yup.pipe';
import { createRoomSchema, joinRoomSchema } from 'validation-schema';
import { config } from 'dotenv';
import {
  SetPresetNameAction,
  SwitchActivePresetAction,
  XimiRoomState,
} from 'ximi-types';

config();

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
  @UsePipes(new YupValidationPipe(createRoomSchema(process.env.HOST)))
  @ApiBody(yupToOpenAPISchema(createRoomSchema(process.env.HOST)))
  async createRoom(
    @Body() body: Yup.InferType<ReturnType<typeof createRoomSchema>>,
  ): Promise<Room> {
    const initialMeta: XimiRoomState = {
      passcode: body.passcode,
      activePreset: 0,
      presets: new Array(12).fill(0).map((_, n) => ({
        participants: {},
        name: `PRESET${n + 1}`,
      })),
    };
    return await this.livekit.client.createRoom({
      name: body.roomName.toUpperCase(),
      metadata: JSON.stringify(initialMeta),
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

  @Post('room/token/control')
  @UsePipes(new YupValidationPipe(joinRoomSchema()))
  @ApiBody(yupToOpenAPISchema(joinRoomSchema()))
  async generateControlToken(
    @Body() body: Yup.InferType<ReturnType<typeof joinRoomSchema>>,
  ): Promise<{ token: string }> {
    const { identity, passcode, roomName } = body;

    // check room exists first
    const room = await this.livekit.getRoom(roomName);
    if (room.length < 1) {
      throw new NotFoundException('Room not found');
    }

    try {
      const { passcode: actualPasscode } = JSON.parse(room[0].metadata) as {
        passcode: string;
      };

      if (passcode !== actualPasscode) {
        throw new UnauthorizedException('Incorrect passcode');
      }
    } catch (err) {
      throw err;
    }

    return {
      token: this.livekit.generateTokenForRoom(roomName, identity, 'CONTROL'),
    };
  }

  @Post('room/identity/check')
  async checkIdentityAvailableForRoom(
    @Body() body: { identity: string; roomName: string },
  ): Promise<{ ok: boolean }> {
    const { roomName, identity } = body;
    const participants = await this.livekit.client.listParticipants(roomName);

    const existingParticipantIdentities = participants.map((p) => p.identity);
    return { ok: existingParticipantIdentities.indexOf(identity) < 0 };
  }

  @Post('room/passcode/check')
  async checkPasscodeForRoom(
    @Body() body: { passcode: string; roomName: string },
  ): Promise<{ ok: boolean }> {
    const { roomName, passcode } = body;
    const room = await this.livekit.getRoom(roomName);
    console.log(1, { room });
    if (room.length < 1) {
      throw new NotFoundException('Room not found');
    }

    try {
      const metadata = JSON.parse(room[0].metadata) as XimiRoomState;
      return { ok: metadata.passcode === passcode };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  @Post('room/token/performer')
  @UsePipes(new YupValidationPipe(joinRoomSchema()))
  @ApiBody(yupToOpenAPISchema(joinRoomSchema(), 'Generate a performer token'))
  async generatePerformerToken(
    @Body() body: Yup.InferType<ReturnType<typeof joinRoomSchema>>,
  ): Promise<{ token: string }> {
    const { identity, passcode, roomName } = body;

    // check room exists first
    const room = await this.livekit.getRoom(roomName);
    if (room.length < 1) {
      throw new NotFoundException('Room not found');
    }

    try {
      const { passcode: actualPasscode } = JSON.parse(room[0].metadata) as {
        passcode: string;
      };

      if (passcode !== actualPasscode) {
        throw new UnauthorizedException('Incorrect passcode');
      }
    } catch (err) {
      throw err;
    }

    return {
      token: this.livekit.generateTokenForRoom(roomName, identity, 'PERFORMER'),
    };
  }

  @Patch('room/state')
  async updateRoomState(
    @Body() body: SwitchActivePresetAction | SetPresetNameAction,
  ) {
    const { type, roomName } = body;

    const room = await this.livekit.getRoom(roomName);

    if (room.length < 1) {
      throw new NotFoundException('Room not found');
    }

    try {
      const metadata = JSON.parse(room[0].metadata) as XimiRoomState;

      //TODO: make a Yup validation schema for this to make sure updates are always correct

      switch (type) {
        case 'set-active-preset': {
          const { activePreset } = body;

          this.livekit.client.updateRoomMetadata(
            roomName,
            JSON.stringify(Object.assign(metadata, { activePreset })),
          );
          break;
        }

        case 'set-preset-name': {
          const { preset, name } = body;
          const update = { ...metadata };
          update.presets[preset].name = name;

          this.livekit.client.updateRoomMetadata(
            roomName,
            JSON.stringify(update),
          );
          break;
        }
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
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
