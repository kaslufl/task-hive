export class User {
  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
