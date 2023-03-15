import { OAuthPort } from "./auth.port";
import jwksClient from "jwks-rsa";
import jwt, { GetPublicKeyOrSecret } from "jsonwebtoken";

export interface Auth0Config {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
}

export class Auth0Adapter implements OAuthPort {
  constructor(private config: Auth0Config) {}

  verifyToken(token: string) {
    return new Promise<boolean>((resolve) => {
      const validationOptions = { audience: this.config.issuer, issuer: this.config.issuer };
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
    const client = jwksClient({
      jwksUri: this.config.jwks_uri,
    });
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  };
}
