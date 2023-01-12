import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { User } from '../src/users/users.schema';
import { CreateUserDto } from '../src/security/auth/dto/create.dto';
import { AppJwtService } from '../src/security/jwt/app.jwt.service';
import { AppJwtData } from '../src/security/jwt/app.jwt.data';
import { AuthModule } from '../src/security/auth/auth.module';

describe('Users Routes', () => {
  let app: INestApplication;
  let appJwtService: AppJwtService;

  const userDto: CreateUserDto = {
    email: 'test1@example.com',
    firstName: 'First1',
    lastName: 'Last1',
    password: 'Qwerty1234',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    const contextId = ContextIdFactory.create();
    jest
      .spyOn(ContextIdFactory, 'getByRequest')
      .mockImplementation(() => contextId);
    appJwtService = await moduleRef.resolve(AppJwtService, contextId);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Sign Up flow', () => {
    it('should be success registered', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign_up')
        .send(userDto)
        .expect(201);

      const responseUser: User = response.body as User;
      expect(responseUser['_id']).toHaveLength(24);
    });
  });

  describe('Sign In flow', () => {
    it('should be success authorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign_in')
        .send({
          email: userDto.email,
          password: userDto.password,
        })
        .expect(200);

      const responseToken: string = JSON.parse(response.text).jwtToken;
      expect(responseToken.length).toBeGreaterThan(24);

      const userJwtData: AppJwtData = appJwtService.verifyToken(responseToken);

      // delete user to clear database during closing the test
      return request(app.getHttpServer())
        .delete(`/users/${userJwtData.id}`)
        .auth(responseToken, { type: 'bearer' })
        .expect(200);
    });
  });
});
