# Cipher Talk — E2EE Documentation

## Architecture

### Encryption Stack
- **AES-256-GCM** — symmetric encryption for messages
- **ECDH P-256** — asymmetric key exchange between users
- **PBKDF2** — key derivation from master password (optional)

### Zero-Knowledge Design
- Server never sees private keys
- Messages encrypted client-side before sending
- Only public keys stored in `user_keys` table

## API

### Key Generation
```typescript
// Generate ECDH key pair
const keyPair = await generateKeyPair();

// Export public key (base64)
const publicKey = await exportPublicKey(keyPair.publicKey);

// Store in DB
await supabase.from('user_keys').upsert({
  user_id: userId,
  public_key: publicKey,
  key_type: 'ECDH-P256'
});
```

### Message Encryption
```typescript
// For P2P E2EE
const encrypted = await encryptForUser(plaintext, recipientPublicKey, myPrivateKey);

// For local storage
const encrypted = await encryptMessage(plaintext);
```

### Message Decryption
```typescript
// For P2P E2EE
const decrypted = await decryptFromUser(ciphertext, senderPublicKey, myPrivateKey);

// For local storage
const decrypted = await decryptMessage(ciphertext);
```

### Key Fingerprint
```typescript
const fingerprint = await getKeyFingerprint(publicKey);
// Returns: XX:XX:XX:XX:XX:XX:XX:XX
```

## Mobile Integration

### React Native
```typescript
// Use expo-secure-store instead of localStorage
import * as SecureStore from 'expo-secure-store';

// Web Crypto API available in React Native
// Same functions work as in web version
```

### Flutter
```dart
// Use flutter_secure_storage
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Use pointycastle for crypto operations
```

## Database Schema

### user_keys
```sql
CREATE TABLE user_keys (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  public_key TEXT NOT NULL,
  key_type TEXT DEFAULT 'ECDH-P256',
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  room_id UUID REFERENCES rooms(id),
  sender_id UUID REFERENCES profiles(id),
  text TEXT, -- encrypted
  cipher_type TEXT, -- 'none' | 'caesar' | 'base64'
  created_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);
```

## Security Notes

1. **Never store private keys in plain text**
2. **Always use HTTPS/WSS**
3. **Verify key fingerprints out-of-band**
4. **Implement key rotation**
5. **Use secure random for IVs**

## SQL Migrations

Execute in Supabase Dashboard → SQL Editor:
1. `sql/e2ee_setup.sql` — key exchange tables
2. `sql/realtime_chat_setup.sql` — realtime + read receipts
3. `sql/admin_logs.sql` — admin action logging