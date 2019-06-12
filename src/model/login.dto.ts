/**
 * classe de login utilizado como body para requisição HTTP
 */
export class LoginDto {
  login: {
    email: string;
    password: string;
  }
}

/**
 * Classe utilizada na resposta do login
 */
export class LoginRes {
  token: string;
  exp: string;
  username: string
}
