import { execFile } from 'child_process';

const TIMEOUT_MS = 10000;

/**
 * Validate hostname to prevent command injection and SSRF.
 * Allows alphanumeric, dots, hyphens only.
 * Blocks loopback, private, and link-local ranges.
 */
export function validateHost(host) {
  if (typeof host !== 'string') return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(host) || host.length > 253) return false;

  // Block loopback and common private/internal ranges
  const blocked = [
    /^localhost$/i,
    /^127\./,
    /^0\.0\.0\.0$/,
    /^::1$/,
    /^10\./,
    /^192\.168\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^169\.254\./,
    /^fc00:/i,
    /^fe80:/i,
  ];
  return !blocked.some(re => re.test(host));
}

/**
 * Validate port number (1-65535).
 */
export function validatePort(port) {
  const n = Number(port);
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

/**
 * Run `openssl s_client -connect host:port -servername host -showcerts` and return stdout+stderr.
 * The -servername flag enables SNI, which is required by many hosts (e.g. CDNs, GitHub)
 * to serve the correct certificate chain.
 */
export function fetchCertChain(host, port) {
  return new Promise((resolve, reject) => {
    const args = [
      's_client',
      '-connect', `${host}:${port}`,
      '-servername', host,
      '-showcerts',
    ];

    const child = execFile('openssl', args, { timeout: TIMEOUT_MS }, (err, stdout, stderr) => {
      if (err && err.killed) {
        return reject(new Error('Connection timed out'));
      }
      if (err && err.code === 'ENOENT') {
        return reject(err);
      }
      // openssl s_client exits non-zero but still produces useful output on success.
      // Only reject if stdout contains no PEM data at all and stderr has an error message.
      if ((!stdout || !stdout.includes('BEGIN CERTIFICATE')) && stderr && err) {
        return reject(new Error(stderr.split('\n').find(l => l.trim()) || err.message));
      }
      resolve({ stdout: stdout || '', stderr: stderr || '' });
    });

    // Send empty input so s_client doesn't wait for stdin
    child.stdin.end();
  });
}
