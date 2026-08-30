import forge from 'node-forge';

/**
 * Extract PEM blocks from openssl s_client output.
 * Returns an array of PEM strings.
 */
export function extractPemBlocks(rawOutput) {
  const regex = /-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g;
  return (rawOutput.match(regex) || []).map(p => p.trim());
}

/**
 * Parse a PEM certificate string into structured details.
 */
export function parseCert(pem) {
  try {
    const cert = forge.pki.certificateFromPem(pem);

    const subject = cert.subject.attributes.map(a => `${a.shortName}=${a.value}`).join(', ');
    const issuer = cert.issuer.attributes.map(a => `${a.shortName}=${a.value}`).join(', ');

    const notBefore = cert.validity.notBefore.toISOString();
    const notAfter = cert.validity.notAfter.toISOString();

    // SANs
    const ext = cert.extensions.find(e => e.name === 'subjectAltName');
    const sans = ext
      ? ext.altNames.map(an => an.value || an.ip).filter(Boolean)
      : [];

    // SHA-256 fingerprint
    const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();
    const md = forge.md.sha256.create();
    md.update(der);
    const fingerprint = md.digest().toHex().match(/.{2}/g).join(':').toUpperCase();

    return {
      subject,
      issuer,
      notBefore,
      notAfter,
      sans,
      fingerprint,
      serialNumber: cert.serialNumber,
    };
  } catch {
    return { error: 'Failed to parse certificate' };
  }
}

/**
 * Assign chain positions to an array of PEM certs.
 * First cert = Leaf, last cert = Root, everything else = Intermediate.
 */
export function assignChainPositions(pems) {
  return pems.map((pem, i) => {
    let position = 'Intermediate';
    if (i === 0) position = 'Leaf';
    else if (i === pems.length - 1) position = 'Root';
    return {
      position,
      pem,
      details: parseCert(pem),
    };
  });
}
