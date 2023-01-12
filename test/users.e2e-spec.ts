import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../src/users/users.module';

describe('Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('GET /users', () => {
    describe('Check JWT protection', () => {
      describe('all routes will return 403', () => {
        const bodyError = {
          statusCode: 403,
          message:
            'VerifyRequestHeaders fail. You forgot add Auth Bearer token?',
        };
        it('GET /users should be protected!', () => {
          return request(app.getHttpServer())
            .get('/users')
            .expect(403)
            .expect(bodyError);
        });
        it('GET /users/{id} should be protected!', () => {
          return request(app.getHttpServer())
            .get('/users/{id}')
            .expect(403)
            .expect(bodyError);
        });
        it('PATCH /users/{id} should be protected!', () => {
          return request(app.getHttpServer())
            .patch('/users/{id}')
            .expect(403)
            .expect(bodyError);
        });
        it('DELETE /users/{id} should be protected!', () => {
          return request(app.getHttpServer())
            .delete('/users/{id}')
            .expect(403)
            .expect(bodyError);
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
