import { execFile } from 'child_process';

const TIMEOUT_MS = 10000;

/**
 * Validate hostname to prevent command injection.
 * Allows alphanumeric, dots, hyphens only.
 */
export function validateHost(host) {
  if (typeof host !== 'string') return false;
  return /^[a-zA-Z0-9.\-]+$/.test(host) && host.length <= 253;
}

/**
 * Validate port number (1-65535).
 */
export function validatePort(port) {
  const n = Number(port);
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

/**
 * Run `openssl s_client -connect host:port -showcerts` and return stdout+stderr.
 */
export function fetchCertChain(host, port) {
  return new Promise((resolve, reject) => {
    const args = [
      's_client',
      '-connect', `${host}:${port}`,
      '-showcerts',
    ];

    const child = execFile('openssl', args, { timeout: TIMEOUT_MS }, (err, stdout, stderr) => {
      if (err && err.killed) {
        return reject(new Error('Connection timed out'));
      }
      // openssl s_client exits non-zero but still produces useful output
      resolve({ stdout, stderr });
    });

    // Send empty input so s_client doesn't wait for stdin
    child.stdin.end();
  });
}
