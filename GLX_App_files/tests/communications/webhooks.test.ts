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

describe('Communications: Webhooks', () => {
  let app: express.Express;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/communications', communicationsRoutes);
  });

  test('should accept Vonage webhook', async () => {
    const response = await request(app)
      .post('/api/communications/webhooks/vonage')
      .send({
        message_uuid: 'msg-123',
        status: 'delivered',
      });

    // Returns 200 with JSON response
    expect(response.status).toBe(200);
  });
});
