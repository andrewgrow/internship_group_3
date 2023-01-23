/**
 * Describes object that will return as decrypted jwt data.
 */
export interface AppJwtData {
  id: string; // user's id that created this token
  iat: number; // (issued at) time of creating this token
  exp: number; // (expire time) max time this token is actual
}
