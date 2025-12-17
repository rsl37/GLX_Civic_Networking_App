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

import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import communicationsRoutes from '../../server/routes/communications.js';
import { generateToken } from '../../server/auth.js';

describe('Communications: Unit Management', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should require auth for unit listing', async () => {
    const response = await request(app).get('/api/communications/units').expect(401);

    // Auth middleware returns 401
    expect(response.status).toBe(401);
  });

  test('should validate status values for unit update', async () => {
    const response = await request(app)
      .patch('/api/communications/units/123/status')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'invalid-status' })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Invalid status');
  });

  test('should accept valid status values', async () => {
    // This will fail because no dispatch provider, but validates input
    const response = await request(app)
      .patch('/api/communications/units/123/status')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'available' });

    // Either success or 503 (no provider) is acceptable
    expect([200, 503]).toContain(response.status);
  });
});
