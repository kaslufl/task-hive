import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('/sign-up (GET)', () => {
    return request(app.getHttpServer())
      .post('/sign-up')
      .send({ email: 'test@email.com', password: 'test', name: 'John Doe' })
      .expect(HttpStatus.CREATED);
  });

  it('/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@email.com', password: 'test' })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });
});
