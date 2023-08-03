export interface OAuth {
  verifyToken(token: string): Promise<boolean>;
}
