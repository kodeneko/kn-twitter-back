import { randomBytes, createHash } from 'crypto';

function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier: string): string {
  return createHash('sha256').update(codeVerifier).digest('base64url');
}

function createTicket() {
  return randomBytes(16).toString('hex');
}

export { generateCodeVerifier, generateCodeChallenge, createTicket };
