import { OAuthPort } from "./auth.port";
import jwksClient from "jwks-rsa";
import jwt, { GetPublicKeyOrSecret, VerifyOptions } from "jsonwebtoken";

export interface Auth0Config {
  issuerBaseURL: string;
  audience: string;
}

export class Auth0Adapter implements OAuthPort {
  constructor(private config: Auth0Config) {}

  verifyToken(token: string) {
    return new Promise<boolean>((resolve) => {
      const validationOptions: VerifyOptions = { audience: this.config.audience, issuer: this.config.issuerBaseURL };
      jwt.verify(token, this.getKey, validationOptions, (err) => {
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }

  getKey: GetPublicKeyOrSecret = (header, callback) => {
    const jwksUri = new URL("/.well-known/jwks.json", this.config.issuerBaseURL).toString();
    const client = jwksClient({
      jwksUri,
    });
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  };
}
