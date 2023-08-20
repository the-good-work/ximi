import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  RawBodyRequest,
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

const createRoomSchema = Yup.object({
  roomName: Yup.string().required().max(10).min(2),
  passcode: Yup.string().max(5).min(5),
})
  .required()
  .noUnknown();

@Controller()
export class AppController {
  constructor(private livekit: LivekitService) {}

  @Get('rooms')
  async listRooms(): Promise<Room[]> {
    return await this.livekit.client.listRooms();
  }

  @Post('room')
  @UsePipes(new YupValidationPipe(createRoomSchema))
  @ApiBody(yupToOpenAPISchema(createRoomSchema))
  async createRoom(
    @Body() body: Yup.InferType<typeof createRoomSchema>,
  ): Promise<Room> {
    return await this.livekit.client.createRoom({
      name: body.roomName,
    });
  }

  @Post('token/:roomName/:identity')
  async generateToken(@Param() params: any): Promise<string> {
    const { roomName, identity } = params;
    return this.livekit.generateTokenForRoom(roomName, identity);
  }

  @Post('livekit/webhook')
  async handleWebhooks(@Req() req: RawBodyRequest<Request>) {
    const raw = req.rawBody;
    const event = this.livekit.webhookReceiver.receive(
      raw.toString(),
      req.get('Authorization'),
    );

    console.log(event);
  }
}
