import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('UsersService (with in-memory DB)', () => {
  let service: UsersService;
  let mongod: MongoMemoryServer;
  let module: TestingModule;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri: string = mongod.getUri();

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    // await mongoose.connection.collections['users'].deleteMany({});
  });

  it('should create a user', async () => {
    const user = await service.create({
      username: 'Usuario',
      email: 'a@b.com',
    });
    expect(user.username).toBe('Usuario');
    expect(user.email).toBe('a@b.com');
    expect(user._id).toBeDefined();
  });

  it('should find all users', async () => {
    await service.create({ username: 'Segundo', email: 'x@y.com' });
    const users = await service.findAll({ skip: 0, limit: 10 });
    expect(users.length).toBe(1);
    expect(users[0].username).toBe('Segundo');
  });

  it('should find one user', async () => {
    const user: UserDocument = await service.create({
      username: 'Tercero',
      email: 'z@z.com',
    });
    const found = await service.findOne(user._id.toString());
    expect(found).not.toBeNull();
    expect(found?.email).toBe('z@z.com');
  });

  it('should update a user', async () => {
    const user = await service.create({ username: 'Old', email: 'old@x.com' });
    const updated = await service.update({
      _id: user._id.toString(),
      username: 'New',
    });
    expect(updated?.username).toBe('New');
  });

  it('should delete a user', async () => {
    const user = await service.create({
      username: 'DeleteMe',
      email: 'del@me.com',
    });
    const deleted = await service.delete(user._id.toString());
    expect(deleted?._id.toString()).toBe(user._id.toString());
    const notFound = await service.findOne(user._id.toString());
    expect(notFound).toBeNull();
  });
});
