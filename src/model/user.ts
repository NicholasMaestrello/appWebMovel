/**
 * Classe utilizada como body da requisição de criação e edição do usuario
 */
export class UserDTO {
  user: User;
}

// Classe contendo as informações padrões do usuario
export class User {
  name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  document: string;
  birthdate: string;
  city: string;
  street_name: string;
  state: string;
  street_number: string;
  apartment: string;
  neighborhood: string;
  zipcode: string;
  telephone?: string;
  cell_phone?: string;

  public constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}
