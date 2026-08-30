export const sslTools = [
  {
    id: 'extract-ca',
    name: 'Extract CA from Host',
    description: 'Paste or upload a PEM chain and extract the highest CA certificate available.',
  },
  {
    id: 'certificate-details',
    name: 'Display Certificate Details',
    description: 'Parse a PEM certificate and inspect issuer, SANs, validity, and fingerprint data.',
  },
  {
    id: 'certificate-chain',
    name: 'Show Certificate Chain',
    description: 'Visualize a PEM chain as connected root, intermediate, and leaf certificates.',
  },
  {
    id: 'verify-cert-key',
    name: 'Verify Cert & Key Match',
    description: 'Compare the public key fingerprint from a certificate and private key pair.',
  },
  {
    id: 'pem-der-converter',
    name: 'PEM ↔ DER Converter',
    description: 'Convert certificate data between PEM and DER formats entirely in your browser.',
  },
  {
    id: 'generate-self-signed',
    name: 'Generate Self-Signed Cert',
    description: 'Create a self-signed certificate and private key with SAN and key size controls.',
  },
]

export const jwtTools = [
  {
    id: 'decode',
    name: 'Decode JWT',
    description: 'Inspect header, payload, signature, and the current token expiry status.',
  },
  {
    id: 'validate',
    name: 'Validate JWT',
    description: 'Verify the token signature with an HMAC secret or PEM public key/certificate.',
  },
]

export const comingSoonTools = [
  'Base64 Encode/Decode',
  'Hash Generator',
  'URL Encode/Decode',
  'Cron Parser',
]
