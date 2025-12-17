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

import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { TestServer } from '../setup/test-server.js';
import request from 'supertest';
import {
  generatePageVerificationToken,
  PAGE_VERIFICATION_CONFIG,
} from '../../server/middleware/pageVerification.js';

describe('Page Verification Endpoint', () => {
  let testServer: TestServer;

  beforeAll(async () => {
    testServer = new TestServer();
    testServer.setupBasicMiddleware();

    // Setup page verification endpoint
    testServer.app.post('/api/verify-page', async (req, res) => {
      try {
        const { pageType, pageContent, checksum } = req.body;
        const origin = req.get('Origin') || req.get('Referer') || '';
        const userAgent = req.get('User-Agent') || '';

        // Validate required fields
        if (!pageType || !pageContent || !checksum) {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Page type, content, and checksum are required',
              statusCode: 400,
            },
          });
        }

        // Validate page type
        if (pageType !== 'login' && pageType !== 'register') {
          return res.status(400).json({
            success: false,
            error: {
              message: 'Invalid page type',
              statusCode: 400,
            },
          });
        }

        // Generate verification token
        const verificationToken = generatePageVerificationToken(origin, pageType, userAgent);

        res.json({
          success: true,
          data: {
            verificationToken,
            expiresIn: PAGE_VERIFICATION_CONFIG.tokenExpiry,
          },
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: {
            message: 'Page verification failed',
            statusCode: 500,
          },
        });
      }
    });

    await testServer.start();
  });

  afterAll(async () => {
    await testServer.stop();
  });

  test('should generate verification token for login page', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .set('User-Agent', 'Test Agent')
      .send({
        pageType: 'login',
        pageContent: 'Sign In Email Phone Password',
        checksum: 'test-checksum-123',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        verificationToken: expect.any(String),
        expiresIn: expect.any(Number),
      },
    });

    expect(response.body.data.verificationToken).toHaveLength(64); // 32 bytes in hex = 64 chars
    expect(response.body.data.expiresIn).toBe(PAGE_VERIFICATION_CONFIG.tokenExpiry);
  });

  test('should generate verification token for register page', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .set('User-Agent', 'Test Agent')
      .send({
        pageType: 'register',
        pageContent: 'Create Account Username Email Password',
        checksum: 'test-checksum-456',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        verificationToken: expect.any(String),
        expiresIn: expect.any(Number),
      },
    });
  });

  test('should reject request without page type', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageContent: 'Sign In Email Phone Password',
        checksum: 'test-checksum-123',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Page type, content, and checksum are required',
        statusCode: 400,
      },
    });
  });

  test('should reject request without page content', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageType: 'login',
        checksum: 'test-checksum-123',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Page type, content, and checksum are required',
        statusCode: 400,
      },
    });
  });

  test('should reject request without checksum', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageType: 'login',
        pageContent: 'Sign In Email Phone Password',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Page type, content, and checksum are required',
        statusCode: 400,
      },
    });
  });

  test('should reject invalid page type', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageType: 'invalid',
        pageContent: 'Some content',
        checksum: 'test-checksum-123',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        message: 'Invalid page type',
        statusCode: 400,
      },
    });
  });

  test('should generate different tokens for different requests', async () => {
    const response1 = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageType: 'login',
        pageContent: 'Sign In Email Phone Password',
        checksum: 'test-checksum-123',
      })
      .expect(200);

    const response2 = await request(testServer.app)
      .post('/api/verify-page')
      .set('Origin', 'http://localhost:3000')
      .send({
        pageType: 'login',
        pageContent: 'Sign In Email Phone Password',
        checksum: 'test-checksum-123',
      })
      .expect(200);

    expect(response1.body.data.verificationToken).not.toBe(
      response2.body.data.verificationToken
    );
  });

  test('should handle requests without origin header', async () => {
    const response = await request(testServer.app)
      .post('/api/verify-page')
      .send({
        pageType: 'login',
        pageContent: 'Sign In Email Phone Password',
        checksum: 'test-checksum-123',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      success: true,
      data: {
        verificationToken: expect.any(String),
      },
    });
  });
});
