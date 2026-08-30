import { compactVerify, importSPKI, importX509 } from 'jose'

function decodeBase64Url(segment) {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  const binary = atob(`${normalized}${padding}`)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function stringify(value) {
  return JSON.stringify(value, null, 2)
}

function humanizeDuration(milliseconds) {
  const totalSeconds = Math.max(Math.floor(milliseconds / 1000), 0)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days) {
    return `${days}d ${hours}h`
  }

  if (hours) {
    return `${hours}h ${minutes}m`
  }

  if (minutes) {
    return `${minutes}m ${seconds}s`
  }

  return `${seconds}s`
}

export function getExpiryStatus(payload) {
  if (!payload?.exp) {
    return {
      expired: false,
      label: 'No exp claim present.',
    }
  }

  const diff = payload.exp * 1000 - Date.now()
  const expired = diff <= 0

  return {
    expired,
    label: expired
      ? `Expired ${humanizeDuration(Math.abs(diff))} ago`
      : `Expires in ${humanizeDuration(diff)}`,
  }
}

export function decodeJwt(token) {
  const parts = token.trim().split('.')

  if (parts.length !== 3) {
    throw new Error('A JWT must contain header, payload, and signature segments.')
  }

  const header = JSON.parse(decodeBase64Url(parts[0]))
  const payload = JSON.parse(decodeBase64Url(parts[1]))

  return {
    header,
    payload,
    signature: parts[2],
    prettyHeader: stringify(header),
    prettyPayload: stringify(payload),
    prettySignature: parts[2] || '(empty signature)',
    expiry: getExpiryStatus(payload),
  }
}

async function resolveVerificationKey(algorithm, keyInput) {
  const trimmedKey = keyInput.trim()

  if (algorithm.startsWith('HS')) {
    return new TextEncoder().encode(trimmedKey)
  }

  if (trimmedKey.includes('BEGIN CERTIFICATE')) {
    return importX509(trimmedKey, algorithm)
  }

  return importSPKI(trimmedKey, algorithm)
}

export async function verifyJwt(token, keyInput) {
  const decoded = decodeJwt(token)

  if (!decoded.header.alg || decoded.header.alg === 'none') {
    throw new Error('The token algorithm is missing or not supported for validation.')
  }

  const verificationKey = await resolveVerificationKey(decoded.header.alg, keyInput)
  await compactVerify(token.trim(), verificationKey)

  return {
    ...decoded,
    signatureValid: true,
  }
}
