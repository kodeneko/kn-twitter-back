import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { DbErrorFilter } from '../common/filters/db-error-filter.filter';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mongoUri: string;
  let createdId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        ParseObjectIdPipe,
        {
          provide: DbErrorFilter,
          useValue: {
            catch: jest.fn((err, host) => {
              throw err; // Re-throw for simple test flow, adjust if you handle errors.
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false }),
    );
    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    await app.close();
  });

  beforeEach(async () => {
    // Limpia base antes de cada test
    await mongoose.connection.dropDatabase();
  });

  describe('POST /users', () => {
    it('should create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'usuario', email: 'test@a.com' })
        .expect(201);
      expect(res.body._id).toBeDefined();
      expect(res.body.username).toBe('usuario');
      expect(res.body.email).toBe('test@a.com');
      createdId = res.body._id;
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      // Prepara un usuario
      await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'findall', email: 'all@a.com' });

      const res = await request(app.getHttpServer()).get('/users').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].username).toBe('findall');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const create = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'single', email: 'one@a.com' });

      const userId = create.body._id;
      const res = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);
      expect(res.body).toBeDefined();
      expect(res.body.username).toBe('single');
      expect(res.body.email).toBe('one@a.com');
    });
  });

  describe('PUT /users', () => {
    it('should update a user', async () => {
      // Crea primero
      const create = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'old', email: 'old@user.com' });

      const id = create.body._id;
      const res = await request(app.getHttpServer())
        .put('/users')
        .send({ _id: id, username: 'updated', email: 'old@user.com' })
        .expect(200);
      expect(res.body.username).toBe('updated');
      expect(res.body.email).toBe('old@user.com');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      // Crea primero
      const create = await request(app.getHttpServer())
        .post('/users')
        .send({ username: 'todelete', email: 'delete@me.com' });

      const id = create.body._id;

      await request(app.getHttpServer()).delete(`/users/${id}`).expect(200);

      // Asegura que ya no existe
      await request(app.getHttpServer())
        .get(`/users/${id}`)
        .expect(200)
        .expect('');
    });
  });
});
