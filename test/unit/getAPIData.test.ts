import 'dotenv/config';
import { accessAPIData } from '../../src/services/getAPIData';

describe('getAPIData', () => {
  it('should return balance data with valid api key', async () => {
    const apiKey = process.env.API_KEY;

    if (apiKey) {
      const res = await accessAPIData('/balances', apiKey);
      expect(
        'amount' in res && 'currency' in res && 'date' in res
      ).toBeTruthy();
    }
  });

  it('should return transaction data with valid api key', async () => {
    const apiKey = process.env.API_KEY;

    if (apiKey) {
      const res = await accessAPIData('/transactions', apiKey);
      const transaction = res.transactions[0];
      expect(
        'amount' in transaction &&
          'currency' in transaction &&
          'date' in transaction &&
          'status' in transaction
      ).toBeTruthy();
    }
  });

  it('balances endpoint should return 401 with invalid api key', async () => {
    const apiKey = 'invalid key';

    if (apiKey) {
      const res = await accessAPIData('/balances', apiKey);
      expect(res).toEqual({
        errorCode: 'UNAUTHORIZED',
        description: 'Invalid API key.',
      });
    }
  });

  it('transactions endpoint should return 401 with invalid api key', async () => {
    const apiKey = 'invalid key';

    if (apiKey) {
      const res = await accessAPIData('/transactions', apiKey);
      expect(res).toEqual({
        errorCode: 'UNAUTHORIZED',
        description: 'Invalid API key.',
      });
    }
  });
});
