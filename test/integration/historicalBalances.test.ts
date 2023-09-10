import 'dotenv/config';
import request from 'supertest';
import app from '../../src/app';

describe('Balance and Transactions API', () => {
  describe('GET /historical-balances', () => {
    it('should return 400 for incomplete request', async () => {
      const response = await request(app).get('/historical-balances');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description: 'Missing query paramaters.',
        errorCode: 'BAD_REQUEST',
      });
    });

    it('should return 401 for valid request but no API key', async () => {
      const fromDate = 'from=27-06-2022';
      const toDate = 'to=29-06-2022';
      const sort = 'sort=desc';

      const response = await request(app).get(
        '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
      );

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        errorCode: 'UNAUTHORIZED',
        description: 'Missing API key.',
      });
    });

    it('should return 200 for valid request with valid API key', async () => {
      const fromDate = 'from=27-06-2022';
      const toDate = 'to=29-06-2022';
      const sort = 'sort=desc';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': process.env.API_KEY });

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          amount: 10032,
          currency: 'EUR',
          date: '29/06/2022',
        },
        {
          amount: 10234,
          currency: 'EUR',
          date: '28/06/2022',
        },
        {
          amount: 10287,
          currency: 'EUR',
          date: '27/06/2022',
        },
      ]);
    });

    it('should return 401 for valid request with invalid API key', async () => {
      const fromDate = 'from=27-06-2022';
      const toDate = 'to=29-06-2022';
      const sort = 'sort=desc';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': 'invalid key' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        errorCode: 'UNAUTHORIZED',
        description: 'Invalid API key.',
      });
    });

    it('sould return 400 for missing query parameters', async () => {
      const fromDate = '';
      const toDate = 'to=29-06-2022';
      const sort = 'sort=desc';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': 'invalid key' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description: 'Missing query paramaters.',
        errorCode: 'BAD_REQUEST',
      });
    });

    it('should return 400 for invalid date formats', async () => {
      const fromDate = 'from=6-27-2022';
      const toDate = 'to=6-27-2022';
      const sort = 'sort=desc';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': 'invalid key' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description: 'Invalid date.',
        errorCode: 'BAD_REQUEST',
      });
    });

    it('should return 400 if from date is after the to date', async () => {
      const fromDate = 'from=29-6-2022';
      const toDate = 'to=27-6-2022';
      const sort = 'sort=desc';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': 'invalid key' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description: 'From date must be after the to date.',
        errorCode: 'BAD_REQUEST',
      });
    });

    it('should return 400 if provided with unsuported sorting method', async () => {
      const fromDate = 'from=27-6-2022';
      const toDate = 'to=29-6-2022';
      const sort = 'sort=blabla';

      const response = await request(app)
        .get(
          '/historical-balances' + '?' + fromDate + '&' + toDate + '&' + sort
        )
        .set({ 'x-api-key': 'invalid key' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        description:
          "Invalid sorting method. select either 'asc' for ascending or 'desc' for descending.",
        errorCode: 'BAD_REQUEST',
      });
    });
  });
});
