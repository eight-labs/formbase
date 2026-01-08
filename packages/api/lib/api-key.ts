import { createHash, randomBytes } from 'crypto';

const API_KEY_PREFIX = 'api_';

export function generateApiKey(): { key: string; prefix: string; hash: string } {
  const randomPart = randomBytes(24).toString('base64url');
  const key = `${API_KEY_PREFIX}${randomPart}`;
  const prefix = key.slice(0, 12);
  const hash = hashApiKey(key);
  return { key, prefix, hash };
}

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}
