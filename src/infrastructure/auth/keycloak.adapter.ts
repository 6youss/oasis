import { OAuthPort } from "./auth.port";
import jwksClient from "jwks-rsa";
import jwt, { GetPublicKeyOrSecret, VerifyOptions } from "jsonwebtoken";
export interface KeycloakConfig {
  issuer: string;
  audience: string;
  jwksUri: string;
}

export class KeycloakAdapter implements OAuthPort {
  constructor(private config: KeycloakConfig) {}

  verifyToken(token: string) {
    return new Promise<boolean>((resolve) => {
      const validationOptions: VerifyOptions = {
        audience: this.config.audience,
        issuer: this.config.issuer,
      };
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
      jwksUri: this.config.jwksUri,
    });
    client.getSigningKey(header.kid, function (err, key) {
      const signingKey = key?.getPublicKey();
      callback(err, signingKey);
    });
  };
}
