---
title: "Encrypt, decrypt, and sign with passkeys"
nav_title: "Introduction"
weight: 11
source_path: "README.md"
---

Encryption keys and signing keys don't belong in environment variables or on disk. Revaulter keeps them in your passkey: scripts submit a request with the CLI, you approve it in your browser with a passkey, and the browser performs the crypto locally. Everything is End-to-End Encrypted (E2EE) between the CLI and your browser.

**What you can use Revaulter for:**

- Unlock encrypted disks at boot
- Protect backup repository passwords
- SSH logins with a passkey-backed SSH agent
- Sign release binaries from CI
- Issue long-lived JWTs
- Wrap database and TLS keys
- Encrypt/decrypt arbitrary messages

{{< figure light="docs/img/readme-screenshot-light.png" dark="docs/img/readme-screenshot-dark.png" alt="Screenshot of Revaulter, showing 3 requests pending approval: one for encrypting, one for signing, one for decrypting" caption="Screenshot of Revaulter, showing 3 requests pending approval: one for encrypting, one for signing, one for decrypting" resize="1200x webp q80" >}}

## Usage examples

### Encrypt and decrypt any message

Protect short sensitive values with your passkey, including API tokens, connection strings, TLS private keys, and wrapped secrets. Revaulter sends the request to the browser for local crypto, so payloads are limited to 100 KB. [See full example](/examples/encrypt-and-decrypt-short-messages/) in the docs.

### Wrap encryption keys safely

Use Revaulter to wrap (encrypt) database encryption keys, TLS private keys, or any other key material. The wrapped key can be stored alongside the data it protects, only someone with the right passkey can unwrap it.

For example, you can use Revaulter together with age to encrypt large files: [see full example](/examples/encrypting-large-files-with-age-and-revaulter/) in the docs.

### Unlock encrypted disks at boot

Integrate Revaulter into your boot process to unlock LUKS/dm-crypt volumes. A script calls `revaulter-cli decrypt` to retrieve the disk encryption key, and an admin authenticates with their passkey to release it. No unattended keys on disk. [See full example](/examples/unlocking-luks-encrypted-drives-at-boot/) in the docs.

### Wrap restic backup repository passwords

Wrap your [restic](https://restic.net) repository password with Revaulter and hook it into restic's `--password-command`. The backup script gets the password only after a passkey holder approves — even a fully compromised backup host can't restore the repository on its own. [See full example](/examples/backing-up-with-restic/) in the docs.

### Authenticate to SSH servers with a passkey-backed SSH agent

Run `revaulter ssh-agent` as your local SSH agent so SSH authentication requests are approved through Revaulter in the browser. SSH servers use normal SSH public keys, while each login requires passkey approval. [See the SSH server authentication example](/examples/authenticate-to-ssh-servers/) in the docs.

### Sign release binaries from CI

Run `revaulter-cli sign` from a GitHub Actions workflow to produce a signature over a release artifact. The signing key never touches the runner, the workflow pauses while a maintainer approves the request from their phone, and the resulting `.sig` is a 64-byte raw `r || s` ECDSA signature that any ECDSA library can verify. [See full example](/examples/signing-a-release-binary-from-github-actions/) in the docs.

### Issue passkey-approved JWTs

Mint long-lived ES256 JWTs (service-to-service tokens, installer licenses, break-glass credentials) where every issuance is reviewed in-browser before signing. The output is a standard compact JWS verifiable by any JOSE library. [See full example](/examples/issuing-a-long-lived-jwt/) in the docs.

### Verify signatures with a published key

Revaulter publishes the public half of every signing key on a cacheable, unauthenticated endpoint as both PEM and JWK. Verifiers fetch it once, pin it, and run fully offline from then on: there's no runtime dependency on Revaulter. [See full example](/examples/fetching-a-public-key-to-verify-a-signature/) in the docs.

## How it works

1. A CLI or script submits an encrypt or decrypt request to Revaulter
2. The passkey holder gets notified (Discord, Slack, or a webhook)
3. They open the web app, authenticate with their passkey, and review the request
4. On approval, the browser derives the key from the passkey and performs the crypto operation locally
5. The CLI receives the encrypted result and decrypts it locally

Encryption keys are derived from the passkey in the browser (leveraging the PRF extension), they never leave the user's device. The Revaulter server is just a relay: it temporarily stores only opaque, end-to-end encrypted envelopes.

![Example of a notification sent by Revaulter to a Discord channel](/docs/img/notification-example.webp)

## Key features

- **Passkey-derived keys** — encryption keys are derived from WebAuthn passkeys (with PRF) directly in the browser; the server never has access to them
- **End-to-end encryption** — all cryptographic operations happen in the user's browser using WebCrypto, the server stores only opaque, encrypted envelopes
- **Self-hosted** — runs on your infrastructure, you own your data and keys
- **Webhook notifications** — get notified on Discord, Slack, or any webhook endpoint when a request is waiting
- **Lightweight** — single binary, requires only a database (SQLite or PostgreSQL)
- **Strong cryptography** — includes support for hybrid, quantum-resistant asymmetric cryptography
