/**
 * GLX: Connect the World - Civic Networking Platform
 * 
 * Copyright (c) 2025 rsl37
 * Dual-licensed under PolyForm Shield 1.0.0 OR PolyForm Noncommercial 1.0.0
 * 
 * ⚠️  TERMS:
 * - Commercial use strictly prohibited without written permission from copyright holder
 * - Forking/derivative works prohibited without written permission
 * - Violations subject to legal action and damages
 * 
 * See LICENSE file in repository root for full terms.
 * Contact: roselleroberts@pm.me for licensing inquiries
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { TestServer, mockDb } from '../setup/test-server.js';
import request from 'supertest';

describe('POST /api/auth/verify-email', () => {
  let testServer: TestServer;

  beforeAll(async () => {
    testServer = new TestServer();
    testServer.setupBasicMiddleware();

    // Setup registration endpoint (needed for test setup)
    testServer.app.post('/api/auth/register', (req, res) => {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['email', 'password', 'firstName', 'lastName'],
        });
      }

      const existingUser = mockDb.findUser({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
        });
      }

      const user = mockDb.addUser({
        email,
        firstName,
        lastName,
        created_at: new Date().toISOString(),
        verified: false,
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified,
        },
      });
    });

    // Setup email verification endpoint
    testServer.app.post('/api/auth/verify-email', (req, res) => {
      const { token, email } = req.body;

      if (!token || !email) {
        return res.status(400).json({
          error: 'Token and email are required',
        });
      }

      const user = mockDb.findUser({ email });
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
        });
      }

      // Mark user as verified
      user.verified = true;

      res.json({
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          verified: user.verified,
        },
      });
    });

    await testServer.start();
  });

  beforeEach(async () => {
    mockDb.clear();
    // Create a user for verification tests
    await request(testServer.app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  afterAll(async () => {
    await testServer.stop();
  });

  test('should verify email with valid token', async () => {
    const response = await request(testServer.app)
      .post('/api/auth/verify-email')
      .send({
        token: 'valid-verification-token',
        email: 'test@example.com',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      message: 'Email verified successfully',
      user: {
        id: expect.any(Number),
        email: 'test@example.com',
        verified: true,
      },
    });
  });

  test('should reject verification with missing token', async () => {
    const response = await request(testServer.app)
      .post('/api/auth/verify-email')
      .send({ email: 'test@example.com' })
      .expect(400);

    expect(response.body).toMatchObject({
      error: 'Token and email are required',
    });
  });

  test('should reject verification for non-existent user', async () => {
    const response = await request(testServer.app)
      .post('/api/auth/verify-email')
      .send({
        token: 'valid-verification-token',
        email: 'nonexistent@example.com',
      })
      .expect(404);

    expect(response.body).toMatchObject({
      error: 'User not found',
    });
  });
});
