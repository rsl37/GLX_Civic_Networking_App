/*
 * Copyright (c) 2025 GALAX Civic Networking App
 *
 * This software is licensed under the PolyForm Shield License 1.0.0.
 * For the full license text, see LICENSE file in the root directory
 * or visit https://polyformproject.org/licenses/shield/1.0.0
 */

import { describe, it, expect, beforeAll } from 'vitest';
<<<<<<< HEAD
import { postQuantumCrypto } from '../../server/postQuantumCrypto.js';

describe('Post-Quantum Cryptography Security Baseline', () => {
  beforeAll(async () => {
    await postQuantumCrypto.initialize();
  });

  describe('Initialization', () => {
    it('should initialize post-quantum cryptography successfully', async () => {
      const status = postQuantumCrypto.getStatus();

      expect(status.initialized).toBe(true);
      expect(status.algorithms.mlkem.status).toBe('ML-KEM-1024 (FIPS 203)');
      expect(status.algorithms.mldsa.status).toBe('ML-DSA-87 (FIPS 204)');
      expect(status.algorithms.slhdsa.status).toBe('SLH-DSA-256s (FIPS 205)');
    });

    it('should provide security level 5 protection', () => {
      const status = postQuantumCrypto.getStatus();

      expect(status.algorithms.mlkem.securityLevel).toBe(5);
      expect(status.algorithms.mldsa.securityLevel).toBe(5);
      expect(status.algorithms.slhdsa.securityLevel).toBe(5);
    });

    it('should be NIST compliant', () => {
      const status = postQuantumCrypto.getStatus();

      expect(status.algorithms.mlkem.nistsCompliant).toBe(true);
      expect(status.algorithms.mldsa.nistsCompliant).toBe(true);
      expect(status.algorithms.slhdsa.nistsCompliant).toBe(true);
    });
  });

  describe('ML-KEM (CRYSTALS-Kyber) Key Encapsulation', () => {
    it('should perform key encapsulation and decapsulation', async () => {
      const data = Buffer.from('Test secret message for encapsulation');
      const result = await postQuantumCrypto.encapsulate(data);

      expect(result.ciphertext).toBeDefined();
      expect(result.sharedSecret).toBeDefined();
      expect(Buffer.isBuffer(result.ciphertext)).toBe(true);
      expect(Buffer.isBuffer(result.sharedSecret)).toBe(true);
=======
import { 
  PostQuantumKEM, 
  PostQuantumDSA, 
  PostQuantumHashSignatures,
  PostQuantumSecureStorage,
  PostQuantumZKProofs,
  PostQuantumSecurityManager,
  postQuantumSecurity,
  SecurityLevel 
} from '../../server/postQuantumCrypto.js';

describe('Post-Quantum Cryptography Security Baseline', () => {
  let pqSecurity: PostQuantumSecurityManager;

  beforeAll(() => {
    pqSecurity = new PostQuantumSecurityManager(SecurityLevel.LEVEL_5);
  });

  describe('ML-KEM (CRYSTALS-Kyber) Key Encapsulation', () => {
    it('should generate valid key pairs', () => {
      const kem = new PostQuantumKEM(SecurityLevel.LEVEL_5);
      const keyPair = kem.generateKeyPair();
      
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should perform key encapsulation and decapsulation correctly', () => {
      const kem = new PostQuantumKEM(SecurityLevel.LEVEL_5);
      const keyPair = kem.generateKeyPair();
      
      // Encapsulate a shared secret
      const { ciphertext, sharedSecret } = kem.encapsulate(keyPair.publicKey);
      expect(ciphertext.length).toBeGreaterThan(0);
      expect(sharedSecret.length).toBeGreaterThan(0);
      
      // Decapsulate the shared secret
      const decapsulatedSecret = kem.decapsulate(ciphertext, keyPair.privateKey);
      
      // Verify the shared secrets match
      expect(Buffer.from(sharedSecret).equals(Buffer.from(decapsulatedSecret))).toBe(true);
    });

    it('should perform hybrid key exchange (classical + post-quantum)', () => {
      const kem = new PostQuantumKEM(SecurityLevel.LEVEL_5);
      const keyPair = kem.generateKeyPair();
      
      const hybridResult = kem.hybridKeyExchange(keyPair.publicKey);
      
      expect(hybridResult.classicalSharedSecret).toBeDefined();
      expect(hybridResult.postQuantumSharedSecret).toBeDefined();
      expect(hybridResult.combinedSecret).toBeDefined();
      expect(hybridResult.ciphertext).toBeDefined();
      expect(hybridResult.combinedSecret.length).toBe(64); // 512-bit combined secret
>>>>>>> origin/copilot/fix-126
    });
  });

  describe('ML-DSA (CRYSTALS-Dilithium) Digital Signatures', () => {
<<<<<<< HEAD
    it('should sign and verify messages', async () => {
      const message = Buffer.from('GALAX Civic Platform - Test Message');
      const signature = await postQuantumCrypto.sign(message);

      expect(signature).toBeDefined();
      expect(Buffer.isBuffer(signature)).toBe(true);

      const isValid = await postQuantumCrypto.verify(message, signature);
=======
    it('should generate valid signing key pairs', () => {
      const dsa = new PostQuantumDSA(SecurityLevel.LEVEL_5);
      const keyPair = dsa.generateKeyPair();
      
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should sign and verify messages correctly', () => {
      const dsa = new PostQuantumDSA(SecurityLevel.LEVEL_5);
      const keyPair = dsa.generateKeyPair();
      const message = new Uint8Array(Buffer.from('GALAX Post-Quantum Security Test Message'));
      
      // Sign the message
      const signature = dsa.sign(message, keyPair.privateKey);
      expect(signature.length).toBeGreaterThan(0);
      
      // Verify the signature
      const isValid = dsa.verify(signature, message, keyPair.publicKey);
      expect(isValid).toBe(true);
      
      // Verify invalid signature fails
      const invalidMessage = new Uint8Array(Buffer.from('Different message'));
      const isInvalid = dsa.verify(signature, invalidMessage, keyPair.publicKey);
      expect(isInvalid).toBe(false);
    });

    it('should perform hybrid signing (classical + post-quantum)', () => {
      const dsa = new PostQuantumDSA(SecurityLevel.LEVEL_5);
      const pqKeyPair = dsa.generateKeyPair();
      
      // Generate classical key pair (using Node.js crypto)
      const crypto = require('crypto');
      const { publicKey: classicalPublic, privateKey: classicalPrivate } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      });

      const message = new Uint8Array(Buffer.from('GALAX Hybrid Signature Test'));
      
      // Create hybrid signature
      const hybridSig = dsa.hybridSign(message, Buffer.from(classicalPrivate), pqKeyPair.privateKey);
      
      expect(hybridSig.classicalSignature).toBeDefined();
      expect(hybridSig.postQuantumSignature).toBeDefined();
      expect(hybridSig.combinedSignature).toBeDefined();
      
      // Verify hybrid signature
      const isValid = dsa.hybridVerify(
        hybridSig.combinedSignature,
        message,
        Buffer.from(classicalPublic),
        pqKeyPair.publicKey
      );
>>>>>>> origin/copilot/fix-126
      expect(isValid).toBe(true);
    });
  });

<<<<<<< HEAD
  describe('SLH-DSA (SPHINCS+) Backup Signatures', () => {
    it('should provide backup signature functionality', async () => {
      const message = Buffer.from('Backup signature test');
      const backupSig = await postQuantumCrypto.sign(message);

      expect(backupSig).toBeDefined();
      expect(Buffer.isBuffer(backupSig)).toBe(true);
=======
  describe('SLH-DSA (SPHINCS+) Hash-based Signatures', () => {
    it('should generate valid SPHINCS+ key pairs', () => {
      const hashSig = new PostQuantumHashSignatures(SecurityLevel.LEVEL_5);
      const keyPair = hashSig.generateKeyPair();
      
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.length).toBeGreaterThan(0);
      expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should sign and verify with SPHINCS+ correctly', () => {
      const hashSig = new PostQuantumHashSignatures(SecurityLevel.LEVEL_5);
      const keyPair = hashSig.generateKeyPair();
      const message = new Uint8Array(Buffer.from('GALAX SPHINCS+ Test Message'));
      
      // Sign the message
      const signature = hashSig.sign(message, keyPair.privateKey);
      expect(signature.length).toBeGreaterThan(0);
      
      // Verify the signature
      const isValid = hashSig.verify(signature, message, keyPair.publicKey);
      expect(isValid).toBe(true);
    });
  });

  describe('Post-Quantum Secure Storage', () => {
    it('should encrypt and decrypt data with post-quantum security', () => {
      const storage = new PostQuantumSecureStorage(SecurityLevel.LEVEL_5);
      const kem = new PostQuantumKEM(SecurityLevel.LEVEL_5);
      const keyPair = kem.generateKeyPair();
      
      const originalData = Buffer.from('Sensitive GALAX application data that needs quantum-resistant protection');
      
      // Encrypt data
      const encrypted = storage.encryptData(originalData, keyPair.publicKey);
      
      expect(encrypted.encryptedData).toBeDefined();
      expect(encrypted.ciphertext).toBeDefined();
      expect(encrypted.signature).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.tag).toBeDefined();
      
      // Decrypt data
      const decryptedData = storage.decryptData(
        encrypted.encryptedData,
        encrypted.ciphertext,
        keyPair.privateKey,
        encrypted.iv,
        encrypted.tag
      );
      
      expect(decryptedData.equals(originalData)).toBe(true);
>>>>>>> origin/copilot/fix-126
    });
  });

  describe('Zero-Knowledge Proofs', () => {
<<<<<<< HEAD
    it('should generate and verify zero-knowledge proofs', async () => {
      const secret = 'test-secret-data';
      const zkResult = await postQuantumCrypto.generateZKProof(secret);

      expect(zkResult).toBeDefined();
      expect(zkResult.proof).toBeDefined();
      expect(zkResult.commitment).toBeDefined();
      expect(Buffer.isBuffer(zkResult.proof)).toBe(true);
    });
  });

  describe('Hybrid Classical + Post-Quantum Cryptography', () => {
    it('should combine classical and post-quantum methods', async () => {
      const data = Buffer.from('Hybrid encryption test data');
      const result = await postQuantumCrypto.hybridEncrypt(data);

      expect(result.encrypted).toBeDefined();
      expect(result.metadata).toBeDefined();
      expect(Buffer.isBuffer(result.encrypted)).toBe(true);
    });
  });

  describe('Performance Characteristics', () => {
    it('should maintain acceptable performance levels', async () => {
      const start = Date.now();
      await postQuantumCrypto.testOperations();
      const duration = Date.now() - start;

      // Should complete within reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Comprehensive Test Suite', () => {
    it('should pass all cryptographic operations', async () => {
      const testResults = await postQuantumCrypto.testOperations();

      expect(testResults.success).toBe(true);
      expect(testResults.results).toBeDefined();

      // Check all operations passed
      expect(testResults.results.encapsulation.success).toBe(true);
      expect(testResults.results.signature.success).toBe(true);
      expect(testResults.results.hybridEncryption.success).toBe(true);
      expect(testResults.results.zkProof.success).toBe(true);
    });
  });

  describe('Future-Proofing and Regulatory Compliance', () => {
    it('should be quantum-safe and future-proof', () => {
      const status = postQuantumCrypto.getStatus();

      expect(status.complianceLevel).toBe('NIST Post-Quantum Standards');
      expect(status.protectionScore).toBe(130); // Quantum-safe protection
    });

    it('should meet post-quantum security requirements', () => {
      const status = postQuantumCrypto.getStatus();

      // Should exceed traditional enterprise security
      expect(status.securityLevel).toBeGreaterThanOrEqual(5);
      expect(status.protectionScore).toBeGreaterThan(100);
    });
  });

  describe('Integration with GALAX Security System', () => {
    it('should integrate with security manager', () => {
      const status = postQuantumCrypto.getStatus();

      expect(status.initialized).toBe(true);
      expect(status.hybridMode).toBe(true);
      expect(status.zeroKnowledgeProofs).toBe(true);
=======
    it('should create and verify zero-knowledge proofs', () => {
      const zkProofs = new PostQuantumZKProofs();
      const secret = Buffer.from('secret-knowledge-for-galax-app');
      const challenge = Buffer.from('verification-challenge');
      
      // Create proof
      const proof = zkProofs.createProof(secret, challenge);
      
      expect(proof.commitment).toBeDefined();
      expect(proof.response).toBeDefined();
      expect(proof.nonce).toBeDefined();
      
      // Verify proof
      const isValid = zkProofs.verifyProof(
        proof.commitment,
        proof.response,
        challenge,
        proof.commitment // Using commitment as public commitment for this test
      );
      
      expect(isValid).toBe(true);
    });
  });

  describe('Post-Quantum Security Manager', () => {
    it('should initialize security baseline correctly', () => {
      const initResult = pqSecurity.initializeSecurity();
      
      expect(initResult.kemKeys).toBeDefined();
      expect(initResult.dsaKeys).toBeDefined();
      expect(initResult.hashSigKeys).toBeDefined();
      expect(initResult.securityLevel).toBe(SecurityLevel.LEVEL_5);
      expect(initResult.algorithms).toEqual(['ML-KEM', 'ML-DSA', 'SLH-DSA']);
    });

    it('should provide security status information', () => {
      const status = pqSecurity.getSecurityStatus();
      
      expect(status.postQuantumEnabled).toBe(true);
      expect(status.securityLevel).toBe(SecurityLevel.LEVEL_5);
      expect(status.algorithms).toEqual(['ML-KEM', 'ML-DSA', 'SLH-DSA']);
      expect(status.protectionScore).toBe(100);
    });

    it('should provide access to cryptographic components', () => {
      expect(pqSecurity.keyEncapsulation).toBeDefined();
      expect(pqSecurity.digitalSignatures).toBeDefined();
      expect(pqSecurity.hashSignatures).toBeDefined();
      expect(pqSecurity.secureStorage).toBeDefined();
      expect(pqSecurity.zeroKnowledgeProofs).toBeDefined();
    });
  });

  describe('Security Levels', () => {
    it('should support different security levels', () => {
      const level1 = new PostQuantumKEM(SecurityLevel.LEVEL_1);
      const level3 = new PostQuantumKEM(SecurityLevel.LEVEL_3);
      const level5 = new PostQuantumKEM(SecurityLevel.LEVEL_5);
      
      const keys1 = level1.generateKeyPair();
      const keys3 = level3.generateKeyPair();
      const keys5 = level5.generateKeyPair();
      
      // Higher security levels should generally have larger key sizes
      expect(keys1.publicKey.length).toBeLessThanOrEqual(keys5.publicKey.length);
      expect(keys3.publicKey.length).toBeLessThanOrEqual(keys5.publicKey.length);
    });
  });

  describe('Singleton Instance', () => {
    it('should provide a global post-quantum security instance', () => {
      expect(postQuantumSecurity).toBeDefined();
      expect(postQuantumSecurity).toBeInstanceOf(PostQuantumSecurityManager);
      
      const status = postQuantumSecurity.getSecurityStatus();
      expect(status.postQuantumEnabled).toBe(true);
    });
  });

  describe('Quantum Resistance Validation', () => {
    it('should demonstrate quantum-resistant properties', () => {
      const manager = new PostQuantumSecurityManager(SecurityLevel.LEVEL_5);
      
      // Initialize security
      const initResult = manager.initializeSecurity();
      expect(initResult.algorithms).toContain('ML-KEM');
      expect(initResult.algorithms).toContain('ML-DSA');
      expect(initResult.algorithms).toContain('SLH-DSA');
      
      // Test key encapsulation mechanism
      const kemKeys = manager.keyEncapsulation.generateKeyPair();
      const { ciphertext, sharedSecret } = manager.keyEncapsulation.encapsulate(kemKeys.publicKey);
      const decapsulatedSecret = manager.keyEncapsulation.decapsulate(ciphertext, kemKeys.privateKey);
      expect(Buffer.from(sharedSecret).equals(Buffer.from(decapsulatedSecret))).toBe(true);
      
      // Test digital signatures
      const dsaKeys = manager.digitalSignatures.generateKeyPair();
      const testMessage = new Uint8Array(Buffer.from('Quantum-resistant signature test'));
      const signature = manager.digitalSignatures.sign(testMessage, dsaKeys.privateKey);
      const signatureValid = manager.digitalSignatures.verify(signature, testMessage, dsaKeys.publicKey);
      expect(signatureValid).toBe(true);
      
      // Test hash-based signatures (backup method)
      const hashKeys = manager.hashSignatures.generateKeyPair();
      const hashSignature = manager.hashSignatures.sign(testMessage, hashKeys.privateKey);
      const hashSignatureValid = manager.hashSignatures.verify(hashSignature, testMessage, hashKeys.publicKey);
      expect(hashSignatureValid).toBe(true);
    });

    it('should provide NIST-compliant post-quantum algorithms', () => {
      const status = postQuantumSecurity.getSecurityStatus();
      
      // Verify NIST-standardized algorithms are supported
      expect(status.algorithms).toContain('ML-KEM');   // NIST FIPS 203
      expect(status.algorithms).toContain('ML-DSA');   // NIST FIPS 204
      expect(status.algorithms).toContain('SLH-DSA');  // NIST FIPS 205
      
      // Verify maximum security level (256-bit equivalent)
      expect(status.securityLevel).toBe(SecurityLevel.LEVEL_5);
      expect(status.protectionScore).toBe(100);
>>>>>>> origin/copilot/fix-126
    });
  });
});