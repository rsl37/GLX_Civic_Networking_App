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

describe('Communications: Health & Configuration', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should return health status', async () => {
    const response = await request(app).get('/api/communications/health').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('healthy');
    expect(response.body.data).toHaveProperty('providers');
    expect(response.body.data).toHaveProperty('timestamp');
  });

  test('should return configuration (authenticated)', async () => {
    const response = await request(app)
      .get('/api/communications/config')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('defaultProvider');
    expect(response.body.data).toHaveProperty('escalation');
  });

  test('should require auth for config endpoint', async () => {
    const response = await request(app).get('/api/communications/config').expect(401);

    // Auth middleware returns error without success field
    expect(response.status).toBe(401);
  });
});
