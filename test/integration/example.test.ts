import request from 'supertest';
import app from '../../src/app';

describe('Balance and Transactions API', () => {
  describe('GET /historical-balances', () => {
    it('should be able to get the boilerplate response', async () => {
      const response = await request(app).get('/historical-balances');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description: 'Missing query paramaters.',
        errorCode: 'BAD_REQUEST',
      });
    });
  });
});
