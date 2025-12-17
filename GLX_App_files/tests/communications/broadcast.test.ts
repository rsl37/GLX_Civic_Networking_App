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

describe('Communications: Broadcast SMS', () => {
  let app: express.Express;
  let authToken: string;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    authToken = generateToken(1);
    app.use('/api/communications', communicationsRoutes);
  });

  test('should validate recipients array', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/broadcast')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        recipients: 'not-an-array',
        body: 'Test broadcast',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('non-empty array');
  });

  test('should validate empty recipients array', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/broadcast')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        recipients: [],
        body: 'Test broadcast',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('non-empty array');
  });

  test('should limit recipients to 100', async () => {
    const recipients = Array(101)
      .fill(null)
      .map((_, i) => `+1234567${i.toString().padStart(4, '0')}`);

    const response = await request(app)
      .post('/api/communications/escalate/broadcast')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        recipients,
        body: 'Test broadcast',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Maximum 100 recipients');
  });

  test('should require body for broadcast', async () => {
    const response = await request(app)
      .post('/api/communications/escalate/broadcast')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        recipients: ['+1234567890'],
        // Missing body
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('body is required');
  });
});
