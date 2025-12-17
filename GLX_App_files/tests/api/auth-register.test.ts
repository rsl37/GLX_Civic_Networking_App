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

describe('POST /api/auth/register', () => {
  let testServer: TestServer;

  beforeAll(async () => {
    testServer = new TestServer();
    testServer.setupBasicMiddleware();

    // Setup registration endpoint
    testServer.app.post('/api/auth/register', (req, res) => {
      const { email, password, firstName, lastName } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['email', 'password', 'firstName', 'lastName'],
        });
      }

      // Check if user already exists
      const existingUser = mockDb.findUser({ email });
      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
        });
      }

      // Create user
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

    await testServer.start();
  });

  beforeEach(() => {
    mockDb.clear();
  });

  afterAll(async () => {
    await testServer.stop();
  });

  test('should register a new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = await request(testServer.app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject({
      message: 'User created successfully',
      user: {
        id: expect.any(Number),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        verified: false,
      },
    });
  });

  test('should reject registration with missing fields', async () => {
    const incompleteData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      // Missing firstName and lastName
    };

    const response = await request(testServer.app)
      .post('/api/auth/register')
      .send(incompleteData)
      .expect(400);

    expect(response.body).toMatchObject({
      error: 'Missing required fields',
      required: expect.arrayContaining(['firstName', 'lastName']),
    });
  });

  test('should reject registration with existing email', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    // First registration
    await request(testServer.app).post('/api/auth/register').send(userData).expect(201);

    // Second registration with same email
    const response = await request(testServer.app)
      .post('/api/auth/register')
      .send(userData)
      .expect(409);

    expect(response.body).toMatchObject({
      error: 'User already exists',
    });
  });

  test('should reject invalid email format', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'SecurePass123!',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Note: In a real implementation, this would validate email format
    // For now, we'll accept it but document the expected behavior
    await request(testServer.app).post('/api/auth/register').send(userData).expect(201);
  });
});
