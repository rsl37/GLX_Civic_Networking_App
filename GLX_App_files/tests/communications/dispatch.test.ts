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

describe('Communications: Dispatch Endpoints', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should validate unitIds for dispatch', async () => {
    const response = await request(app)
      .post('/api/communications/incidents/123/dispatch')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        // Missing or invalid unitIds
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('unitIds must be a non-empty array');
  });

  test('should validate empty unitIds array', async () => {
    const response = await request(app)
      .post('/api/communications/incidents/123/dispatch')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        unitIds: [],
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('non-empty array');
  });
});
