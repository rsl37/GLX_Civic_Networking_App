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

describe('Communications: Incident Management', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should validate required fields for incident creation', async () => {
    const response = await request(app)
      .post('/api/communications/incidents')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Incident',
        // Missing required fields
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Missing required fields');
  });

  test('should validate severity values', async () => {
    const response = await request(app)
      .post('/api/communications/incidents')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'invalid-severity',
        location: { latitude: 40.7128, longitude: -74.006 },
        type: 'emergency',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Invalid severity');
  });

  test('should validate location format', async () => {
    const response = await request(app)
      .post('/api/communications/incidents')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Incident',
        description: 'Test description',
        severity: 'high',
        location: { latitude: 'invalid', longitude: -74.006 },
        type: 'emergency',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Location must include valid');
  });

  test('should require auth for incident listing', async () => {
    const response = await request(app).get('/api/communications/incidents').expect(401);

    // Auth middleware returns 401
    expect(response.status).toBe(401);
  });

  test('should accept valid query parameters for incident listing', async () => {
    const response = await request(app)
      .get('/api/communications/incidents')
      .query({
        status: 'pending,dispatched',
        severity: 'high,critical',
        limit: 10,
      })
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
