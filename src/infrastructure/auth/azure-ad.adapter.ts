import { OAuthPort } from "./auth.port";

export class AzureADAdapter implements OAuthPort {
  constructor() {}

  async verifyToken(token: string) {
    return false;
  }
}
