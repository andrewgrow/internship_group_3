import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('GET / (main page)', () => {
    it('Should return 404 because not implemented yet', () => {
      return request(app.getHttpServer()).get('/').expect(404).expect({
        statusCode: 404,
        message: 'Cannot GET /',
        error: 'Not Found',
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
