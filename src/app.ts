import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';
import { getHistoricalBalance, accessAPIData } from './services/getAPIData';

import type { Request } from 'express';
import getDayBalance, {
  BalanceData,
  TransactionData,
} from './services/getDayBalance';

type QueryParams = {
  from: string;
  to: string;
  sort: 'asc' | 'desc';
};

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get(
  '/historical-balances',
  async (req: Request<unknown, unknown, unknown, QueryParams>, res) => {
    const apiKey = req.get('x-api-key');
    const { from, to, sort } = req.query;

    // validation for missing query parameters
    if (!from || !to || !sort) {
      return res.status(400).json({
        errorCode: 'BAD_REQUEST',
        description: 'Missing query paramaters.',
      });
    }

    const [fromDay, fromMonth, fromYear]: number[] = from
      .split('-')
      .map(Number);
    const [toDay, toMonth, toYear]: number[] = to.split('-').map(Number);

    const startDate = new Date(Date.UTC(fromYear, fromMonth - 1, fromDay));
    const endDate = new Date(Date.UTC(toYear, toMonth - 1, toDay));

    try {
      if (apiKey) {
        const currentBalance: BalanceData = await accessAPIData(
          '/balances',
          apiKey
        );
        const { transactions }: { transactions: TransactionData[] } =
          await accessAPIData('/transactions', apiKey);
        const filteredTransactions = transactions.filter(
          (transaction) => transaction.status === 'PROCESSED'
        );
        filteredTransactions.sort(
          (a, b) => Date.parse(b.date) - Date.parse(a.date)
        );

        const startDayBalance = getDayBalance(
          currentBalance,
          filteredTransactions,
          startDate
        );

        const endDayBalance = getDayBalance(
          startDayBalance,
          filteredTransactions,
          endDate
        );

        console.log(startDayBalance);
        console.log(
          filteredTransactions.filter(
            (transaction) =>
              new Date(transaction.date) < startDate &&
              new Date(transaction.date) > endDate
          )
        );
        console.log(endDayBalance);
      } else {
        return res.status(401).json({
          errorCode: 'INVALID_API_KEY',
          description: 'Invalid API key provided.',
        });
      }

      const historicalBalance = getHistoricalBalance();
      return res.json(historicalBalance);
    } catch (error) {
      console.log(error);
    }
  }
);

export default app;
