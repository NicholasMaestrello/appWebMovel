export class LoginDto {
  login: {
    email: string;
    password: string;
  }
}

export class LoginRes {
  token: string;
  exp: string;
  username: string
}
