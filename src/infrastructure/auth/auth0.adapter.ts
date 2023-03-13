import { OAuthPort } from "./auth.port";

export class Auth0Adapter implements OAuthPort {
  constructor() {}

  async verifyToken(token: string) {
    return false;
  }
}
