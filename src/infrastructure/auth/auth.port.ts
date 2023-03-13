export interface OAuthPort {
  verifyToken(token: string): Promise<boolean>;
}
