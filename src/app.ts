import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import {
  getHistoricalBalance,
  accessAPIData,
} from './services/getHistoricalBalances';

type BalanceData = {
  amount: number;
  currency: string;
  date: string;
};

type TransactionData = {
  amount: number;
  currency: string;
  date: string;
  status: string;
};

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/historical-balances', async (req, res) => {
  try {
    const apiKey = req.get('x-api-key');
    if (apiKey) {
      const currentBalance: BalanceData = await accessAPIData(
        '/balances',
        apiKey
      );
      const transactions: TransactionData[] = await accessAPIData(
        '/transactions',
        apiKey
      );
      console.log(currentBalance);
      console.log(transactions);
    } else {
      throw Error('API key missing.');
    }

    const historicalBalance = getHistoricalBalance();
    return res.json(historicalBalance);
  } catch (error) {
    console.log(error);
  }
});

export default app;
