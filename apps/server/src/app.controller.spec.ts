import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LivekitService } from './livekit/service';

describe('AppController', () => {
  let appController: AppController;

  /*
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
	*/

  describe('no test', () => {
    it('placeholder', async () => {
      expect('haha').toBe('haha');
    });
  });
});
