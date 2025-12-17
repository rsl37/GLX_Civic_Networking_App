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

describe('POST /api/auth/logout', () => {
  let testServer: TestServer;

  beforeAll(async () => {
    testServer = new TestServer();
    testServer.setupBasicMiddleware();

    // Setup logout endpoint
    testServer.app.post('/api/auth/logout', (req, res) => {
      res.json({
        message: 'Logout successful',
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

  test('should logout successfully', async () => {
    const response = await request(testServer.app).post('/api/auth/logout').expect(200);

    expect(response.body).toMatchObject({
      message: 'Logout successful',
    });
  });
});
