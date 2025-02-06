import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a user with the correct properties', () => {
    const user = new User(1, 'John Doe', 'john.doe@example.com', 'password123');
    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('password123');
  });
});
