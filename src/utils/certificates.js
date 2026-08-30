import forge from 'node-forge'

const CERTIFICATE_PATTERN =
  /-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g

const { asn1, md, pki, util } = forge

function formatName(attributes = []) {
  return attributes
    .map((attribute) => `${attribute.shortName || attribute.name}=${attribute.value}`)
    .join(', ')
}

function formatDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function toFingerPrint(byteString) {
  const digest = md.sha256.create()
  digest.update(byteString)
  return digest
    .digest()
    .toHex()
    .match(/.{1,2}/g)
    .join(':')
    .toUpperCase()
}

function parseAltNames(certificate) {
  const subjectAltName = certificate.extensions?.find(
    (extension) => extension.name === 'subjectAltName',
  )

  if (!subjectAltName?.altNames?.length) {
    return []
  }

  return subjectAltName.altNames.map((altName) => {
    if (altName.type === 2) {
      return altName.value
    }

    if (altName.type === 7) {
      return altName.ip
    }

    return altName.value || altName.ip || `Type ${altName.type}`
  })
}

function getSignatureAlgorithm(certificate) {
  return pki.oids[certificate.siginfo?.algorithmOid] || certificate.siginfo?.algorithmOid || 'Unknown'
}

function randomSerialNumber() {
  return forge.util.bytesToHex(forge.random.getBytesSync(9))
}

export function extractPemBlocks(value) {
  return (value.match(CERTIFICATE_PATTERN) || []).map((block) => block.trim())
}

export function parseCertificatePem(pem) {
  const certificate = pki.certificateFromPem(pem)
  const certificateAsn1 = pki.certificateToAsn1(certificate)
  const derBytes = asn1.toDer(certificateAsn1).getBytes()
  const subject = formatName(certificate.subject.attributes)
  const issuer = formatName(certificate.issuer.attributes)

  return {
    pem,
    certificate,
    subject,
    issuer,
    commonName: certificate.subject.getField('CN')?.value || 'Unknown',
    serialNumber: certificate.serialNumber || 'Unknown',
    validity: {
      notBefore: formatDate(certificate.validity.notBefore),
      notAfter: formatDate(certificate.validity.notAfter),
    },
    sans: parseAltNames(certificate),
    signatureAlgorithm: getSignatureAlgorithm(certificate),
    fingerprint: toFingerPrint(derBytes),
  }
}

export function parseCertificateChain(value) {
  return extractPemBlocks(value).map(parseCertificatePem)
}

export function orderCertificateChain(certificates) {
  if (certificates.length < 2) {
    return certificates
  }

  const leafCertificate = certificates.find(
    (candidate) =>
      !certificates.some(
        (certificate) =>
          certificate.issuer === candidate.subject &&
          certificate.subject !== candidate.subject,
      ),
  )

  if (!leafCertificate) {
    return [...certificates].reverse()
  }

  const orderedLeafToRoot = [leafCertificate]
  const seen = new Set([leafCertificate.subject])

  while (orderedLeafToRoot.length < certificates.length) {
    const current = orderedLeafToRoot[orderedLeafToRoot.length - 1]
    const next = certificates.find(
      (certificate) =>
        certificate.subject === current.issuer && !seen.has(certificate.subject),
    )

    if (!next) {
      break
    }

    orderedLeafToRoot.push(next)
    seen.add(next.subject)
  }

  const remaining = certificates.filter((certificate) => !seen.has(certificate.subject))
  return [...orderedLeafToRoot.reverse(), ...remaining]
}

export function extractCaCertificate(value) {
  const ordered = orderCertificateChain(parseCertificateChain(value))

  if (!ordered.length) {
    throw new Error('No PEM certificates were found in the provided chain.')
  }

  return ordered[0]
}

export function compareCertificateAndKey(certificatePem, keyPem) {
  const certificate = pki.certificateFromPem(certificatePem)
  const privateKey = pki.privateKeyFromPem(keyPem)

  if (!privateKey?.n || !privateKey?.e) {
    throw new Error('Only RSA private keys are currently supported for key matching.')
  }

  const derivedPublicKey = pki.setRsaPublicKey(privateKey.n, privateKey.e)
  const certificatePublicKeyPem = pki
    .publicKeyToPem(certificate.publicKey)
    .replace(/\r\n/g, '\n')
    .trim()
  const keyPublicKeyPem = pki
    .publicKeyToPem(derivedPublicKey)
    .replace(/\r\n/g, '\n')
    .trim()
  const certificatePublicKeyDer = asn1
    .toDer(pki.publicKeyToAsn1(certificate.publicKey))
    .getBytes()
  const keyPublicKeyDer = asn1.toDer(pki.publicKeyToAsn1(derivedPublicKey)).getBytes()

  return {
    matches: certificatePublicKeyPem === keyPublicKeyPem,
    certificateFingerprint: toFingerPrint(certificatePublicKeyDer),
    keyFingerprint: toFingerPrint(keyPublicKeyDer),
  }
}

export function convertPemToDerBase64(pem) {
  const certificate = pki.certificateFromPem(pem)
  const derBytes = asn1.toDer(pki.certificateToAsn1(certificate)).getBytes()

  return {
    text: util.encode64(derBytes),
    bytes: Uint8Array.from(derBytes, (char) => char.charCodeAt(0)),
  }
}

export function convertDerToPem(input) {
  const derBytes = typeof input === 'string' ? util.decode64(input) : input
  const certificate = pki.certificateFromAsn1(asn1.fromDer(derBytes))
  return pki.certificateToPem(certificate).trim()
}

function buildAltNames(sans) {
  return sans
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => {
      const isIp = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(name)
      return isIp ? { type: 7, ip: name } : { type: 2, value: name }
    })
}

export function generateSelfSignedCertificate({
  commonName,
  sans,
  validityDays,
  keySize,
}) {
  const keys = pki.rsa.generateKeyPair({ bits: Number(keySize), e: 0x10001 })
  const certificate = pki.createCertificate()
  const altNames = buildAltNames(sans)
  const now = new Date()
  const expiresAt = new Date(now)
  expiresAt.setDate(expiresAt.getDate() + Number(validityDays))

  certificate.publicKey = keys.publicKey
  certificate.serialNumber = randomSerialNumber()
  certificate.validity.notBefore = now
  certificate.validity.notAfter = expiresAt

  const subject = [{ name: 'commonName', value: commonName.trim() }]
  certificate.setSubject(subject)
  certificate.setIssuer(subject)
  certificate.setExtensions([
    { name: 'basicConstraints', cA: false },
    {
      name: 'keyUsage',
      digitalSignature: true,
      keyEncipherment: true,
      dataEncipherment: true,
    },
    {
      name: 'extKeyUsage',
      serverAuth: true,
      clientAuth: true,
    },
    { name: 'subjectAltName', altNames },
  ])
  certificate.sign(keys.privateKey, md.sha256.create())

  const certificatePem = pki.certificateToPem(certificate).trim()
  const privateKeyPem = pki.privateKeyToPem(keys.privateKey).trim()

  return {
    certificatePem,
    privateKeyPem,
    details: parseCertificatePem(certificatePem),
  }
}
