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

describe('Communications: SMS Escalation', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should validate required fields for SMS', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/sms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        to: '+1234567890',
        // Missing body
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Missing required fields');
  });

  test('should validate phone number format', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/sms')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        to: 'invalid-phone',
        body: 'Test message',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Invalid phone number');
  });

  test('should require auth for SMS sending', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/sms')
      .send({
        to: '+1234567890',
        body: 'Test message',
      })
      .expect(401);

    // Auth middleware returns 401
    expect(response.status).toBe(401);
  });
});
